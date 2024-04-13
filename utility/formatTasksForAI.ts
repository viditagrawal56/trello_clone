const formatTasksForAI = (board: Board) => {
  const tasks = Array.from(board.columns.entries());

  console.log("Array: ", tasks);

  const flatArray = tasks.reduce((map, [key, value]) => {
    map[key] = value.tasks;
    return map;
  }, {} as { [key in TypedColumn]: Tasks[] });

  console.log("flat Array: ", flatArray);

  //reduce to key: value(length)
  const flatArrayCounted = Object.entries(flatArray).reduce(
    (map, [key, value]) => {
      map[key as TypedColumn] = value.length;
      return map;
    },
    {} as { [key in TypedColumn]: Number }
  );
  console.log("flat Array Counted: ", flatArrayCounted);

  return flatArrayCounted;
};

export default formatTasksForAI;
