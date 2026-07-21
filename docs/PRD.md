# Product Requirements Document (PRD)

## Project Name
VideoMind AI

## Tagline
Transform any video into searchable, interactive knowledge powered by AI.

---

## Executive Summary

VideoMind AI enables users to convert long-form videos into structured knowledge within minutes. By combining automatic transcription, AI-powered summarization, quiz generation, and conversational question answering, users can learn from videos without rewatching hours of content.

The platform accepts uploaded video files and produces transcripts, summaries, an interactive quiz, and an AI assistant capable of answering questions grounded strictly in the video's content.

---

## Problem Statement

Millions of people consume educational lectures, tutorials, meetings, and conference talks every day. However:

- Important information is buried inside long videos.
- Users waste time searching for specific moments.
- Traditional transcripts are difficult to navigate.
- Existing tools lack intelligent search, summarization, and contextual Q&A in one place.

Users need an AI-powered system that converts passive video content into interactive, structured knowledge.

---

## Vision

Create an AI-powered knowledge engine where every video becomes searchable, understandable, and conversational — reducing hours of watching into minutes of focused learning.

---

## Goals

### Primary Goals
- Reduce time spent consuming long videos
- Improve knowledge retention and discovery
- Enable conversational, grounded interaction with video content
- Make educational and informational videos easier to learn from and test understanding of

### Business / Hackathon Goals
- Demonstrate GPT-5.6 capabilities across multiple use cases (summarization, chat, quiz generation)
- Showcase Codex-assisted development in a real, working codebase
- Build a polished, hackathon-ready MVP
- Create a foundation for future SaaS expansion

---

## Target Users

### Primary Users
**Students** — need lecture summaries, study notes, and the ability to test their understanding
**Professionals** — need meeting summaries and training video breakdowns
**Researchers** — need to extract findings from interviews and technical talks
**Content Creators** — need to review and document long recordings

### Secondary Users
Teachers, journalists, and teams documenting internal meetings.

---

## User Personas

**Sarah (Student)**
> "I have a two-hour lecture and only need the important concepts before tomorrow's exam."
Success: Gets a concise summary, a quiz to self-test, and can ask follow-up questions.

**Alex (Professional)**
> "I recorded today's team meeting but need the key decisions and action items."
Success: Generates a structured summary instantly.

**Maya (Researcher)**
> "I need to pull specific findings from a long interview."
Success: Searches the transcript and asks targeted questions grounded in the source.

---

## Core MVP Features (Must Have)

### 1. Video Input
- Upload MP4 or MOV files
- File type and size validation

### 2. Audio Extraction
- Automatic audio extraction using FFmpeg

### 3. Speech Recognition
- Transcription via OpenAI Whisper
- Timestamped segments

### 4. AI Summary
- Short summary (bullet points)
- Detailed summary (with headings)
- Key takeaways
- Topics discussed

### 5. AI Chat
- Powered by GPT-5.6
- Answers strictly grounded in the transcript
- Explicitly refuses to answer questions unrelated to the video content (no hallucination)

### 6. Quiz Generator
- 5 multiple-choice questions generated from the transcript via GPT-5.6
- Interactive answer selection and scoring

### 7. Transcript Viewer
- Full transcript display
- One-click copy to clipboard

### 8. Export
- Export summary + transcript as Markdown
- Export as PDF (print-optimized layout)

### 9. UI/UX
- Dark and light mode
- Responsive, animated, single-page interface

---

## Out of Scope (for this hackathon build)

- YouTube URL import (deprioritized due to third-party library instability with YouTube's streaming changes)
- Multi-language transcription/translation
- User accounts and video history/dashboard
- Timestamp-linked transcript navigation
- Flashcards / bookmarks / study modes beyond the quiz feature

---

## User Flow

1. User uploads a video file
2. Backend validates and stores the file
3. FFmpeg extracts audio
4. Whisper generates a timestamped transcript
5. GPT-5.6 generates a structured summary
6. User can:
   - Ask questions in the chat (grounded in transcript)
   - Generate and take a quiz
   - Copy the transcript
   - Export summary/transcript as Markdown or PDF
   - Toggle dark/light mode

---

## Functional Requirements

| ID | Requirement |
|---|---|
| FR-1 | System accepts MP4/MOV uploads with validation |
| FR-2 | System extracts audio from uploaded video via FFmpeg |
| FR-3 | System transcribes audio via Whisper with timestamps |
| FR-4 | System generates a structured summary via GPT-5.6 |
| FR-5 | System answers user questions grounded only in the transcript |
| FR-6 | System generates a 5-question multiple-choice quiz with scoring |
| FR-7 | System allows transcript copy to clipboard |
| FR-8 | System exports summary/transcript as Markdown and PDF |
| FR-9 | System supports dark/light theme toggling |

---

## Non-Functional Requirements

**Performance**
- Upload validation: < 5 seconds
- Transcript generation: reasonable for typical short-to-medium videos
- AI chat/summary response: < 15 seconds typical

**Reliability**
- Graceful error handling on failed uploads or API errors
- Chat must not fabricate information outside the transcript

**Usability**
- Minimal-click, single-page flow
- Clear progress indicators during processing

**Security**
- API keys stored server-side only, never exposed to the frontend
- Uploaded files scoped to a dedicated uploads directory

---

## Success Metrics

**Technical**
- Successful end-to-end processing (upload → transcript → summary) without errors
- Chat correctly refuses off-topic questions (validated via testing)
- Quiz reliably generates 5 valid multiple-choice questions

**Hackathon Submission**
- Functional MVP demonstrated live
- GPT-5.6 used across summarization, chat, and quiz generation
- Codex used for real backend development and feature implementation, with a valid session ID

---

## Risks & Assumptions

**Risks**
- Third-party OpenAI API billing/access setup (encountered and resolved during development)
- Large video processing time for longer files
- Model output formatting variance (mitigated with strict prompt instructions)

**Assumptions**
- Users provide supported video formats (MP4/MOV)
- OpenAI API (Whisper + GPT-5.6) access is available and funded
- Local development environment has FFmpeg installed

---

## Acceptance Criteria

The MVP is considered complete when a user can:

1. Upload an MP4/MOV file
2. Receive a timestamped transcript
3. Receive an AI-generated summary
4. Ask questions and receive transcript-grounded answers (with correct refusal of unrelated questions)
5. Generate and complete a quiz with a visible score
6. Copy the transcript to clipboard
7. Export the summary/transcript as Markdown or PDF
8. Toggle between dark and light mode
9. Complete this entire flow without errors during a live demo
