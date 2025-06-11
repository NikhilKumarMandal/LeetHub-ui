import { Clock, Video } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { getInterviewDetails } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/store";
import { useContext } from "react";
import { InterviewDataContext } from "@/context/InterviewDataContext";

const getInterviewById = async (id: string) => {
  const { data } = await getInterviewDetails(id);
  return data;
};

function Interview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const { data } = useQuery({
    queryKey: ["interview", interviewId],
    queryFn: () => {
      return getInterviewById(interviewId!).then((res) => res.data);
    },
  });

  console.log(interviewInfo);

  const onJoinInterview = () => {
    if (data) {
      setInterviewInfo(data);
      localStorage.setItem("interviewInfo", JSON.stringify(data));
      navigate(`/auth/startInterview/${data.id}`);
    }
  };

  return (
    <div className="px-10 md:px-28 lg:px-48 xl:px-6 mt-7 ">
      <div className="flex flex-col items-center justify-center border rouned-lg bg-white p-7 lg:px-33 xl:px-52 mb-20">
        <p className="w-[140px]">LeetHub</p>
        <h2 className="mt-3">AI-Powred Interview Platform</h2>
        <img src="" alt="" className="w-[280px]my-6" />
        <h2 className="font-bold text-xl">{data?.jobPosition}</h2>
        <h2 className="flex gap-2 items-center text-gray-500 mt-3">
          <Clock className="h-4 w-4" /> {data?.duration}
        </h2>
        <div className="w-full">
          <h2>UserName: {user?.name} </h2>
        </div>

        <Button
          onClick={() => onJoinInterview()}
          className="mt-5 w-full font-bold"
        >
          <Video /> Join interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;
