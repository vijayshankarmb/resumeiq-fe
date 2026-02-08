"use client";

interface SectionCardProps {
  title: string;
  content: string | string[] | undefined;
}

export function SectionCard({ title, content }: SectionCardProps) {
  if (!content) return null;
  const isArray = Array.isArray(content);
  const items = isArray ? content.filter(Boolean) : [content];
  if (items.length === 0 || !items.join("").trim()) return null;

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
        {title}
      </h3>
      {isArray && items.length > 1 ? (
        <ul className="space-y-1 text-sm leading-relaxed text-[var(--foreground)]">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[var(--primary)]">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
          {items[0]}
        </p>
      )}
    </div>
  );
}
