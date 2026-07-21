# VideoMind AI

**Turn any video into instant, searchable knowledge.**

Built for OpenAI Build Week 2026, using **Codex** and **GPT-5.6**.

---

## Overview

VideoMind AI transforms any uploaded video into a complete knowledge package — transcript, AI summary, an interactive quiz, and a grounded chat assistant that answers questions using only the video's content.

Instead of rewatching long videos to find one piece of information, users get instant, structured, searchable knowledge.

---

## Features

| Feature | Description |
|---|---|
| 🎥 Video Upload | Upload MP4/MOV files directly |
| 🎙️ Transcription | Whisper generates accurate, timestamped transcripts |
| 📝 AI Summary | GPT-5.6 produces short & detailed summaries, key takeaways, and topics |
| 💬 Grounded AI Chat | Ask questions about the video — answers are strictly grounded in the transcript (no hallucination) |
| 🧠 Quiz Generator | GPT-5.6 generates a 5-question multiple-choice quiz with scoring |
| 📄 Export | Download the summary and transcript as Markdown or PDF |
| 📋 Copy Transcript | One-click clipboard copy |
| 🌓 Dark / Light Mode | Fully themed, responsive UI |

---

## Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS
**Backend:** Node.js, Express, TypeScript
**AI/ML:** OpenAI Whisper (transcription), OpenAI GPT-5.6 (summarization, chat, quiz generation)
**Media Processing:** FFmpeg (audio extraction)
**Dev Tooling:** OpenAI Codex (backend development, feature implementation, bug fixes)

---

## Architecture

Video Upload
│
▼
FFmpeg Audio Extraction
│
▼
Whisper Transcription
│
▼
GPT-5.6 Summarization ──► GPT-5.6 Chat (grounded Q&A)
│ │
▼ ▼
Export (MD/PDF) GPT-5.6 Quiz Generation

---

## Getting Started

### Prerequisites
- Node.js 18+
- FFmpeg installed on your system
- An OpenAI API key with GPT-5.6 and Whisper access

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd videomind-ai
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key
UPLOAD_DIR=uploads
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Set up the frontend

In a new terminal, from the project root:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Use the app

1. Open `http://localhost:3000`
2. Upload an MP4/MOV video
3. Click **Process Video**
4. Explore the generated summary, quiz, transcript, and chat

---

## API Endpoints (Backend)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/upload` | Upload a video file |
| POST | `/api/extract-audio` | Extract audio from an uploaded video |
| POST | `/api/transcribe` | Transcribe audio using Whisper |
| POST | `/api/summarize` | Generate a summary using GPT-5.6 |
| POST | `/api/chat` | Ask a grounded question about the transcript |
| POST | `/api/quiz` | Generate a multiple-choice quiz from the transcript |

---

## How Codex Was Used

Codex (via the Codex CLI, authenticated with ChatGPT) was used directly inside this repository to:
- Add the **Copy Transcript** feature end-to-end (state, clipboard logic, UI, and confirmation message)
- Diagnose and fix a regression in the results panel after a styling update
- Implement premium dark-mode UI styling, scroll-reveal animations, and hover interactions
- Verify all changes using `npm run lint`, `npx tsc --noEmit`, and `npm run build` before completing each session

---

## Project Structure

videomind-ai/
├── app/
│ ├── page.tsx # Main frontend UI
│ └── globals.css # Styles (including print/PDF export styles)
├── backend/
│ └── src/
│ ├── server.ts
│ ├── routes/ # API route definitions
│ ├── controllers/ # Request handlers
│ ├── services/ # Whisper, GPT-5.6, FFmpeg logic
│ └── middleware/ # Upload validation (Multer)
└── README.md

---

## Built With

- Next.js
- React
- TypeScript
- Tailwind CSS
- Node.js
- Express
- OpenAI Whisper
- OpenAI GPT-5.6
- FFmpeg
- OpenAI Codex

---

## Author

Built by **Imrankhan** for OpenAI Build Week 2026.

## License

MIT License