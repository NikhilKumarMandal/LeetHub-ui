import FromContainer from "@/components/FromContainer";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateProblem } from "@/http/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface FormData {
  [key: string]: string;
}

const generateProblems = async (questiondata: any) => {
  const { data } = await generateProblem(questiondata);
  return data;
};

function CreateInterview() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({});

  const [interviewData, setInterviewData] = useState<any>(null);
  const [interviewId, setInterviewId] = useState();
  const onHandleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log(interviewData);
  console.log(interviewId);

  const { mutate, isPending } = useMutation({
    mutationFn: generateProblems,
    onSuccess: (res: any) => {
      toast.success("Questions generated!");
      setInterviewId(res.data.id);
      setInterviewData(res.data);
      navigate(`/auth/interview/${res?.data?.id}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const onGoToNext = () => {
    const { jobPosition, jobdescription, duration, type } = formData;

    if (
      !formData.jobPosition ||
      !formData?.jobdescription ||
      !formData?.duration ||
      !formData?.type
    ) {
      toast("Fill the form first");
      return;
    }

    mutate({
      jobPosition,
      jobDescription: jobdescription,
      duration,
      type,
    });
  };

  return (
    <div className="mt-10 px-10 md:px-24 lg:px-44 xl:px-56">
      <div className="flex gap-5 items-center">
        <ArrowLeft className="cursor-pointer" />
        <h2 className="font-bold text-2xl">Create New Interview</h2>
      </div>
      <FromContainer
        onHandleInputChange={onHandleInputChange}
        GoToNext={() => onGoToNext()}
        isPending={isPending}
      />
    </div>
  );
}

export default CreateInterview;
