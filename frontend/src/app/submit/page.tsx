"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function Submit() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  async function submit() {
    setStatus("submitting");
    const res = await api.post("/submissions/", { content_text: text, image_keys: [] });
    setStatus(`submitted: ${res.data.id} status=${res.data.status}`);
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">Submit Work</h1>
      <textarea className="mt-4 w-full border p-2" value={text} onChange={(e) => setText(e.target.value)} />
      <button className="mt-2 border px-4 py-2" onClick={submit}>Submit</button>
      <p className="mt-2">{status}</p>
    </main>
  );
}
