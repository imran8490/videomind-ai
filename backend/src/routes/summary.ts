import { Router } from "express";
import { summarizeController } from "../controllers/summaryController";

const router = Router();

router.post("/summarize", summarizeController);

export default router;
