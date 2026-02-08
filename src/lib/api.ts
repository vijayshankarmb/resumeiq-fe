const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function analyzeResume(file: File): Promise<import("@/types/resume").AnalyzeResponse> {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_BASE}/api/resume/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to analyze resume");
  }

  return res.json();
}

export async function compareResume(resumeText: string, jobDescription: string): Promise<import("@/types/resume").CompareResponse> {
  const res = await fetch(`${API_BASE}/api/resume/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText, jobDescription }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to compare resume");
  }

  return res.json();
}

export async function healthCheck(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
