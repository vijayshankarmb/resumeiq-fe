"use client";

import { useState } from "react";
import { compareResume } from "@/lib/api";
import type { CompareResponse, ParsedComparison } from "@/types/resume";
import { SectionCard } from "./SectionCard";

function parseComparison(text: string): ParsedComparison | null {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned) as ParsedComparison;
  } catch {
    return null;
  }
}

export function CompareView({ defaultResumeText }: { defaultResumeText?: string }) {
  const [resumeText, setResumeText] = useState(defaultResumeText ?? "");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResponse | null>(null);

  const handleCompare = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please fill in both resume text and job description");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await compareResume(resumeText.trim(), jobDescription.trim());
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  const parsed = result?.comparison ? parseComparison(result.comparison) : null;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-[var(--foreground)]">
              Resume text
            </label>
            {defaultResumeText && (
              <button
                type="button"
                onClick={() => setResumeText(defaultResumeText)}
                className="rounded-md bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary)]/20"
              >
                Use analyzed resume
              </button>
            )}
          </div>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text or use results from Analyze..."
            rows={10}
            className="w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            disabled={loading}
          />
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
          <label className="mb-3 block text-sm font-semibold text-[var(--foreground)]">
            Job description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description to compare against..."
            rows={10}
            className="w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--muted)]">
          Tip: Run &quot;Analyze Resume&quot; first, then copy your resume text for best results.
        </p>
        <button
          onClick={handleCompare}
          disabled={loading}
          className="rounded-lg bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-60"
        >
          {loading ? "Comparing…" : "Compare"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Comparison Results
          </h2>

          {parsed ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {typeof parsed.matchScore === "number" && (
                <div className="sm:col-span-2">
                  <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                      Match Score
                    </h3>
                    <div className="flex items-center gap-4">
                      <div
                        className="text-4xl font-bold"
                        style={{
                          color:
                            parsed.matchScore >= 70
                              ? "var(--success)"
                              : parsed.matchScore >= 40
                                ? "var(--warning)"
                                : "#ef4444",
                        }}
                      >
                        {parsed.matchScore}%
                      </div>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--card-border)]">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${parsed.matchScore}%`,
                            backgroundColor:
                              parsed.matchScore >= 70
                                ? "var(--success)"
                                : parsed.matchScore >= 40
                                  ? "var(--warning)"
                                  : "#ef4444",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {parsed.strengths && parsed.strengths.length > 0 && (
                <SectionCard title="Strengths" content={parsed.strengths} />
              )}
              {parsed.missingSkills && parsed.missingSkills.length > 0 && (
                <SectionCard title="Missing Skills" content={parsed.missingSkills} />
              )}
              {parsed.improvementSuggestions && parsed.improvementSuggestions.length > 0 && (
                <div className="sm:col-span-2">
                  <SectionCard
                    title="Improvement Suggestions"
                    content={parsed.improvementSuggestions}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-[var(--foreground)]">
                AI Analysis
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
                {result.comparison}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
