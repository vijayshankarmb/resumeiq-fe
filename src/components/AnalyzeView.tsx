"use client";

import { useState } from "react";
import { analyzeResume } from "@/lib/api";
import type { AnalyzeResponse, SuggestionsData } from "@/types/resume";
import { FileUpload } from "./FileUpload";
import { ScoreCard } from "./ScoreCard";
import { SectionCard } from "./SectionCard";

function toStrArray(arr: unknown): string[] | undefined {
  if (!Array.isArray(arr)) return undefined;
  return arr
    .map((x) => (typeof x === "string" ? x : x != null ? String(x) : ""))
    .filter(Boolean);
}

function parseSuggestions(raw: string): SuggestionsData | null {
  try {
    let jsonStr = raw.trim();
    const codeBlock = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) jsonStr = codeBlock[1].trim();
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    return {
      summarySuggestions: toStrArray(parsed.summarySuggestions),
      skillsSuggestions: toStrArray(parsed.skillsSuggestions),
      experienceSuggestions: toStrArray(parsed.experienceSuggestions),
      projectsSuggestions: toStrArray(parsed.projectsSuggestions),
      overallAdvice: typeof parsed.overallAdvice === "string" ? parsed.overallAdvice : undefined,
    };
  } catch {
    return null;
  }
}

interface AnalyzeViewProps {
  onResumeAnalyzed?: (resumeText: string) => void;
}

export function AnalyzeView({ onResumeAnalyzed }: AnalyzeViewProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a resume file first");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeResume(file);
      setResult(data);
      onResumeAnalyzed?.(data.resumeText);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (f: File) => {
    setFile(f);
    setError(null);
    setResult(null);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
          Upload your resume
        </h2>
        <FileUpload
          onFileSelect={handleFileSelect}
          accept="application/pdf"
          disabled={loading}
          error={error ?? undefined}
        />
        {file && (
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="truncate text-sm text-[var(--muted)]">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-60"
            >
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Analysis Results
          </h2>

          {/* Scores */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreCard label="ATS Score" value={result.scores.atsScore} />
            <ScoreCard label="Structure" value={result.scores.structureScore} />
            <ScoreCard label="Readability" value={result.scores.readabilityScore} />
            <ScoreCard
              label="Total Score"
              value={result.scores.totalScore}
              variant="total"
            />
          </div>

          {/* AI Suggestions */}
          {result.suggestions && (() => {
            const parsed = parseSuggestions(result.suggestions);
            if (parsed) {
              const hasAny =
                (parsed.summarySuggestions?.length ?? 0) > 0 ||
                (parsed.skillsSuggestions?.length ?? 0) > 0 ||
                (parsed.experienceSuggestions?.length ?? 0) > 0 ||
                (parsed.projectsSuggestions?.length ?? 0) > 0 ||
                (parsed.overallAdvice?.trim() ?? "").length > 0;
              if (!hasAny) return null;

              return (
                <div className="space-y-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                    <span className="rounded bg-[var(--accent)]/20 p-1.5">
                      <svg
                        className="h-4 w-4 text-[var(--accent)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </span>
                    AI Suggestions
                  </h3>

                  {parsed.overallAdvice?.trim() && (
                    <div className="rounded-xl border-l-4 border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-3">
                      <p className="text-sm font-medium text-[var(--accent)]">Overall advice</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
                        {parsed.overallAdvice}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    {parsed.summarySuggestions && parsed.summarySuggestions.length > 0 && (
                      <SectionCard title="Summary" content={parsed.summarySuggestions} />
                    )}
                    {parsed.skillsSuggestions && parsed.skillsSuggestions.length > 0 && (
                      <SectionCard title="Skills" content={parsed.skillsSuggestions} />
                    )}
                    {parsed.experienceSuggestions && parsed.experienceSuggestions.length > 0 && (
                      <SectionCard title="Experience" content={parsed.experienceSuggestions} />
                    )}
                    {parsed.projectsSuggestions && parsed.projectsSuggestions.length > 0 && (
                      <SectionCard title="Projects" content={parsed.projectsSuggestions} />
                    )}
                  </div>
                </div>
              );
            }
            return (
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[var(--foreground)]">
                  <span className="rounded bg-[var(--accent)]/20 p-1.5">
                    <svg
                      className="h-4 w-4 text-[var(--accent)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </span>
                  AI Suggestions
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
                  {result.suggestions}
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
