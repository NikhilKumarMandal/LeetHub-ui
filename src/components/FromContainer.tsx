import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { InterviewType } from "@/constants";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

function FromContainer({
  onHandleInputChange,
  GoToNext,
  isPending,
}: {
  onHandleInputChange: any;
  GoToNext: any;
  isPending: boolean;
}) {
  const [interviewType, setInterviewType] = useState<string[]>([]);

  useEffect(() => {
    if (interviewType) {
      onHandleInputChange("type", interviewType);
    }
  }, [interviewType]);

  const AddInterviewType = (title: any) => {
    const data = interviewType.includes(title);

    if (!data) {
      setInterviewType((prev: string[]) => [...prev, title]);
    } else {
      const result = interviewType.filter((item) => item != title);
      setInterviewType(result);
    }
  };

  return (
    <div className="p-5 rounded-2xl">
      <div>
        <h2 className="text-sm font-medium">Job Postions</h2>
        <Input
          placeholder="ex backend developer"
          className="mt-2"
          onChange={(e) => onHandleInputChange("jobPosition", e.target.value)}
        />
      </div>
      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="give details job description"
          className="mt-2 h-[200px]"
          onChange={(e) =>
            onHandleInputChange("jobdescription", e.target.value)
          }
        />
      </div>
      <div className="mt-5">
        <h2 className="text-sm">Interview Duration</h2>
        <Select
          onValueChange={(value) => onHandleInputChange("duration", value)}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>{" "}
          <SelectContent>
            <SelectItem value="2 min">2 min</SelectItem>
            <SelectItem value="5 min">5 min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        <h2 className="text-sm">Interview type</h2>
        <div className="flex gap-3 flex-wrap mt-2">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`flex items-center cursor-pointer gap-2 p-1 px-2  rounded-2xl border-gray-300 hover:bg-secondary
                      ${interviewType.includes(type.title) && "text-[#FFD369]"}
                      `}
              onClick={() => AddInterviewType(type.title)}
            >
              <type.icon className="h-4 w-4" />
              <span>{type.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-7 flex justify-end" onClick={() => GoToNext()}>
        <Button disabled={isPending}>
          {" "}
          {isPending ? "Generating..." : "Generate Question"} <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default FromContainer;
