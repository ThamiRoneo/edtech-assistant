"use client";

import { useState } from "react";
import api from "@/lib/api";

const DEMO_ITEMS = [
  {
    id: "q1",
    question_text: "A recipe calls for 3 cups of flour for every 2 cups of sugar. If you use 9 cups of flour, how many cups of sugar do you need?",
    choices: ["4", "5", "6", "7"],
    answer: "6",
  },
  {
    id: "q2",
    question_text: "What is the value of x in the equation 5x − 7 = 18?",
    choices: ["3", "4", "5", "6"],
    answer: "5",
  },
  {
    id: "q3",
    question_text: "A triangle has angles of 48° and 92°. What is the measure of the third angle?",
    choices: ["30°", "40°", "50°", "60°"],
    answer: "40°",
  },
];

export default function Assess() {
  const [items, setItems] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await api.post("/assessments/generate", { count: 5 });
      setItems(res.data.items || []);
      setAnswers({});
      setSubmitted(false);
    } catch {
      setItems(DEMO_ITEMS);
      setAnswers({});
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  }

  function grade() {
    let correct = 0;
    for (const it of items) {
      if (answers[it.id] === it.answer) correct++;
    }
    setSubmitted(true);
    alert(
      `You scored ${correct} out of ${items.length}. ${correct === items.length ? "Full marks — nice work." : "Review the missed ones and try again."}`
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Practice assessment</h1>
          <p className="text-sm text-muted mt-0.5">
            Adaptive questions sized to where you actually are.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="shrink-0 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? "Generating…" : "New practice"}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface/60 p-10 text-center">
          <p className="text-sm text-muted">
            No practice loaded yet. Generate a set to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {idx + 1}
                </span>
                <p className="text-sm font-medium leading-relaxed">
                  {item.question_text}
                </p>
              </div>
              <div className="mt-3 ml-9 space-y-1.5">
                {item.choices?.map((c: string, i: number) => {
                  const selected = answers[item.id] === c;
                  const isCorrect =
                    submitted && c === item.answer;
                  const isWrong =
                    submitted && selected && c !== item.answer;

                  return (
                    <label
                      key={i}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        selected
                          ? isCorrect
                            ? "border-success bg-success/5"
                            : isWrong
                            ? "border-danger bg-danger/5"
                            : "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <input
                        type="radio"
                        name={item.id}
                        value={c}
                        checked={selected}
                        onChange={() =>
                          setAnswers((a) => ({ ...a, [item.id]: c }))
                        }
                        className="sr-only"
                      />
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-border-strong text-[10px]">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{c}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={grade}
              disabled={submitted || Object.keys(answers).length < items.length}
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
            >
              Check answers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}