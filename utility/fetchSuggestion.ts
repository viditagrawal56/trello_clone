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
      return `We ran out of credits :') The result would have been something like ("Today, take the cat for a walk, go for a walk, and finish preparing the Toursheet—have a productive day!")`;
    const GPTdata = await res.json();
    const { content } = GPTdata;
    return content;
  } catch (e) {
    console.log("error: ", e);
  }
};

export default fetchSuggestion;
