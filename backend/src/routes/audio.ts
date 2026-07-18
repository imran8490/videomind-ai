import { Router } from "express";
import { extractAudioController } from "../controllers/audioController";

const router = Router();

/**
 * POST /api/extract-audio
 *
 * Request Body:
 * {
 *   "filename": "video-1721140000.mp4"
 * }
 */
router.post("/extract-audio", extractAudioController);

export default router;
