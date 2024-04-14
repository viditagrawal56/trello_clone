import formatTasksForAI from "./formatTasksForAI";

const fetchSuggestion = async (board: Board) => {
  const tasks = formatTasksForAI(board);
  try {
    const res = await fetch("/api/generateSummary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tasks }),
    });
    if (res.status === 500)
      return "You exceeded your current quota, please check your plan and billing details!";
    const GPTdata = await res.json();
    const { content } = GPTdata;
    return content;
  } catch (e) {
    console.log("error: ", e);
  }
};

export default fetchSuggestion;
