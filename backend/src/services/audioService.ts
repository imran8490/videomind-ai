import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export interface AudioExtractionResult {
  success: boolean;
  input: string;
  output: string;
  duration?: number;
}

const uploadDir =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

/**
 * Extract 16kHz mono WAV audio from a video file.
 * Output format is optimized for OpenAI Whisper.
 */
export async function extractAudio(
  videoPath: string
): Promise<AudioExtractionResult> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(videoPath)) {
      return reject(new Error("Input video file not found."));
    }

    const ext = path.extname(videoPath);

    const outputPath = videoPath.replace(ext, ".wav");

    ffmpeg(videoPath)
      .noVideo()
      .audioCodec("pcm_s16le")
      .audioChannels(1)
      .audioFrequency(16000)
      .format("wav")
      .on("start", (commandLine) => {
        console.log("=================================");
        console.log("FFmpeg Started");
        console.log(commandLine);
        console.log("=================================");
      })
      .on("progress", (progress) => {
        if (progress.percent) {
          console.log(
            `Audio Extraction: ${progress.percent.toFixed(1)}%`
          );
        }
      })
      .on("end", () => {
        console.log("Audio extraction completed.");

        resolve({
          success: true,
          input: videoPath,
          output: outputPath,
        });
      })
      .on("error", (err) => {
        reject(new Error(`FFmpeg Error: ${err.message}`));
      })
      .save(outputPath);
  });
}

/**
 * Verify that the generated audio file exists.
 */
export function audioExists(audioPath: string): boolean {
  return fs.existsSync(audioPath);
}

/**
 * Delete an extracted audio file.
 */
export function deleteAudio(audioPath: string): void {
  if (fs.existsSync(audioPath)) {
    fs.unlinkSync(audioPath);
  }
}
