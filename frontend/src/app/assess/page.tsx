'use client';

import { useState } from "react";
import api from "@/lib/api";

export default function Assess() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await api.post("/assessments/generate", { count: 3 });
      setItems(res.data.items || []);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Practice Assessment</h1>
      <p className="text-gray-600 mb-6">Adaptive practice tailored to your skill level</p>
      <button 
        className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50" 
        onClick={generate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Practice Set"}
      </button>
      {items.length > 0 && (
        <div className="mt-6 space-y-4">
          {items.map((it, idx) => (
            <div key={it.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="font-medium mb-3">{idx + 1}. {it.question_text}</p>
              <div className="space-y-2">
                {it.choices?.map((c: string, i: number) => (
                  <label key={i} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input type="radio" name={`q${idx}`} />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
