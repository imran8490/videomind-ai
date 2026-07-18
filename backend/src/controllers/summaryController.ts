import { Request, Response } from "express";
import { generateSummary } from "../services/summaryService";

/**
 * POST /api/summarize
 *
 * Body:
 * {
 *   "transcript": "full transcript text..."
 * }
 */
export const summarizeController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        success: false,
        message: "Transcript is required.",
      });
    }

    const summary = await generateSummary(transcript);

    return res.status(200).json({
      success: true,
      message: "Summary generated successfully.",
      data: {
        summary,
      },
    });
  } catch (error: any) {
    console.error("Summary Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to generate summary.",
    });
  }
};
