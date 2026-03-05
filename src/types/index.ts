export type Archetype =
  | "film-bro"
  | "chaos-agent"
  | "safe-picker"
  | "underdog-stan";

export interface Nominee {
  id: string;
  name: string;
  film: string;
  isFrontrunner?: boolean;
}

export interface Category {
  id: string;
  name: string;
  appComment: string;
  nominees: Nominee[];
}

export interface BallotState {
  sessionId: string;
  archetype: Archetype;
  picks: Record<string, string>; // categoryId → nomineeId
  currentIndex: number;
  chaosScore: number;
  submitted: boolean;
  finalScore?: number;
}

export interface BallotRow {
  id: string;
  session_id: string;
  archetype: Archetype;
  picks: Record<string, string>;
  chaos_score: number;
  final_score: number | null;
  created_at: string;
  updated_at: string;
}

export type Winners = Record<string, string>; // categoryId → nomineeId

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    archetype: Archetype;
  }[];
}

export interface SessionData {
  sessionId: string;
  archetype: Archetype | null;
  picks: Record<string, string>;
  currentIndex: number;
  submitted: boolean;
  finalScore?: number;
}
