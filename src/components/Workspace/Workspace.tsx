import Split from "react-split";
import ProblemDescription from "./ProblemDescription";
import Playground from "./Playground";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { problemById } from "@/http/api";

const getProblem = async (id: string) => {
  const { data } = await problemById(id);
  return data;
};

const Workspace = () => {
  const { problemId } = useParams();
  const { data: problem } = useQuery({
    queryKey: ["problem", problemId],
    queryFn: () => {
      return getProblem(problemId!);
    },
    enabled: !!problemId,
  });

  console.log(problem?.data);

  return (
    <Split className="split ">
      <ProblemDescription problem={problem?.data} />
      <Playground problem={problem?.data} />
    </Split>
  );
};

export default Workspace;
