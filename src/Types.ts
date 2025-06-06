interface ProblemExample {
  input: string;
  output: string;
  explanation: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
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
  hints: string[];
  editorial: string | null;
  codeSnippets: Record<string, string>;
  referenceSolutions: Record<string, string>;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  isSolved: boolean;
  isFavorite: boolean;
  ytLink?: string;
}

export interface FilterData {
  queryParams?: string;
  q?: string;
  difficulty?: string;
  status?: string;
  topic?: string;
}

export interface ProblemData {
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic?: string[];
  examples?: string;
  constraints?: string[];
  hints?: string[];
  editorial?: string;
  testcases?: string;
  codeSnippets?: string;
  referenceSolutions?: string;
  companyName?: string[];
}

export interface PlaylistData {
  name: string;
  description: string;
}

export interface Execute {
  source_code: string;
  language_id: number;
  problemId: string;
  mode: "submit" | "run";
  playlistId?: string;
}

export interface TestCase {
  id: string;
  submissionId: string;
  testCase: string;
  expected: string;
  stdout: string;
  passed: boolean;
  time: string;
  memory: string;
  status: string;
}

export interface SubmissionData {
  id: string;
  userId: string;
  problemId: string;
  sourceCode: string;
  language: string;
  status: string;
  memory: string[];
  time: string[];
  testcase: TestCase[];
  createdAt: string;
}

export interface ProblemDataHandle {
  id: string;
  title: string;
  problemNumber: number;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD"; // You can adjust this union type as needed
  topic: string[];
  companyName: string[];
  userId: string;
  ytLink: string | null;
  examples: {
    [language: string]: {
      input: string;
      output: string;
      explanation: string;
    };
  };
  constraints: string[];
  hints?: string[];
  editorial: string;
  starterFunction: string | null;
  codeSnippets: {
    [language: string]: string;
  };
  referenceSolutions: {
    [language: string]: string;
  };
  isPremium: boolean;
  image: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  testcases: string[];
  vote?: string;
}

export interface ProblemDescriptionProps {
  problem: ProblemDataHandle;
}

export interface DiscussionData {
  content: string;
  problemId: string;
  parentId?: string;
}
