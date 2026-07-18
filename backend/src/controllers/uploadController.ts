import { Request, Response } from "express";
import path from "path";

/**
 * POST /api/upload
 * Controller for handling video uploads
 */
export const uploadVideoController = (
  req: Request,
  res: Response
): Response => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file uploaded.",
      });
    }

    const file = req.file;

    return res.status(200).json({
      success: true,
      message: "Video uploaded successfully.",
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        extension: path.extname(file.originalname),
        path: file.path,
      },
    });
  } catch (error) {
    console.error("Upload Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while uploading video.",
    });
  }
};
