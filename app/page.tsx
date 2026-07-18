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

  const steps = ["uploading", "transcribing", "summarizing", "done"];
  const statusLabels: Record<string, string> = {
    idle: "Process Video",
    uploading: "Uploading...",
    transcribing: "Transcribing with Whisper...",
    summarizing: "Summarizing with GPT-5.6...",
    done: "Process Another Video",
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050508] text-slate-100">
      {/* animated ambient glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-[10%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/25 blur-[140px]" />
        <div className="absolute top-[20%] right-[5%] h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-[30%] h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[140px]" />
      </div>

      {/* grid texture */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]" />

      <div className="relative mx-auto max-w-5xl px-6 py-14 sm:py-20">
        {/* NAV */}
        <div className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-sm font-bold">
              V
            </div>
            <span className="font-semibold tracking-tight">VideoMind AI</span>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            GPT-5.6 &amp; Whisper Live
          </div>
        </div>

        {/* HERO */}
        <div className="mb-14 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-fuchsia-300">
            OpenAI Build Week
          </div>
          <h1 className="mb-4 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl">
            Watch less.<br />Know more.
          </h1>
          <p className="mx-auto max-w-lg text-base text-slate-400">
            Drop in any video. Get an instant transcript, a sharp summary, and a chat window that actually knows what was said.
          </p>
        </div>

        {/* UPLOAD PANEL */}
        <div className="relative mb-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-1.5 shadow-2xl shadow-fuchsia-950/40">
          <div className="rounded-[22px] bg-[#0a0a10] p-8">
            <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] py-14 transition-all hover:border-fuchsia-400/40 hover:bg-fuchsia-500/[0.03]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 ring-1 ring-white/10 transition group-hover:ring-fuchsia-400/40">
                <svg className="h-6 w-6 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-200">
                {file ? file.name : "Drop your video here"}
              </span>
              <span className="mt-1 text-xs text-slate-600">or click to browse — MP4, MOV</span>
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
                      steps.indexOf(status) >= i ? "bg-gradient-to-r from-fuchsia-500 to-indigo-500" : "bg-white/8"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {summary && (
          <div className="mb-6 rounded-3xl border border-emerald-400/15 bg-emerald-500/[0.03] p-8">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15">
                <span className="text-emerald-400">✦</span>
              </div>
              <h2 className="text-lg font-semibold text-white">Summary</h2>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{summary}</div>
          </div>
        )}

        {transcript && (
          <details className="mb-6 rounded-3xl border border-white/10 bg-white/[0.02] p-8">
            <summary className="cursor-pointer text-lg font-semibold text-white">Full Transcript</summary>
            <div className="mt-4 max-h-56 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-500">
              {transcript}
            </div>
          </details>
        )}

        {transcript && (
          <div className="rounded-3xl border border-cyan-400/15 bg-cyan-500/[0.03] p-8">
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15">
                <span className="text-cyan-400">✦</span>
              </div>
              <h2 className="text-lg font-semibold text-white">Ask the Video</h2>
            </div>

            <div className="mb-4 max-h-80 space-y-3 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-sm text-slate-600">Try: "What's the main point?" or "Summarize the middle part."</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white"
                        : "border border-white/10 bg-white/5 text-slate-200"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-500">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-400/40"
                placeholder="What are the key points?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
              />
              <button
                onClick={ask}
                className="rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-slate-200"
              >
                Ask
              </button>
            </div>
          </div>
        )}

        <div className="mt-16 text-center text-xs text-slate-700">
          Built with Codex for OpenAI Build Week 2026
        </div>
      </div>
    </main>
  );
}
