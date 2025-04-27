import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("Key length:", process.env.OPENAI_API_KEY?.length);

  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: `
      You are the AI assistant for Parth's TSI pilot-app. Your job is to:
      1. Understand the user's technical question.
      2. Use only the FAA Handbook content loaded in Pinecone.
      3. Answer in a concise, conversational tone—informal but precise.
      4. Cite the handbook section or page when relevant.
      5. If the answer isn't in the handbook, respond “I don't have that in my data.”
      `,
    messages,
  });


  return result.toDataStreamResponse();
}
