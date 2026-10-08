export interface ParsedSlide {
  id: number;
  pageNumber: number;
  title: string;
  subtitle?: string;
  text: string;
  keyPoints: string[];
  allocatedTime: number; // in seconds
  actualTime: number; // in seconds
  visualTag?: string;
  thumbnailUrl?: string;
}

export interface PitchRubricItem {
  category: string;
  weight: string;
  criterion: string;
  comment: string;
  score: number; // 0 - 10
}

export interface SlideCadenceItem {
  slide: string;
  time: string;
  target: string;
  share: number;
  alert?: string;
}

export interface JudgeQuestionItem {
  judge: string;
  question: string;
  suggestedAnswer: string;
  userAnswer?: string;
}

export interface EvaluationResult {
  id: string;
  deckName: string;
  date: string;
  totalDurationSec: number;
  targetDurationSec: number;
  overallScore: number; // e.g. 7.8 out of 10
  overallScoreFormatted: string; // e.g. "7.8 / 10"
  status: "Needs Polish" | "Solid Contender" | "Winning Caliber";
  marginNote: string;
  marginTargetCategory: string;
  rubric: PitchRubricItem[];
  slidePacing: SlideCadenceItem[];
  fillerWords: { word: string; count: number; timestamp?: string }[];
  strengths: string[];
  improvements: string[];
  judgeQuestions: JudgeQuestionItem[];
  transcript: string;
  wpm: number;
  aiProvider?: "gemini" | "heuristic";
}
