"use client";

import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "Help me solve 3x + 5 = 20",
  "Explain how to add fractions with different denominators",
  "I got 6 for a ratio problem — is that right?",
  "Walk me through finding the area of a circle",
];

export default function Tutor() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hi, I am your math tutor. Ask me anything, and I will work through it with you step by step.",
    },
  ]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function send() {
    if (!msg.trim() || loading) return;
    const userMsg = msg.trim();
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setMsg("");
    setLoading(true);
    setStreaming(true);

    const assistantIdx = messages.length + 1;
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/tutor/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg }),
        }
      );
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const j = JSON.parse(data);
              if (j.token) {
                full += j.token;
                setMessages((m) => {
                  const next = [...m];
                  next[assistantIdx] = { role: "assistant", content: full };
                  return next;
                });
              }
            } catch {}
          }
        }
      }
      if (!full) {
        setMessages((m) => {
          const next = [...m];
          next[assistantIdx] = {
            role: "assistant",
            content: "Let us think step by step. What problem are you working on?",
          };
          return next;
        });
      }
    } catch {
      setMessages((m) => {
        const next = [...m];
        next[assistantIdx] = {
          role: "assistant",
          content: "Let us think step by step. What problem are you working on?",
        };
        return next;
      });
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }

  return (
    <div className="max-w-3xl h-[calc(100vh-13rem)] flex flex-col">
      <div className="mb-3">
        <h1 className="text-2xl font-bold tracking-tight">Socratic tutor</h1>
        <p className="text-sm text-muted mt-0.5">
          I ask questions to guide you, not to give the answer away.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin rounded-xl border border-border bg-surface p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-primary text-white rounded-br-md"
                  : "bg-primary/5 text-foreground rounded-bl-md"
              }`}
            >
              {m.content || (
                <span className="inline-flex items-center gap-1 text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse [animation-delay:0.4s]" />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setMsg(s)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:border-primary/40 hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask a question…"
          disabled={loading}
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
        />
        <button
          onClick={send}
          disabled={loading || !msg.trim()}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}