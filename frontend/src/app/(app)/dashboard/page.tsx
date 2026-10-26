'use client';

import StatCard from "@/components/StatCard";
import MasteryTrack from "@/components/MasteryTrack";

const DEMO_TOPICS = [
  { id: "frac", name: "Fractions", score: 0.92 },
  { id: "eq", name: "Equations", score: 0.78 },
  { id: "geom", name: "Geometry", score: 0.55 },
  { id: "ratio", name: "Ratios", score: 0.38, gap: true },
  { id: "pct", name: "Percents", score: 0.84 },
  { id: "graph", name: "Graphs", score: 0.61 },
];

const RECENT = [
  { id: "r1", topic: "Fractions", score: "18/20", when: "Today", ok: true },
  { id: "r2", topic: "Equations", score: "11/15", when: "Yesterday", ok: false },
  { id: "r3", topic: "Percents", score: "16/16", when: "2 days ago", ok: true },
];

export default function Dashboard() {
  const mastered = DEMO_TOPICS.filter((t) => t.score >= 0.75 && !t.gap).length;
  const gaps = DEMO_TOPICS.filter((t) => t.gap || t.score < 0.4).length;
  const avg = Math.round(
    (DEMO_TOPICS.reduce((s, t) => s + t.score, 0) / DEMO_TOPICS.length) * 100
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your progress</h1>
        <p className="text-sm text-muted mt-0.5">
          Here is where you stand across the curriculum today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Overall mastery" value={`${avg}%`} hint="across all topics" />
        <StatCard label="Topics mastered" value={mastered} hint="of 6 tracked" />
        <StatCard label="Gap areas" value={gaps} hint="needs attention" trend="down" />
        <StatCard label="Submissions graded" value="14" hint="this month" trend="up" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <MasteryTrack topics={DEMO_TOPICS} />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold mb-3">Recent submissions</h3>
          <ul className="divide-y divide-border">
            {RECENT.map((r) => (
              <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{r.topic}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      r.ok
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {r.ok ? "Mastered" : "Needs work"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted">{r.score}</span>
                  <span className="text-xs text-muted">{r.when}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Action
          href="/submit"
          title="Submit work"
          desc="Type a solution or upload a photo. Get rubric-grounded feedback."
          accent
        />
        <Action
          href="/mastery"
          title="Close your gaps"
          desc="Target the topics holding your mastery back."
        />
        <Action
          href="/assess"
          title="Take a practice test"
          desc="Adaptive questions sized to where you actually are."
        />
      </div>
    </div>
  );
}

function Action({
  href,
  title,
  desc,
  accent,
}: {
  href: string;
  title: string;
  desc: string;
  accent?: boolean;
}) {
  return (
    <a
      href={href}
      className={`block rounded-xl border p-4 transition-colors hover:-translate-y-0.5 transition-transform ${
        accent
          ? "border-primary bg-primary text-white"
          : "border-border bg-surface hover:border-primary/40"
      }`}
    >
      <div className="text-sm font-semibold">{title}</div>
      <p className={`mt-1 text-xs ${accent ? "text-white/80" : "text-muted"}`}>
        {desc}
      </p>
    </a>
  );
}