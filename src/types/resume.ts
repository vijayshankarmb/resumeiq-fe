export interface ResumeSections {
  summary?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  projects?: string;
  other?: string;
}

export interface ResumeScore {
  atsScore: number;
  structureScore: number;
  readabilityScore: number;
  totalScore: number;
}

export interface SuggestionsData {
  summarySuggestions?: string[];
  skillsSuggestions?: string[];
  experienceSuggestions?: string[];
  projectsSuggestions?: string[];
  overallAdvice?: string;
}

export interface AnalyzeResponse {
  file: { fileName: string; size: number };
  resumeText: string;
  sections: ResumeSections;
  scores: ResumeScore;
  suggestions: string;
}

export interface CompareResponse {
  comparison: string;
}

export interface ParsedComparison {
  matchScore?: number;
  missingSkills?: string[];
  strengths?: string[];
  improvementSuggestions?: string[];
}
