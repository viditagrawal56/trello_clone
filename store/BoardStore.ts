import { ID, databases, storage } from "@/appwrite";
import { getTasksGroupedByColumn } from "@/utility/getTasksGroupedByColumn";
import uploadImage from "@/utility/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  searchString: string;
  newTaskInput: string;
  newTaskType: TypedColumn;
  image: File | null;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  setSearchString: (searchString: string) => void;
  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  setImage: (image: File | null) => void;
  updateTaskInDB: (task: Tasks, columnId: TypedColumn) => void;
  deleteTask: (taskIndex: number, taskId: Tasks, id: TypedColumn) => void;
  addTask: (task: string, columnId: TypedColumn, image?: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  searchString: "",

  newTaskInput: "",

  newTaskType: "todo",

  image: null,

  getBoard: async () => {
    const board = await getTasksGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  setSearchString: (searchString) => set({ searchString }),

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

  setImage: (image: File | null) => {
    set({ image });
  },

  updateTaskInDB: async (task, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASK_COLLECTION_ID!,
      task.$id,
      {
        title: task.title,
        status: columnId,
      }
    );
  },

  deleteTask: async (taskIndex: number, task: Tasks, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    //delete the task
    newColumns.get(id)?.tasks.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    //handle delete for images
    if (task.image) {
      await storage.deleteFile(task.image.bucketId, task.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASK_COLLECTION_ID!,
      task.$id
    );
  },

  addTask: async (task: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASK_COLLECTION_ID!,
      ID.unique(),
      {
        title: task,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    //clear the task input field so that when a new modal appears after submitting its blank
    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTask: Tasks = {
        $id,
        $createdAt: new Date().toISOString(),
        title: task,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          tasks: [newTask],
        });
      } else {
        newColumns.get(columnId)?.tasks.push(newTask);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
}));
