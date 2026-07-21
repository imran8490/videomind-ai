import { Router } from "express";
import { uploadVideo } from "../middleware/upload";
import {
  uploadVideoController,
} from "../controllers/uploadController";

const router = Router();

/**
 * POST /api/upload
 * Upload a single MP4/MOV video
 */
router.post(
  "/upload",
  uploadVideo,
  uploadVideoController
);

export default router;
