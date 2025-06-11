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
    <div className="px-6 sm:px-12 md:px-24 lg:px-36 xl:px-48 py-10 bg-black min-h-screen text-white">
      <div className="bg-zinc-900 rounded-2xl shadow-lg p-8 max-w-2xl mx-auto flex flex-col items-center space-y-6">
        <p className="text-sm text-[#FFD369] font-medium tracking-wide">
          LeetHub
        </p>
        <h2 className="text-2xl font-bold text-center">
          AI-Powered Interview Platform
        </h2>

        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-XT8bxBylEFoOGtNy_wsiMd7zEP0SWARL9w&s"
          alt="Interview Illustration"
          className="w-64 h-40 object-contain"
        />

        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">{data?.jobPosition}</h2>
          <div className="flex justify-center items-center gap-2 text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{data?.duration}</span>
          </div>
        </div>

        <div className="w-full text-left text-gray-300">
          <p>
            <span className="font-medium text-white">User:</span> {user?.name}
          </p>
        </div>

        <Button
          onClick={onJoinInterview}
          className="w-full font-semibold flex items-center gap-2 bg-[#FFD369] hover:bg-[#FFD369]/90 transition"
        >
          <Video className="w-5 h-5" />
          Join Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;
