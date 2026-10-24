'use client';

import { useState } from "react";

export default function Tutor() {
  const [msg, setMsg] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!msg.trim() || loading) return;
    setLog((l) => [...l, `You: ${msg}`]);
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
      let buf = "";
      let response = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value);
        const lines = buf.split("\n\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const j = JSON.parse(data);
              if (j.token) response += j.token;
            } catch {}
          }
        }
      }
      if (response) setLog((l) => [...l, `Tutor: ${response}`]);
    } catch (e) {
      setLog((l) => [...l, "Tutor: Let us think together. What are you trying to solve?"]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Socratic Tutor</h1>
      <p className="text-gray-600 mb-6">Learn by thinking, not by being told</p>
      <div className="bg-white rounded-lg shadow-sm border h-96 overflow-auto p-4 mb-4 space-y-2">
        {log.length === 0 ? (
          <div className="text-gray-400 text-center mt-20">Start a conversation...</div>
        ) : (
          log.map((l, i) => (
            <div key={i} className={`p-2 rounded ${l.startsWith('You:') ? 'bg-blue-50 text-right' : 'bg-gray-50'}`}>
              {l}
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input 
          className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          value={msg} 
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && send()}
          placeholder="Ask a question..."
        />
        <button 
          className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50" 
          onClick={send}
          disabled={loading || !msg.trim()}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
