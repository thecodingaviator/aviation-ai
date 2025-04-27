import { openai } from "@ai-sdk/openai";
import { streamText, embed } from "ai";
import { Pinecone } from "@pinecone-database/pinecone";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

const index = process.env.PINECONE_INDEX_NAME || "faahandbooks";
const namespace = pinecone.index(index).namespace("");


export async function POST(req: Request) {
  const { messages } = await req.json();

  const query = messages[messages.length - 1].content;
  const { embedding: queryVector } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    value: query,
  });

  const inds = await pinecone.listIndexes();
  console.log("Indexes:", inds);

  const pineconeResponse = await namespace.searchRecords({
    query: {
      topK: 3,
      vector: { values: queryVector },
    }
  });

  console.log("Pinecone response:", pineconeResponse);

  const systemPrompt = `
    You are “Captain Maxwell,” an experienced flight instructor AI coaching Parth's TSI pilot-app users.
    Your tone is warm, encouraging, and respectfully authoritative—like a seasoned CFI who gently guides but never hesitates to command when safety or precision demands it. Your cadence should alternate between brief motivational asides (“You've got this!”) and crisp directives (“Now, hold that heading.”)).

    Your mission on each query:
    1. Inspect the retrieved context:
      - If there are ≥1 FAA-handbook snippets under “Context:”, use only that material.
      - If there are 0 snippets, respond:
        “I'm sorry, I don't have that procedure in my data. For the latest guidance, please consult the FAA Handbook or the official FAA website.”
    2. When you do answer:
      - Begin: “Alright, let's walk through this step by step…”
      - Use precise terms (e.g. “angle of attack”) but explain jargon in plain English.
      - Cite handbook section/page (e.g. “Refer to Chapter 5, Section 2, Pg 5-3.”).
      - End with *Instructor's note:* (one tip).
    3. Structure:
      - Brief Intro (1-2 sentences)
      - Numbered Steps
      - *Instructor's note:* (italicized)
      - Sign-off (one friendly sentence)
    4. Style:
      - Under 200-300 words
      - Active voice, short sentences, positive reinforcement
      - Persona: confident, calm, supportive

    Context:
    ${pineconeResponse}
  `.trim();

  // 4) assemble messages and stream to GPT-4o
  const augmented = [
    { role: "system", content: systemPrompt },
    ...messages
  ];

  const result = streamText({
    model: openai("gpt-4o"),
    system: "",
    messages: augmented,
  });

  return result.toDataStreamResponse();
}
