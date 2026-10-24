"use client";

import { useState } from "react";

export default function Tutor() {
  const [msg, setMsg] = useState("");
  const [log, setLog] = useState<string[]>([]);

  async function send() {
    setLog((l) => [...l, `You: ${msg}`]);
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1") + "/tutor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let buf = "";
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
            if (j.token) setLog((l) => [...l, j.token]);
          } catch {}
        }
      }
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">Tutor</h1>
      <div className="mt-4 h-64 border p-2 overflow-auto">{log.join("")}</div>
      <div className="mt-2 flex gap-2">
        <input className="border flex-1 p-2" value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button className="border px-4 py-2" onClick={send}>Send</button>
      </div>
    </main>
  );
}
