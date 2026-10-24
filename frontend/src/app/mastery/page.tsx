'use client';

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Mastery() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/mastery/").then((r) => setData(r.data)).catch(() => setData([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Your Mastery</h1>
      <p className="text-gray-600 mb-6">Track your progress across math topics</p>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : data.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center text-gray-500">
          No mastery data yet. Submit some work to start tracking!
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mastery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((m) => (
                <tr key={m.topic_id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.topic}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: `${m.score * 100}%`}}></div>
                      </div>
                      <span className="text-sm text-gray-600">{(m.score * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{m.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
