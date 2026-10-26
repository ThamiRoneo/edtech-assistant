interface Topic {
  id: string;
  name: string;
  score: number; // 0..1
  gap?: boolean;
}

interface MasteryTrackProps {
  topics: Topic[];
  activeId?: string;
  onActivate?: (id: string) => void;
}

export default function MasteryTrack({ topics, activeId, onActivate }: MasteryTrackProps) {
  if (topics.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface/60 p-8 text-center">
        <p className="text-sm text-muted">No topics yet. Submit some work to see your mastery.</p>
      </div>
    );
  }

  const width = topics.length;
  const maxScore = 1;

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Curriculum mastery</h3>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Mastered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-warning" /> Building
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-danger" /> Gap
          </span>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width * 100} 120`}
          className="w-full h-28"
          role="img"
          aria-label="Mastery track"
        >
          <defs>
            <linearGradient id="mk-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>

          {topics.map((t, i) => {
            const x = i * 100 + 50;
            const barH = 20 + t.score * 70;
            const y = 100 - barH;
            const isGap = t.gap || t.score < 0.4;
            const isBuilding = !isGap && t.score < 0.75;
            const fill = isGap ? "#DC2626" : isBuilding ? "#D97706" : "url(#mk-fill)";
            const isActive = t.id === activeId;

            return (
              <g
                key={t.id}
                onClick={() => onActivate?.(t.id)}
                style={{ cursor: onActivate ? "pointer" : "default" }}
              >
                <rect
                  x={x - 34}
                  y={y}
                  width={68}
                  height={barH}
                  rx={6}
                  fill={fill}
                  opacity={isActive ? 1 : 0.92}
                />
                {isActive && (
                  <rect
                    x={x - 34}
                    y={y}
                    width={68}
                    height={barH}
                    rx={6}
                    fill="none"
                    stroke="#1E1B4B"
                    strokeWidth={1.5}
                  />
                )}
                <text
                  x={x}
                  y={112}
                  textAnchor="middle"
                  style={{ fontSize: 10, fill: "var(--color-muted)" }}
                >
                  {t.name.length > 10 ? t.name.slice(0, 9) + "…" : t.name}
                </text>
                <text
                  x={x}
                  y={y - 6}
                  textAnchor="middle"
                  style={{ fontSize: 11, fontWeight: 600, fill: "var(--color-foreground)" }}
                >
                  {Math.round(t.score * 100)}
                </text>
              </g>
            );
          })}

          <line x1="0" y1="100" x2={width * 100} y2="100" stroke="#E5E7EB" strokeWidth={1} />
        </svg>
      </div>
    </div>
  );
}