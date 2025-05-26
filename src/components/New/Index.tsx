import { useParams } from "react-router-dom";
import Topbar from "../Topbar";
import ResizableLayout from "./ResizableLayout";

const Index = () => {
  const { problemId } = useParams<string>();
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      <Topbar problemPage={true} problemId={problemId} />
      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizableLayout key={problemId} />
      </div>
    </div>
  );
};

export default Index;
