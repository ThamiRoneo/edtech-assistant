import Link from "next/link";
import Footer from "@/components/Footer";

const DEMO = [
  { label: "Fractions", pct: 92, trend: "up" },
  { label: "Equations", pct: 78, trend: "up" },
  { label: "Ratios", pct: 38, trend: "down" },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border/60 bg-surface/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Mark />
            <span className="text-lg font-bold tracking-tight">EdTech</span>
            <span className="text-lg font-semibold text-primary">Assistant</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="px-3 py-2 text-sm hover:text-primary">Log In</Link>
            <Link href="/sign-up" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">Sign Up</Link>
            <Link href="/dashboard" className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary/40">Go to app</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Built for K-12 learners</p>
            <h1 className="mt-3 text-5xl lg:text-6xl font-bold tracking-tight">
              Math confidence, built one solution at a time.
            </h1>
            <p className="mt-5 text-lg lg:text-xl text-muted max-w-xl">
              Get rubric-grounded feedback on every answer, see exactly where you're growing, and close gaps with practice that adapts to you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/sign-up" className="rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors shadow-sm">Start learning free</Link>
              <Link href="/dashboard" className="rounded-lg border border-border bg-surface px-7 py-3 text-sm font-semibold hover:border-primary/40 transition-colors">See how it works</Link>
            </div>
            <p className="mt-4 text-sm text-muted">No credit card required. Focus on learning, not grading.</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Mastery preview</h3>
              <span className="text-xs text-muted">Demo student • Last updated today</span>
            </div>
            <div className="space-y-3">
              {DEMO.map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{d.label}</span>
                    <span className={d.pct < 50 ? "text-warning font-semibold" : "text-primary font-semibold"}>{d.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full rounded-full bg-border">
                    <div
                      className={`h-full rounded-full transition-all ${d.pct < 50 ? "bg-warning" : "bg-primary"}`}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/60">
              <p className="text-xs text-muted">Focus area: <span className="text-warning font-medium">Ratios</span> — practice ready</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="22" height="22" rx="7" fill="#7C3AED" />
      <path d="M9 18l4-10 5 10" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="13.5" r="1.4" fill="#7C3AED" />
    </svg>
  );
}