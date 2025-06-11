import { useAuthStore } from "@/store/store";
import { Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./AlertConfirmation";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { getInterviewDetails } from "@/http/api";
import { useQuery } from "@tanstack/react-query";

// fetch interview by ID
const getInterviewById = async (id: string) => {
  const { data } = await getInterviewDetails(id);
  return data;
};

function StartInterview() {
  const { user } = useAuthStore();
  const [activeUser, setActiveUser] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const vapi = useRef(new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY));

  const { data } = useQuery({
    queryKey: ["interview", interviewId],
    queryFn: () => getInterviewById(interviewId!),
  });

  useEffect(() => {
    if (data && !callStarted) {
      startCall();
      setCallStarted(true);
    }
  }, [data]);

  const startCall = () => {
    const questionList = data?.questionList?.interviewQuestions
      .map((item: any) => item?.question)
      .join(", ");

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${user?.name}, how are you? Ready for your interview on ${data?.jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              You are an AI assistant conducting an interview for ${data?.jobPosition}.
              Begin with a warm intro.
              Ask questions one at a time and wait for the response.
              Questions: ${questionList}
              Encourage the candidate and end with a positive note.
            `.trim(),
          },
        ],
      },
    };

    vapi.current.start(assistantOptions as any);
  };

  useEffect(() => {
    const api = vapi.current;

    api.on("call-start", () => toast("Call connected.."));
    api.on("speech-start", () => setActiveUser(false));
    api.on("speech-end", () => setActiveUser(true));
    api.on("call-end", () => {
      toast("Interview ended");
      setCallStarted(false); // optional if you want to allow restart
    });

    return () => {
      api.off("call-start", () => {});
      api.off("speech-start", () => {});
      api.off("speech-end", () => {});
      api.off("call-end", () => {});
    };
  }, []);

  const stopInterview = () => {
    vapi.current.stop();
    setCallStarted(false);
    toast("Interview ended");
    navigate("/auth/home");
  };

  return (
    <div className="px-6 md:px-12 lg:px-36 py-10 bg-black text-white min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI INTERVIEW SESSION</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {/* AI Recruiter */}
        <div className="bg-zinc-800 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center relative">
          {!activeUser && (
            <span className="absolute w-16 h-16 bg-blue-500 rounded-full opacity-75 animate-ping" />
          )}
          <img
            src="https://w0.peakpx.com/wallpaper/142/80/HD-wallpaper-cowgirl-dani-daniels-model-cowboy-hat-cowgirl-brunette.jpg"
            alt="AI Recruiter"
            className="w-20 h-20 rounded-full object-cover border-2 border-white mb-3"
          />
          <h3 className="text-lg font-semibold">AI Recruiter</h3>
        </div>

        {/* User */}
        <div className="bg-zinc-800 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center relative">
          {activeUser && (
            <span className="absolute w-16 h-16 bg-green-500 rounded-full opacity-75 animate-ping" />
          )}
          <img
            src={user?.avatar?.url || "/user-avatar.png"}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-white mb-3"
          />
          <h3 className="text-lg font-semibold">{user?.name}</h3>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-12">
        <AlertConfirmation stopInterview={stopInterview}>
          <Phone className="h-12 w-12 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition" />
        </AlertConfirmation>
      </div>
    </div>
  );
}

export default StartInterview;
