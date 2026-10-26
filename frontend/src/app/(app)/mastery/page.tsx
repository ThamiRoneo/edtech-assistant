"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

const DEMO_TOPICS = [
  { id: "frac", name: "Fractions", score: 0.92, n: 24 },
  { id: "eq", name: "Equations", score: 0.78, n: 19 },
  { id: "geom", name: "Geometry", score: 0.55, n: 11 },
  { id: "ratio", name: "Ratios", score: 0.38, n: 8, gap: true },
  { id: "pct", name: "Percents", score: 0.84, n: 15 },
  { id: "graph", name: "Graphs", score: 0.61, n: 13 },
];

export default function Mastery() {
  const [data, setData] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([
      api.get("/mastery/").then((r) => r.data).catch(() => null),
      api.get("/mastery/gaps").then((r) => r.data).catch(() => null),
    ])
      .then(([d, g]) => {
        if (!alive) return;
        if (Array.isArray(d)) setData(d);
        if (Array.isArray(g)) setGaps(g);
      })
      .finally(() => setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  const topics = loaded && data.length > 0 ? data : DEMO_TOPICS;
  const gapList = loaded && gaps.length > 0 ? gaps : DEMO_TOPICS.filter((t) => t.gap || t.score < 0.4);

  const avg = Math.round((topics.reduce((s, t) => s + (t.score ?? 0.5), 0) / topics.length) * 100);
  const mastered = topics.filter((t) => (t.score ?? 0.5) >= 0.75).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mastery</h1>
        <p className="text-sm text-muted mt-0.5">
          How you stand on each curriculum topic. Scores update after each graded submission.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Overall" value={`${avg}%`} />
        <Stat label="Topics mastered" value={mastered} sub={`of ${topics.length} tracked`} />
        <Stat label="Gap areas" value={gapList.length} sub="needs attention" danger />
        <Stat label="Submissions" value={topics.reduce((s, t) => s + (t.n ?? 0), 0)} sub="graded" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Topic mastery</h2>
            <span className="text-xs text-muted">{topics.length} topics</span>
          </div>
          <div className="space-y-3">
            {topics.map((t) => (
              <TopicRow key={t.id ?? t.topic_id} t={t} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold mb-3">Focus areas</h2>
          {gapList.length === 0 ? (
            <div className="rounded-lg bg-success/5 border border-success/30 p-4 text-center">
              <p className="text-sm font-semibold text-success">No gaps found.</p>
              <p className="mt-1 text-xs text-muted">
                Keep submitting work to keep this true.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {gapList.map((t) => (
                <li
                  key={t.id ?? t.topic_id}
                  className="rounded-lg border border-danger/30 bg-danger/5 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{t.name ?? t.topic}</span>
                    <span className="text-xs font-semibold text-danger">
                      {Math.round((t.score ?? 0) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-danger/15">
                    <div
                      className="h-full rounded-full bg-danger"
                      style={{ width: `${Math.round((t.score ?? 0) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    Practice this topic to close the gap.
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  danger,
}: {
  label: string;
  value: string | number;
  sub?: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </div>
      <div
        className={`mt-2 text-3xl font-bold tracking-tight font-[var(--font-display)] ${
          danger ? "text-danger" : "text-foreground"
        }`}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </div>
  );
}

function TopicRow({ t }: { t: any }) {
  const score = t.score ?? 0.5;
  const pct = Math.round(score * 100);
  const gap = score < 0.4;
  const building = !gap && score < 0.75;
  const color = gap ? "bg-danger" : building ? "bg-warning" : "bg-primary";
  const label = gap ? "Gap" : building ? "Building" : "Mastered";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">{t.name ?? t.topic}</span>
        <span className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
              gap
                ? "bg-danger/10 text-danger"
                : building
                ? "bg-warning/10 text-warning"
                : "bg-primary/10 text-primary"
            }`}
          >
            {label}
          </span>
          <span className="text-xs text-muted">{pct}%</span>
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-border">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}