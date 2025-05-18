interface ProblemExample {
  input: string;
  output: string;
  explanation: string;
}

export interface Problem {
  id: string;
  title: string;
  problemNumber: number;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic: string[];
  userId: string;
  examples: Record<string, ProblemExample>;
  constraints: string;
  hints: string | null;
  editorial: string | null;
  codeSnippets: Record<string, string>;
  referenceSolutions: Record<string, string>;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  isSolved: boolean;
}

export interface FilterData {
  queryParams?: string;
  q?: string;
  difficulty?: string;
  status?: string;
  topic?: string;
}
