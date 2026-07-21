import { Request, Response } from "express";
import { generateQuiz } from "../services/quizService";

export const quizController = async (
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

    const quiz = await generateQuiz(transcript);

    return res.status(200).json({
      success: true,
      message: "Quiz generated successfully.",
      data: {
        quiz,
      },
    });
  } catch (error: any) {
    console.error("Quiz Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to generate quiz.",
    });
  }
};
