interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  trend?: "up" | "down" | "flat";
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, hint, trend, icon }: StatCardProps) {
  const trendClass =
    trend === "up" ? "text-success" : trend === "down" ? "text-warning" : "text-muted";

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </div>
        {icon && <span className="text-muted">{icon}</span>}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-foreground font-[var(--font-display)]">
        {value}
      </div>
      {hint && (
        <div className={`mt-1 text-xs ${trendClass}`}>
          {trend === "up" ? "▲" : trend === "down" ? "▼" : "•"} {hint}
        </div>
      )}
    </div>
  );
}