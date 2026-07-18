import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { transcribeAudio } from "../services/whisperService";

/**
 * POST /api/transcribe
 *
 * Body:
 * {
 *   "filename": "video-1721140000.wav"
 * }
 */
export const transcribeAudioController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { filename } = req.body;

    // Validate request
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required.",
      });
    }

    // Prevent path traversal attacks
    const safeFilename = path.basename(filename);

    // Upload directory
    const uploadDir =
      process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

    const audioPath = path.join(uploadDir, safeFilename);

    // Check file exists
    if (!fs.existsSync(audioPath)) {
      return res.status(404).json({
        success: false,
        message: "Audio file not found.",
      });
    }

    // Validate file extension
    const allowedExtensions = [".wav", ".mp3", ".m4a"];

    const extension = path.extname(audioPath).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return res.status(400).json({
        success: false,
        message:
          "Unsupported audio format. Supported formats: WAV, MP3, M4A.",
      });
    }

    console.log("=================================");
    console.log("Starting Whisper transcription...");
    console.log(audioPath);
    console.log("=================================");

    // Transcribe audio
    const transcript = await transcribeAudio(audioPath);

    return res.status(200).json({
      success: true,
      message: "Transcription completed successfully.",
      data: transcript,
    });
  } catch (error: any) {
    console.error("Whisper Controller Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.message || "Failed to transcribe audio.",
    });
  }
};
