import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import ProblemDescription from "./ProblemDescription";
import { problemById } from "@/http/api";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ProblemDataHandle } from "@/Types";
import Playground from "./Playground";

const getProblem = async (id: string) => {
  const { data } = await problemById(id);
  return data;
};

const ResizableLayout = () => {
  const { problemId } = useParams();
  const { data: problem } = useQuery({
    queryKey: ["problem", problemId],
    queryFn: () => {
      return getProblem(problemId!);
    },
    enabled: !!problemId,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  console.log("Problem fetched:", problem);
  const problemData: ProblemDataHandle = problem?.data;
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-1">
      {/* Left Panel - Problem Description */}
      <ResizablePanel
        defaultSize={40}
        minSize={25}
        maxSize={60}
        className="overflow-hidden"
      >
        <ProblemDescription problem={problemData} />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={50} minSize={50} className="overflow-hidden">
        <ResizablePanelGroup direction="vertical" className="min-h-0">
          <ResizablePanel
            defaultSize={50}
            minSize={40}
            className="overflow-hidden"
          >
            <Playground problem={problemData} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ResizableLayout;
