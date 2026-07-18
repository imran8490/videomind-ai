import { Request, Response } from "express";
import { answerQuestion } from "../services/chatService";

/**
 * POST /api/chat
 *
 * Body:
 * {
 *   "transcript": "...",
 *   "question": "..."
 * }
 */
export const chatController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { transcript, question } = req.body;

    if (!transcript || !question) {
      return res.status(400).json({
        success: false,
        message: "Transcript and question are required.",
      });
    }

    const answer = await answerQuestion(transcript, question);

    return res.status(200).json({
      success: true,
      message: "Answer generated successfully.",
      data: {
        answer,
      },
    });
  } catch (error: any) {
    console.error("Chat Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to generate answer.",
    });
  }
};
