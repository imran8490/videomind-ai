import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(transcript: string): Promise<string> {
  if (!transcript) {
    throw new Error("Transcript is required.");
  }

  const response = await client.responses.create({
    model: "gpt-5.6",
    input: `
You are an AI assistant helping users understand video content.

Given the following transcript, generate:

1. A short summary (3-5 bullet points)
2. A detailed summary with headings
3. Key takeaways
4. Important topics discussed
5. Action items if applicable

Transcript:

${transcript}
`,
  });

  return response.output_text;
}
