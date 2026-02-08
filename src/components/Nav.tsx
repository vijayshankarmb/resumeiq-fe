"use client";

export function Nav({ activeTab, onTabChange }: { activeTab: "analyze" | "compare"; onTabChange: (t: "analyze" | "compare") => void }) {
  return (
    <nav className="flex w-full gap-1 rounded-lg bg-[var(--card)] p-1 shadow-sm ring-1 ring-[var(--card-border)] sm:w-auto">
      <button
        onClick={() => onTabChange("analyze")}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
          activeTab === "analyze"
            ? "bg-[var(--primary)] text-white shadow"
            : "text-[var(--muted)] hover:bg-[var(--card-border)]/50 hover:text-[var(--foreground)]"
        }`}
      >
        Analyze Resume
      </button>
      <button
        onClick={() => onTabChange("compare")}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
          activeTab === "compare"
            ? "bg-[var(--primary)] text-white shadow"
            : "text-[var(--muted)] hover:bg-[var(--card-border)]/50 hover:text-[var(--foreground)]"
        }`}
      >
        Compare with Job
      </button>
    </nav>
  );
}
