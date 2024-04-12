import { DropResult } from "@hello-pangea/dnd";

export const handleOnDragEnd = (
  result: DropResult,
  board: Board,
  setBoardState: (board: Board) => void,
  updateTaskInDB: (task: Tasks, columnId: TypedColumn) => void
) => {
  const { destination, source, type } = result;

  //if user drags card outside board
  if (!destination) return;

  //handle column drag
  if (type === "column") {
    const entries = Array.from(board.columns.entries());
    const [removed] = entries.splice(source.index, 1);
    entries.splice(destination.index, 0, removed);
    const rearrangedColumns = new Map(entries);

    setBoardState({
      ...board,
      columns: rearrangedColumns,
    });
  }

  //This step is needed as shte indexes are stored as numbers 0,1,2 etc instead of id's with the DND library
  const columns = Array.from(board.columns);
  const startColIndex = columns[Number(source.droppableId)];
  const finishColIndex = columns[Number(destination.droppableId)];

  const startCol: Column = {
    id: startColIndex[0],
    tasks: startColIndex[1].tasks,
  };

  const finishCol: Column = {
    id: finishColIndex[0],
    tasks: finishColIndex[1].tasks,
  };

  if (!startCol || !finishCol) return;

  if (source.index === destination.index && startCol === finishCol) return;

  const newTasks = startCol.tasks;
  const [taskMoved] = newTasks.splice(source.index, 1);

  if (startCol.id == finishCol.id) {
    //same column task drag
    newTasks.splice(destination.index, 0, taskMoved);

    const newCol = {
      id: startCol.id,
      tasks: newTasks,
    };

    const newColumns = new Map(board.columns);
    newColumns.set(startCol.id, newCol);

    setBoardState({ ...board, columns: newColumns });
  } else {
    //dragging to another column
    const finishTasks = Array.from(finishCol.tasks);
    finishTasks.splice(destination.index, 0, taskMoved);

    const newCol = {
      id: startCol.id,
      tasks: newTasks,
    };

    const newColumns = new Map(board.columns);
    newColumns.set(startCol.id, newCol);
    newColumns.set(finishCol.id, {
      id: finishCol.id,
      tasks: finishTasks,
    });

    //Update DB
    updateTaskInDB(taskMoved, finishCol.id);
    setBoardState({ ...board, columns: newColumns });
  }
};
