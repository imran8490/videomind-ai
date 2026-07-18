import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import uploadRoutes from "./routes/upload";
import youtubeRoutes from "./routes/youtube";
import audioRoutes from "./routes/audio";
import whisperRoutes from "./routes/whisper";
import summaryRoutes from "./routes/summary";
import chatRoutes from "./routes/chat";
dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const uploadDir =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadDir));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "VideoMind AI Backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", uploadRoutes);
app.use("/api", youtubeRoutes);
app.use("/api", audioRoutes);
app.use("/api", whisperRoutes);
app.use("/api", summaryRoutes);
app.use("/api", chatRoutes);
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "VideoMind AI Backend Running",
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Maximum upload size is 500MB.",
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error.",
    });
  }
);

app.listen(PORT, () => {
  console.log("==================================");
  console.log("🚀 VideoMind AI Backend");
  console.log("==================================");
  console.log(`Port       : ${PORT}`);
  console.log(`Health     : http://localhost:${PORT}/health`);
  console.log(`Upload API : http://localhost:${PORT}/api/upload`);
  console.log(`YouTube API: http://localhost:${PORT}/api/youtube`);
  console.log("==================================");
});
