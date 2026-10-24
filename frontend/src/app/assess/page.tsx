"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function Assess() {
  const [items, setItems] = useState<any[]>([]);

  async function generate() {
    const res = await api.post("/assessments/generate", { count: 3 });
    setItems(res.data.items || []);
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">Practice Assessment</h1>
      <button className="mt-2 border px-4 py-2" onClick={generate}>Generate</button>
      <ol className="mt-4 list-decimal pl-6">
        {items.map((it) => (
          <li key={it.id} className="mt-2">{it.question_text}</li>
        ))}
      </ol>
    </main>
  );
}
