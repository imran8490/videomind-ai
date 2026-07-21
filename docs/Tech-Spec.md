# Technical Specification — VideoMind AI

## 1. System Overview

VideoMind AI converts long-form videos into searchable, interactive knowledge by orchestrating video ingestion, speech recognition, large language model reasoning, and conversational retrieval — all built with a Next.js frontend and an Express/TypeScript backend.

### High-Level Pipeline

User
│
▼
Frontend (Next.js + React + TypeScript)
│
▼
Backend API (Node.js / Express)
│
├──► Video Processing
│ │
│ ▼
│ Audio Extraction (FFmpeg)
│ │
│ ▼
│ Whisper Transcription
│ │
│ ▼
│ Timestamped Transcript
│
├──► GPT-5.6
│ ├── Summary
│ ├── Chat (grounded Q&A)
│ └── Quiz Generation
│
└──► Client-side Export (Markdown / PDF)

---

## 2. Architecture

### Frontend

**Responsibilities:**
- Video upload UI (drag/drop + file picker)
- Processing status/progress indicator
- Summary, quiz, transcript, and chat display
- Export (Markdown download, print-based PDF)
- Dark/light theme toggling

**Framework:** Next.js (App Router), React, TypeScript, Tailwind CSS

### Backend

**Responsibilities:**
- File upload handling (Multer)
- Audio extraction orchestration (FFmpeg)
- Whisper API integration
- GPT-5.6 orchestration (summary, chat, quiz)
- REST API for the frontend

**Framework:** Node.js, Express, TypeScript

### AI Layer

**Whisper**
- Speech-to-text transcription
- Timestamped segments

Output shape:
```json
{
  "text": "...",
  "segments": [
    { "id": 0, "start": 0.0, "end": 4.5, "text": "..." }
  ]
}
```

**GPT-5.6**

Used for three distinct tasks:

1. **Summarization** — produces short summary, detailed summary, key takeaways, topics discussed, and action items from the transcript.
2. **Grounded Chat** — answers user questions using only the transcript as context, explicitly instructed to refuse (not hallucinate) when information isn't present.
3. **Quiz Generation** — produces exactly 5 multiple-choice questions (4 options each, 1 correct answer) strictly from transcript content, returned as structured JSON.

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) |
| UI | React |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Backend | Node.js |
| API | Express |
| AI | OpenAI GPT-5.6 |
| Speech Recognition | OpenAI Whisper |
| Video Processing | FFmpeg (via fluent-ffmpeg) |
| File Uploads | Multer |
| HTTP Client | fetch (native) |
| Dev Tooling | OpenAI Codex CLI |

---

## 4. Module Design

### Upload Module
- Validates file type (MP4/MOV) and size
- Stores video in `uploads/` with a unique filename
- Returns `videoId`/filename to the client

### Audio Extraction Module
- Uses `fluent-ffmpeg` to extract a 16kHz mono WAV file optimized for Whisper
- Input: video file path → Output: `.wav` file path

### Transcription Module
- Sends the extracted `.wav` file to Whisper (`whisper-1`)
- Requests `verbose_json` for segment-level timestamps
- Returns full text + segments array

### Summary Module
- Sends transcript text to GPT-5.6 with a structured prompt
- Returns a single formatted markdown-style summary string covering: short summary, detailed summary, key takeaways, topics, and action items

### Chat Module
- Accepts `{ transcript, question }`
- System prompt instructs GPT-5.6 to answer **only** from the transcript and explicitly state when information is unavailable
- Returns a grounded answer string

### Quiz Module
- Accepts `{ transcript }`
- Prompts GPT-5.6 to return strictly valid JSON: 5 questions, 4 options each, one correct answer index
- Parsed and returned to the frontend for interactive rendering

### Export Module (Client-side)
- **Markdown:** Constructs a `.md` file (Summary + Transcript) as a Blob and triggers a browser download
- **PDF:** Uses `window.print()` with dedicated print CSS (`.no-print` utility class + `@media print` rules) to hide navigation/upload UI and expand scrollable sections for full-content printing

---

## 5. REST API Design

### Health Check

GET /health

Response:
```json
{ "success": true, "status": "ok", "service": "VideoMind AI Backend" }
```

### Upload Video

POST /api/upload

Request: `multipart/form-data` (field: `video`)
Response:
```json
{
  "success": true,
  "data": { "filename": "video-<timestamp>-<rand>.mp4", "size": 12345, "path": "..." }
}
```

### Extract Audio

POST /api/extract-audio

Request:
```json
{ "filename": "video-<timestamp>.mp4" }
```
Response:
```json
{ "success": true, "data": { "output": "uploads/video-<timestamp>.wav" } }
```

### Transcribe

POST /api/transcribe

Request:
```json
{ "filename": "video-<timestamp>.wav" }
```
Response:
```json
{
  "success": true,
  "data": {
    "text": "...",
    "language": "english",
    "duration": 34.2,
    "segments": [ { "id": 0, "start": 0, "end": 7, "text": "..." } ]
  }
}
```

### Summarize

POST /api/summarize

Request:
```json
{ "transcript": "..." }
```
Response:
```json
{ "success": true, "data": { "summary": "## Short Summary\n..." } }
```

### Chat

POST /api/chat

Request:
```json
{ "transcript": "...", "question": "What is a stack?" }
```
Response:
```json
{ "success": true, "data": { "answer": "..." } }
```

### Quiz

POST /api/quiz

Request:
```json
{ "transcript": "..." }
```
Response:
```json
{
  "success": true,
  "data": {
    "quiz": [
      { "question": "...", "options": ["...","...","...","..."], "answer": 1 }
    ]
  }
}
```

---

## 6. Data Flow

Upload Video
↓
Backend Validation (Multer + extension/type check)
↓
FFmpeg Audio Extraction (16kHz mono WAV)
↓
Whisper Transcription (timestamped)
↓
GPT-5.6 Summary Generation
↓
[Parallel, user-triggered]
├── GPT-5.6 Chat (grounded Q&A, repeatable)
├── GPT-5.6 Quiz Generation (5 MCQs, scoring client-side)
└── Client-side Export (Markdown / PDF)


---

## 7. Error Handling

| Scenario | Handling |
|---|---|
| Invalid file type | HTTP 400 with supported formats message |
| Missing transcript/question on chat | HTTP 400 |
| File not found for extraction/transcription | HTTP 404 |
| FFmpeg failure | Caught and returned as HTTP 500 with error message |
| OpenAI API quota/billing error | Propagated with descriptive message (`insufficient_quota`, `billing_not_active`) for debugging |
| Malformed quiz JSON from model | Caught, returns HTTP 500 with "invalid JSON" message rather than crashing |

---

## 8. Security

- API keys (`OPENAI_API_KEY`) stored server-side only, loaded via `.env`, never exposed to the frontend
- Uploaded filenames sanitized with `path.basename()` to prevent path traversal
- File type/size validation before processing
- CORS enabled for local frontend-backend communication
- Temporary uploads stored in a dedicated `uploads/` directory

---

## 9. Deployment Architecture (Local Dev)

User Browser
│
▼
Next.js Frontend (localhost:3000)
│
REST API (fetch)
│
▼
Express Backend (localhost:5000)
│
├── FFmpeg (local binary)
├── OpenAI Whisper API
└── OpenAI GPT-5.6 API
│
▼
Local filesystem (uploads/)


---

## 10. OpenAI Build Week Alignment

### GPT-5.6 Usage

- Structured video summarization
- Grounded conversational Q&A (hallucination-resistant)
- Multiple-choice quiz generation from transcript content

### Codex Usage

- Implemented the "Copy Transcript" feature (state, clipboard API, UI, confirmation) directly in the repository
- Diagnosed and fixed a results-panel rendering regression
- Implemented premium dark-mode UI styling and scroll-reveal animations
- Verified each change with `npm run lint`, `npx tsc --noEmit`, and `npm run build` before completion

---

## 11. Deliverables

- Working web application supporting the full pipeline: Upload → FFmpeg → Whisper → GPT-5.6 Summary → GPT-5.6 Chat/Quiz → Export
- Responsive, animated dark/light-mode UI
- Public GitHub repository with README, PRD, and this Technical Specification
- Demo video (<3.4 minutes) showing the complete workflow
