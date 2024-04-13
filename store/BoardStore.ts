import { databases } from "@/appwrite";
import { getTasksGroupedByColumn } from "@/utility/getTasksGroupedByColumn";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTaskInDB: (task: Tasks, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
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
}));
