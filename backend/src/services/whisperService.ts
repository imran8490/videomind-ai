import fs from "fs";
import path from "path";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface WhisperResult {
  success: boolean;
  filename: string;
  language?: string;
  duration?: number;
  text: string;
  segments: TranscriptSegment[];
}

/**
 * Transcribe an extracted WAV file using OpenAI.
 */
export async function transcribeAudio(
  audioPath: string
): Promise<WhisperResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  if (!fs.existsSync(audioPath)) {
    throw new Error("Audio file not found.");
  }

  const extension = path.extname(audioPath).toLowerCase();

  if (![".wav", ".mp3", ".m4a"].includes(extension)) {
    throw new Error("Unsupported audio format.");
  }

  console.log("=================================");
  console.log("Whisper Transcription Started");
  console.log(audioPath);
  console.log("=================================");

  const response: any = await client.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-1",
    response_format: "verbose_json",
  });

  const segments: TranscriptSegment[] = Array.isArray(response.segments)
    ? response.segments.map((segment: any) => ({
        id: segment.id,
        start: segment.start,
        end: segment.end,
        text: segment.text,
      }))
    : [];

  return {
    success: true,
    filename: path.basename(audioPath),
    language: response.language,
    duration: response.duration,
    text: response.text,
    segments,
  };
}
