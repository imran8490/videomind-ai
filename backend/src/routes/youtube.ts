import { Router } from "express";
import { importYouTubeVideo } from "../controllers/youtubeController";

const router = Router();

/**
 * POST /api/youtube
 *
 * Body:
 * {
 *   "url": "https://www.youtube.com/watch?v=...",
 *   "downloadType": "audio" | "video"
 * }
 */
router.post("/youtube", importYouTubeVideo);

export default router;
