'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";

export default function Submit() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!text.trim()) return;
    setLoading(true);
    setStatus("Submitting...");
    try {
      const res = await api.post("/submissions/", { content_text: text, image_keys: [] });
      setStatus(`Submitted! ID: ${res.data.id} - Status: ${res.data.status}`);
      setText("");
    } catch (e: any) {
      setStatus(`Error: ${e.response?.data?.detail || e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-[var(--color-primary)]">EdTech Assistant</Link>
          <div className="flex items-center gap-4">
            <Link href="/submit" className="text-[var(--color-primary)] font-medium">Submit</Link>
            <Link href="/mastery">Mastery</Link>
            <Link href="/assess">Practice</Link>
            <Link href="/tutor">Tutor</Link>
            <UserButton />
          </div>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Submit Your Work</h1>
        <p className="text-gray-600 mb-6">Get AI-powered feedback on your math solutions</p>
        <div className="bg-white p-6 rounded-lg border border-[var(--color-border)]">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 h-48 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="Enter your solution..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={submit}
            disabled={loading || !text.trim()}
            className="mt-4 bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit for Grading"}
          </button>
          {status && <p className="mt-4 text-sm">{status}</p>}
        </div>
      </main>
    </div>
  );
}
