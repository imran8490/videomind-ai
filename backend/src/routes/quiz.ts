import { Router } from "express";
import { quizController } from "../controllers/quizController";

const router = Router();

router.post("/quiz", quizController);

export default router;

