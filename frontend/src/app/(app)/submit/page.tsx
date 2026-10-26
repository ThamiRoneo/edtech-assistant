"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function Submit() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!text.trim()) return;
    setLoading(true);
    setStatus(null);
    setError(null);
    try {
      const res = await api.post("/submissions/", {
        content_text: text,
        image_keys: [],
      });
      setStatus(`Submitted. ID ${res.data.id} — status: ${res.data.status}. Grading runs shortly.`);
      setText("");
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Submit your work</h1>
        <p className="text-sm text-muted mt-0.5">
          Type your solution or upload a photo. We grade it against the curriculum rubric.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted">
          Your solution
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your math solution here. For example: To solve 3x + 5 = 20, subtract 5 from both sides…"
          rows={10}
          className="mt-2 w-full resize-y rounded-lg border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              title="Image upload coming shortly"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PhotoIcon /> Upload photo
            </button>
            <span className="text-xs text-muted">or paste your work above</span>
          </div>
          <button
            onClick={submit}
            disabled={loading || !text.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit for grading"}
          </button>
        </div>
      </div>

      {status && (
        <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-success">
          {status}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
          {error}
        </div>
      )}
    </div>
  );
}

function PhotoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="5" cy="5.5" r="1.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 10l3-3 2.5 2.5L10 6l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}