import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function answerQuestion(
  transcript: string,
  question: string
): Promise<string> {
  if (!transcript || !question) {
    throw new Error("Transcript and question are required.");
  }

  const response = await client.responses.create({
    model: "gpt-5.6",
    input: [
      {
        role: "system",
        content: `
You answer questions ONLY using the provided transcript.

Rules:
- If the answer is not in the transcript, say:
  "The transcript does not contain that information."
- Never invent facts.
- Quote short excerpts when useful.
`,
      },
      {
        role: "user",
        content: `Transcript:

${transcript}

Question:

${question}`,
      },
    ],
  });

  return response.output_text;
}
