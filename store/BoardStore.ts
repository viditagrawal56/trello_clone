import { databases, storage } from "@/appwrite";
import { getTasksGroupedByColumn } from "@/utility/getTasksGroupedByColumn";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTaskInDB: (task: Tasks, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTask: (taskIndex: number, taskId: Tasks, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    const board = await getTasksGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

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

  searchString: "",

  setSearchString: (searchString) => set({ searchString }),

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
}));
