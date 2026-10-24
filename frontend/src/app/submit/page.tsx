'use client';

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
      setStatus(`✓ Submitted! Status: ${res.data.status}`);
      setText("");
    } catch (e: any) {
      setStatus(`✗ Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Submit Your Work</h1>
      <p className="text-gray-600 mb-6">Get instant feedback with rubric-based grading</p>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Solution</label>
        <textarea 
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          rows={8}
          value={text} 
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your math solution here..."
        />
        <button 
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={submit}
          disabled={loading || !text.trim()}
        >
          {loading ? "Submitting..." : "Submit for Grading"}
        </button>
        {status && <p className="mt-4 text-sm">{status}</p>}
      </div>
    </div>
  );
}
