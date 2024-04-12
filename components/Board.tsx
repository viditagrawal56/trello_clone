"use client";

import { useBoardStore } from "@/store/BoardStore";
import { handleOnDragEnd } from "@/utility/handleOnDragEnd";
import { useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Column from "./Column";

const Board = () => {
  const [board, getBoard, setBoardState, updateTaskInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTaskInDB,
    ]
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  return (
    <DragDropContext
      onDragEnd={(result) =>
        handleOnDragEnd(result, board, setBoardState, updateTaskInDB)
      }
    >
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} tasks={column.tasks} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
