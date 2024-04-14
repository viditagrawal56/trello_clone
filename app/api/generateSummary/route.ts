import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //tasks in the body of the POST req
  const { tasks } = await request.json();

  //communicate with OpenAI GPT
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "When responding, welcome the user and say welcome to GPTrello! Limit the response to 200 characters ",
      },

      {
        role: "user",
        content: `Provide a summary of the following tasks, the tasks are divided into 3 categories; todo, inprogress and completed. tell me in a concise manner the summary of all the tasks and what I have to do throughout the day, then tell the user to have a productive day! Here's the data: ${JSON.stringify(
          tasks
        )}`,
      },
    ],
  });

  const { choices } = response;

  return NextResponse.json(choices[0].message);
}
