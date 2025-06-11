// InterviewDataContext.ts
import { createContext } from "react";

export interface InterviewData {
  id: string;
  jobPosition: string;
  jobDescription: string;
  duration: string;
  type: string[];
  questionList: any;
  userName?: string;
}

export interface InterviewDataContextType {
  interviewInfo: InterviewData | null;
  setInterviewInfo: (info: InterviewData | null) => void;
}

// Provide default value to avoid null errors
export const InterviewDataContext = createContext<InterviewDataContextType>({
  interviewInfo: null,
  setInterviewInfo: () => {},
});
