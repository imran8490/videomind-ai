import multer from "multer";
import fs from "fs";
import path from "path";
import { Request } from "express";

const uploadDir =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);

    cb(null, `video-${timestamp}-${random}${ext}`);
  },
});

// Allowed MIME types
const allowedMimeTypes = [
  "video/mp4",
  "video/quicktime",
];

// Allowed extensions
const allowedExtensions = [".mp4", ".mov"];

// File validation
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const validMime = allowedMimeTypes.includes(file.mimetype);
  const validExt = allowedExtensions.includes(ext);
console.log("Original:", file.originalname);
console.log("Extension:", ext);
console.log("Mime Type:", file.mimetype);
  if (validExt && validMime) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Invalid file type. Only MP4 and MOV video files are allowed."
    )
  );
};

// Multer Upload Instance
export const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 500 * 1024 * 1024,
    files: 1,
  },
});

// Middleware for single video upload
export const uploadVideo = upload.single("video");
