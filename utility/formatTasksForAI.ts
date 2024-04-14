const formatTasksForAI = (board: Board) => {
  const tasks = Array.from(board.columns.entries());

  const flatArray = tasks.reduce((map, [key, value]) => {
    map[key] = value.tasks;
    return map;
  }, {} as { [key in TypedColumn]: Tasks[] });

  //reduce to key: value(length)
  const flatArrayCounted = Object.entries(flatArray).reduce(
    (map, [key, value]) => {
      map[key as TypedColumn] = value.length;
      return map;
    },
    {} as { [key in TypedColumn]: Number }
  );

  return flatArrayCounted;
};

export default formatTasksForAI;
