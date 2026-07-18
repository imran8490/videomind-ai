import { Router } from "express";
import { transcribeAudioController } from "../controllers/whisperController";

const router = Router();

/**
 * POST /api/transcribe
 *
 * Body:
 * {
 *   "filename": "video-1721140000.wav"
 * }
 */
router.post("/transcribe", transcribeAudioController);

export default router;
