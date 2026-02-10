"use client";

import { useState } from "react";
import { Nav } from "./Nav";
import { AnalyzeView } from "./AnalyzeView";
import { CompareView } from "./CompareView";
import UserAccount from "./UserAccount";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<"analyze" | "compare">("analyze");
  const [resumeTextFromAnalyze, setResumeTextFromAnalyze] = useState<string>("");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 sm:mb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              ResumeIQ
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
              Analyze and optimize your resume with AI
            </p>
          </div>
          <Nav activeTab={activeTab} onTabChange={setActiveTab} />
          <UserAccount />
        </div>
      </header>

      <main>
        {activeTab === "analyze" ? (
          <AnalyzeView onResumeAnalyzed={setResumeTextFromAnalyze} />
        ) : (
          <CompareView defaultResumeText={resumeTextFromAnalyze} />
        )}
      </main>
    </div>
  );
}
