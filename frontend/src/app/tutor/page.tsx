'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function Tutor() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!msg.trim() || loading) return;
    setMessages(m => [...m, { role: 'user', content: msg }]);
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1") + "/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
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
              if (j.token) full += j.token;
            } catch {}
          }
        }
      }
      setMessages(m => [...m, { role: 'assistant', content: full || "Let us think together..." }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: "Let us think step by step. What problem are you working on?" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-[var(--color-primary)]">EdTech Assistant</Link>
          <div className="flex items-center gap-4">
            <Link href="/submit">Submit</Link>
            <Link href="/mastery">Mastery</Link>
            <Link href="/assess">Practice</Link>
            <Link href="/tutor" className="text-[var(--color-primary)] font-medium">Tutor</Link>
            <UserButton />
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Socratic Tutor</h1>
        <div className="flex-1 bg-white border border-[var(--color-border)] rounded-lg p-4 mb-4 overflow-auto space-y-3">
          {messages.length === 0 && <p className="text-gray-500 text-center mt-8">Ask me anything about math!</p>}
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-[var(--color-primary)] text-white ml-auto' : 'bg-gray-100'}`}>
              {m.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && send()}
            placeholder="Ask a question..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <button onClick={send} disabled={loading} className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg disabled:opacity-50">
            {loading ? "..." : "Send"}
          </button>
        </div>
      </main>
    </div>
  );
}
