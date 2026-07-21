import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export async function generateQuiz(transcript: string): Promise<QuizQuestion[]> {
  if (!transcript) {
    throw new Error("Transcript is required.");
  }

  const prompt = `
You are an educational quiz generator.

Based ONLY on the transcript below, generate exactly 5 multiple-choice questions.

Rules:
- Each question must have exactly 4 options.
- Only one option is correct.
- Do not invent facts not present in the transcript.
- Return ONLY valid JSON.
- No markdown.
- No explanations.

Format:

{
  "quiz":[
    {
      "question":"...",
      "options":["...","...","...","..."],
      "answer":0
    }
  ]
}

Transcript:

${transcript}
`;

  const response = await client.responses.create({
    model: "gpt-5.6",
    input: prompt,
  });

  const text = response.output_text;

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Model returned invalid JSON for quiz.");
  }

  return parsed.quiz;
}
