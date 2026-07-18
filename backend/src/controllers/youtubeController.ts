import { Request, Response } from "express";
import {
  isValidYouTubeUrl,
  getVideoInfo,
} from "../utils/youtube";

import {
  downloadYouTubeAudio,
  downloadYouTubeVideo,
} from "../services/youtubeService";

/**
 * POST /api/youtube
 *
 * Body:
 * {
 *   "url": "...",
 *   "downloadType": "audio" | "video"
 * }
 */
export const importYouTubeVideo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { url, downloadType = "audio" } = req.body;

    // Validate request
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "YouTube URL is required.",
      });
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(url)) {
      return res.status(400).json({
        success: false,
        message: "Invalid YouTube URL.",
      });
    }

    // Fetch metadata
    const metadata = await getVideoInfo(url);

    let downloadResult;

    if (downloadType === "video") {
      downloadResult = await downloadYouTubeVideo(url);
    } else {
      downloadResult = await downloadYouTubeAudio(url);
    }

    return res.status(200).json({
      success: true,
      message: "YouTube download completed successfully.",

      metadata: {
        id: metadata.id,
        title: metadata.title,
        author: metadata.author,
        duration: metadata.lengthSeconds,
        publishDate: metadata.publishDate,
        thumbnails: metadata.thumbnails,
      },

      download: {
        type: downloadType,
        filename: downloadResult.filename,
        filepath: downloadResult.filepath,
        size: downloadResult.size,
      },
    });
  } catch (error: any) {
    console.error("YouTube Import Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to import YouTube video.",
    });
  }
};
