import fs from "fs";
import path from "path";
import ytdl from "@distube/ytdl-core";
import { validateVideo } from "../utils/youtube";

const uploadDir =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export interface DownloadResult {
  videoId: string;
  title: string;
  filename: string;
  filepath: string;
  size?: number;
}

/**
 * Download a YouTube video for later FFmpeg processing.
 */
export async function downloadYouTubeVideo(
  url: string
): Promise<DownloadResult> {
  const info = await validateVideo(url);

  const safeTitle = info.title
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 60);

  const filename = `${Date.now()}-${safeTitle}.mp4`;
  const filepath = path.join(uploadDir, filename);

  return new Promise((resolve, reject) => {
    const videoStream = ytdl(url, {
      quality: "highest",
      filter: "audioandvideo",
    });

    const fileStream = fs.createWriteStream(filepath);

    videoStream.pipe(fileStream);

    videoStream.on("error", (err) => {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });

    fileStream.on("error", (err) => {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });

    fileStream.on("finish", () => {
      const stats = fs.statSync(filepath);

      resolve({
        videoId: info.id,
        title: info.title,
        filename,
        filepath,
        size: stats.size,
      });
    });
  });
}

/**
 * Download audio-only stream.
 * Recommended for Whisper transcription to reduce bandwidth and storage.
 */
export async function downloadYouTubeAudio(
  url: string
): Promise<DownloadResult> {
  const info = await validateVideo(url);

  const safeTitle = info.title
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 60);

  const filename = `${Date.now()}-${safeTitle}.mp4`;
  const filepath = path.join(uploadDir, filename);

  return new Promise((resolve, reject) => {
    const audioStream = ytdl(url, {
      quality: "highest",
      filter: "audioandvideo",
    });

    const fileStream = fs.createWriteStream(filepath);

    audioStream.pipe(fileStream);

    audioStream.on("error", (err) => {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });

    fileStream.on("error", (err) => {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });

    fileStream.on("finish", () => {
      const stats = fs.statSync(filepath);

      resolve({
        videoId: info.id,
        title: info.title,
        filename,
        filepath,
        size: stats.size,
      });
    });
  });
}
