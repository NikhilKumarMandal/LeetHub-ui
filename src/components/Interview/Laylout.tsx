import {
  InterviewDataContext,
  type InterviewData,
} from "@/context/InterviewDataContext";
import Header from "./Header";
import { useState } from "react";

function Laylout({ children }: { children: any }) {
  const [interviewInfo, setInterviewInfo] = useState<InterviewData | null>(
    null
  );
  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      <div className="bg-secondary">
        <Header />
        {children}
      </div>
    </InterviewDataContext.Provider>
  );
}

export default Laylout;
