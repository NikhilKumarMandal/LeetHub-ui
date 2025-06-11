import { useAuthStore } from "@/store/store";
import { Mic, Phone, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./AlertConfirmation";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
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
  };

  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between">
        AI INTERVIEW SESSION
        <span className="flex gap-2 items-center">
          <Timer />
          00:00:00
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          {!activeUser && (
            <span className="absolute w-16 h-16 bg-blue-500 rounded-full opacity-75 animate-ping" />
          )}
          <img
            src=""
            alt=""
            width={100}
            height={100}
            className="w-[60px] h-[60px] rounded-full object-cover"
          />
          <h2>AI Recruiter</h2>
        </div>
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          {!activeUser && (
            <span className="absolute w-16 h-16 bg-blue-500 rounded-full opacity-75 animate-ping" />
          )}
          <img
            src={user?.avatar?.url}
            alt="avatar"
            width={100}
            height={100}
            className="w-[60px] h-[60px] rounded-full object-cover"
          />
          <h2>{user?.name}</h2>
        </div>
      </div>

      <div className="flex items-center gap-5 justify-center mt-7">
        <Mic className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full" />
        <AlertConfirmation stopInterview={stopInterview}>
          <Phone className="h-12 w-12 p-3 bg-red-500 text-white rounded-full" />
        </AlertConfirmation>
      </div>
    </div>
  );
}

export default StartInterview;
