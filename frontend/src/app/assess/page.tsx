'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";

export default function Assess() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await api.post("/assessments/generate", { count: 5 });
      setItems(res.data.items || []);
    } catch (e) {
      alert("Error generating assessment");
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
            <Link href="/submit">Submit</Link>
            <Link href="/mastery">Mastery</Link>
            <Link href="/assess" className="text-[var(--color-primary)] font-medium">Practice</Link>
            <Link href="/tutor">Tutor</Link>
            <UserButton />
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Practice Assessment</h1>
        <p className="text-gray-600 mb-6">Adaptive practice based on your mastery</p>
        <button onClick={generate} disabled={loading} className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg disabled:opacity-50">
          {loading ? "Generating..." : "Generate Practice"}
        </button>
        {items.length > 0 && (
          <div className="mt-6 space-y-4">
            {items.map((item, idx) => (
              <div key={item.id} className="bg-white p-6 rounded-lg border border-[var(--color-border)]">
                <p className="font-medium mb-4">{idx + 1}. {item.question_text}</p>
                <div className="space-y-2">
                  {item.choices?.map((c: string, i: number) => (
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
      </main>
    </div>
  );
}
