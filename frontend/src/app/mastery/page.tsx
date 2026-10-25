'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Mastery() {
  const [data, setData] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);

  useEffect(() => {
    api.get("/mastery/").then(r => setData(r.data)).catch(()=>{});
    api.get("/mastery/gaps").then(r => setGaps(r.data)).catch(()=>{});
  }, []);

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-[var(--color-primary)]">EdTech Assistant</Link>
          <div className="flex items-center gap-4">
            <Link href="/submit">Submit</Link>
            <Link href="/mastery" className="text-[var(--color-primary)] font-medium">Mastery</Link>
            <Link href="/assess">Practice</Link>
            <Link href="/tutor">Tutor</Link>
            <UserButton />
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Mastery Overview</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-[var(--color-border)]">
            <h2 className="font-semibold text-lg mb-4">All Topics</h2>
            {data.length === 0 ? <p className="text-gray-500">No data yet</p> : (
              <div className="space-y-3">
                {data.map(m => (
                  <div key={m.topic_id}>
                    <div className="flex justify-between mb-1">
                      <span>{m.topic}</span>
                      <span>{Math.round(m.score * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[var(--color-primary)] h-2 rounded-full" style={{width: `${m.score * 100}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg border border-[var(--color-border)]">
            <h2 className="font-semibold text-lg mb-4">Focus Areas (Gaps)</h2>
            {gaps.length === 0 ? <p className="text-green-600">Great! No gaps found.</p> : (
              <div className="space-y-2">
                {gaps.map(g => (
                  <div key={g.topic_id} className="p-3 bg-red-50 rounded border border-red-200">
                    <div className="font-medium">{g.topic}</div>
                    <div className="text-sm text-red-600">{Math.round(g.score * 100)}% mastery</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
