"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Mastery() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get("/mastery/").then((r) => setData(r.data));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">Mastery</h1>
      <ul className="mt-4">
        {data.map((m) => (
          <li key={m.topic_id}>{m.topic}: {(m.score * 100).toFixed(0)}% ({m.attempts} attempts)</li>
        ))}
      </ul>
    </main>
  );
}
