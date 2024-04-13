import formatTasksForAI from "./formatTasksForAI";

const fetchSuggestion = async (board: Board) => {
  const tasks = formatTasksForAI(board);
  console.log("Formatted Tasks: ", tasks);
  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tasks }),
  });

  const GPTdata = await res.json();
  const { content } = GPTdata;

  return content;
};

export default fetchSuggestion;
