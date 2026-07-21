"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "transcribing" | "summarizing" | "done">("idle");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [transcriptCopied, setTranscriptCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const [quiz, setQuiz] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const API_URL = "http://localhost:5000";

  async function processVideo() {
    if (!file) return;
    setStatus("uploading");

    const form = new FormData();
    form.append("video", file);

    const uploadRes = await fetch(`${API_URL}/api/upload`, { method: "POST", body: form });
    const uploadData = await uploadRes.json();
    const filename = uploadData.data.filename;

    setStatus("transcribing");
    await fetch(`${API_URL}/api/extract-audio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    const wavFilename = filename.replace(/\.[^/.]+$/, ".wav");
    const transcribeRes = await fetch(`${API_URL}/api/transcribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: wavFilename }),
    });
    const transcribeData = await transcribeRes.json();
    const transcriptText = transcribeData.data.text;
    setTranscript(transcriptText);

    setStatus("summarizing");
    const summaryRes = await fetch(`${API_URL}/api/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: transcriptText }),
    });
    const summaryData = await summaryRes.json();
    setSummary(summaryData.data.summary);
    setStatus("done");
  }

  async function ask() {
    if (!question.trim() || !transcript) return;
    const q = question;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setChatLoading(true);

    const res = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, question: q }),
    });
    const data = await res.json();
    setMessages((m) => [...m, { role: "assistant", text: data.data.answer }]);
    setChatLoading(false);
  }

  async function copyTranscript() {
    await navigator.clipboard.writeText(transcript);
    setTranscriptCopied(true);
    window.setTimeout(() => setTranscriptCopied(false), 2000);
  }

  const exportMarkdown = () => {
    const markdown = `# VideoMind AI

## Summary

${summary}

---

## Transcript

${transcript}
`;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "videomind-summary.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  async function generateQuiz() {
    if (!transcript) return;
    try {
      setLoadingQuiz(true);
      const res = await fetch(`${API_URL}/api/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      const quizData = data.data.quiz;
      setQuiz(quizData);
      setSelectedAnswers(new Array(quizData.length).fill(-1));
      setQuizScore(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuiz(false);
    }
  }

  function submitQuiz() {
    let score = 0;
    quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) score++;
    });
    setQuizScore(score);
  }

  const steps = ["uploading", "transcribing", "summarizing", "done"];
  const statusLabels: Record<string, string> = {
    idle: "Process Video",
    uploading: "Uploading...",
    transcribing: "Transcribing with Whisper...",
    summarizing: "Summarizing with GPT-5.6...",
    done: "Process Another Video",
  };

  const cardBase = darkMode
    ? "border-white/10 bg-white/[0.02]"
    : "border-slate-200 bg-white shadow-sm";

  const textMuted = darkMode ? "text-slate-400" : "text-slate-500";
  const textBody = darkMode ? "text-slate-300" : "text-slate-700";

  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
        darkMode ? "bg-[#050508] text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {darkMode && (
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-32 left-[10%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/25 blur-[140px]" />
          <div className="absolute top-[20%] right-[5%] h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[140px]" />
          <div className="absolute bottom-0 left-[30%] h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[140px]" />
        </div>
      )}

      <div className="relative mx-auto max-w-5xl px-6 py-14 sm:py-20">
      
<div className="no-print mb-16 flex items-center justify-between">          
<div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-sm font-bold text-white">
              V
            </div>
            <span className="font-semibold tracking-tight">VideoMind AI</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`hidden items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium sm:flex ${
                darkMode ? "border-white/10 bg-white/5 text-slate-300" : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              GPT-5.6 &amp; Whisper Live
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-lg transition ${
                darkMode ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>
          </div>
        </div>

      
<div className="no-print mb-14 text-center">          
<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-fuchsia-400">
            OpenAI Build Week
          </div>
          <h1
            className={`mb-4 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl ${
              darkMode ? "bg-gradient-to-b from-white via-white to-white/40" : "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500"
            }`}
          >
            Watch less.<br />Know more.
          </h1>
          <p className={`mx-auto max-w-lg text-base ${textMuted}`}>
            Drop in any video. Get an instant transcript, a sharp summary, a quiz, and a chat window that actually knows what was said.
          </p>
        </div>

        <div
          className={`no-print relative mb-8 rounded-3xl border p-1.5 shadow-2xl ${
            darkMode ? "border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-fuchsia-950/40" : "border-slate-200 bg-white shadow-slate-200"
          }`}
        >
          <div className={`rounded-[22px] p-8 ${darkMode ? "bg-[#0a0a10]" : "bg-white"}`}>
            <label
              className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-14 transition-all ${
                darkMode
                  ? "border-white/10 bg-white/[0.02] hover:border-fuchsia-400/40 hover:bg-fuchsia-500/[0.03]"
                  : "border-slate-300 bg-slate-50 hover:border-fuchsia-400 hover:bg-fuchsia-50"
              }`}
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition ${
                  darkMode ? "bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 ring-white/10 group-hover:ring-fuchsia-400/40" : "bg-gradient-to-br from-fuchsia-100 to-indigo-100 ring-slate-200"
                }`}
              >
                <svg className="h-6 w-6 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span className="text-sm font-medium">{file ? file.name : "Drop your video here"}</span>
              <span className={`mt-1 text-xs ${textMuted}`}>or click to browse — MP4, MOV</span>
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            <button
              onClick={processVideo}
              disabled={!file || (status !== "idle" && status !== "done")}
              className="group relative mt-6 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 py-4 font-semibold text-white transition-all hover:shadow-lg hover:shadow-fuchsia-600/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="relative z-10">{statusLabels[status]}</span>
            </button>

            {status !== "idle" && (
              <div className="mt-5 flex gap-1.5">
                {steps.map((step, i) => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full transition-all duration-700 ${
                      steps.indexOf(status) >= i
                        ? "bg-gradient-to-r from-fuchsia-500 to-indigo-500"
                        : darkMode ? "bg-white/8" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {summary && (
          <div className={`mb-6 rounded-3xl border p-8 ${darkMode ? "border-emerald-400/15 bg-emerald-500/[0.03]" : "border-emerald-200 bg-emerald-50"}`}>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15">
                <span className="text-emerald-500">✦</span>
              </div>
              <h2 className="text-lg font-semibold">Summary</h2>
            </div>
            <div className={`whitespace-pre-wrap text-sm leading-relaxed ${textBody}`}>{summary}</div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={exportMarkdown} className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                Export as Markdown
              </button>
              <button onClick={exportPDF} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Export as PDF
              </button>
              <button onClick={generateQuiz} className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">
                {loadingQuiz ? "Generating..." : "Generate Quiz"}
              </button>
            </div>
          </div>
        )}

        {quiz.length > 0 && (
          <div className={`mb-6 rounded-3xl border p-8 ${darkMode ? "border-purple-400/15 bg-purple-500/[0.03]" : "border-purple-200 bg-purple-50"}`}>
            <h2 className="mb-6 text-lg font-semibold">Quiz Mode</h2>
            {quiz.map((q, index) => (
              <div key={index} className="mb-6">
                <p className="mb-3 font-semibold">{index + 1}. {q.question}</p>
                {q.options.map((option: string, optionIndex: number) => (
                  <label key={optionIndex} className={`mb-2 flex cursor-pointer gap-2 ${textBody}`}>
                    <input
                      type="radio"
                      name={`q-${index}`}
                      checked={selectedAnswers[index] === optionIndex}
                      onChange={() => {
                        const copy = [...selectedAnswers];
                        copy[index] = optionIndex;
                        setSelectedAnswers(copy);
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ))}
            <button onClick={submitQuiz} className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700">
              Submit Quiz
            </button>
            {quizScore !== null && (
              <div className="mt-4 text-xl font-bold text-green-500">
                Score: {quizScore} / {quiz.length}
              </div>
            )}
          </div>
        )}

        {transcript && (
          <details className={`mb-6 rounded-3xl border p-8 ${cardBase}`}>
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold">
              <span>Full Transcript</span>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  copyTranscript();
                }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  darkMode ? "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Copy Transcript
              </button>
            </summary>
            {transcriptCopied && (
              <p className="mt-3 text-sm font-medium text-emerald-500" role="status">Copied!</p>
            )}
            <div className={`mt-4 max-h-56 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed ${textMuted}`}>
              {transcript}
            </div>
          </details>
        )}

        {transcript && (
          <div className={`rounded-3xl border p-8 ${darkMode ? "border-cyan-400/15 bg-cyan-500/[0.03]" : "border-cyan-200 bg-cyan-50"}`}>
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15">
                <span className="text-cyan-500">✦</span>
              </div>
              <h2 className="text-lg font-semibold">Ask the Video</h2>
            </div>

            <div className="mb-4 max-h-80 space-y-3 overflow-y-auto">
              {messages.length === 0 && (
                <p className={`text-sm ${darkMode ? "text-slate-600" : "text-slate-400"}`}>
                  Try: "What's the main point?" or "Summarize the middle part."
                </p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white"
                        : darkMode ? "border border-white/10 bg-white/5 text-slate-200" : "border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl border px-4 py-2.5 text-sm ${darkMode ? "border-white/10 bg-white/5 text-slate-500" : "border-slate-200 bg-white text-slate-400"}`}>
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none ${
                  darkMode ? "border-white/10 bg-white/5 text-white placeholder-slate-600 focus:border-cyan-400/40" : "border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-400"
                }`}
                placeholder="What are the key points?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
              />
              <button onClick={ask} className={`rounded-xl px-6 text-sm font-semibold transition ${darkMode ? "bg-white text-black hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-700"}`}>
                Ask
              </button>
            </div>
          </div>
        )}

        <div className={`mt-16 text-center text-xs ${darkMode ? "text-slate-700" : "text-slate-400"}`}>
          Built with Codex for OpenAI Build Week 2026
        </div>
      </div>
    </main>
  );
}
