"use client";

interface ScoreCardProps {
  label: string;
  value: number;
  max?: number;
  variant?: "default" | "total";
}

export function ScoreCard({ label, value, max = 100, variant = "default" }: ScoreCardProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color =
    pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "#ef4444";

  return (
    <div
      className={`rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm ${
        variant === "total" ? "ring-2 ring-[var(--primary)]/30" : ""
      }`}
    >
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
        {label}
      </p>
      <div className="flex items-end gap-2">
        <span
          className={`text-2xl font-bold ${
            variant === "total" ? "text-3xl text-[var(--primary)]" : ""
          }`}
          style={variant !== "total" ? { color } : undefined}
        >
          {value}
        </span>
        <span className="mb-0.5 text-sm text-[var(--muted)]">/ {max}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--card-border)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
