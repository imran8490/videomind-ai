import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { extractAudio } from "../services/audioService";

/**
 * POST /api/extract-audio
 *
 * Body:
 * {
 *   "filename": "video-1721140000.mp4"
 * }
 */
export const extractAudioController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required.",
      });
    }

    const uploadDir =
      process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

    const videoPath = path.join(uploadDir, filename);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        success: false,
        message: "Video file not found.",
      });
    }

    const allowedExtensions = [
      ".mp4",
      ".mov",
      ".mkv",
      ".avi",
      ".webm",
    ];

    const extension = path.extname(videoPath).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported video format.",
      });
    }

    const result = await extractAudio(videoPath);

    return res.status(200).json({
      success: true,
      message: "Audio extracted successfully.",

      data: {
        input: result.input,
        output: result.output,
        filename: path.basename(result.output),
      },
    });
  } catch (error: any) {
    console.error("Audio Extraction Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to extract audio.",
    });
  }
};
