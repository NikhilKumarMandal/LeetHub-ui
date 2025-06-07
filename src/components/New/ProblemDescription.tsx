import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, ArrowBigUp, ArrowBigDown } from "lucide-react";
import type { DiscussionData, ProblemDescriptionProps } from "@/Types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDiscussion,
  getAllVote,
  getProblemDiscussion,
  getsubmissionDetails,
  voteOnProblem,
} from "@/http/api";
import { toast } from "sonner";
import CommentCard from "../CommentCard";

const vote = async ({
  problemId,
  type,
}: {
  problemId: string;
  type: "UPVOTE" | "DOWNVOTE";
}) => {
  const { data } = await voteOnProblem(problemId, type);
  return data;
};

const discussion = async (discussionData: DiscussionData) => {
  const { data } = await createDiscussion(discussionData);
  return data;
};

const getAllVoteOfProblems = async (problemId: string) => {
  const { data } = await getAllVote(problemId);
  return data;
};

const getSubmissionOfProblem = async (problemId: string) => {
  const { data } = await getsubmissionDetails(problemId);
  return data;
};

const getAllDiscussionRelatedToProblem = async (problemId: string) => {
  const { data } = await getProblemDiscussion(problemId);
  return data;
};

const ProblemDescription = ({ problem }: ProblemDescriptionProps) => {
  const [showHints, setShowHints] = useState(false);
  const queryClient = useQueryClient();
  const [parentId, setParentId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const { mutate: toggleVoteMutate } = useMutation({
    mutationKey: ["toggleVote"],
    mutationFn: vote,
    onSuccess: (res) => {
      toast.success(res?.message);
      queryClient.invalidateQueries({
        queryKey: ["problem"],
      });
      queryClient.invalidateQueries({
        queryKey: ["toggleVote"],
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["toggleVote"] });
    },
  });

  const problemId = problem?.id;
  const { data: voteData } = useQuery({
    queryKey: ["toggleVote", problemId],
    queryFn: () => {
      return getAllVoteOfProblems(problemId);
    },
  });

  const { data: submissiondata } = useQuery({
    queryKey: ["submission", problemId],
    queryFn: () => {
      return getSubmissionOfProblem(problemId).then((res) => res.data);
    },
  });

  const { mutate: discussionMutate, isPending } = useMutation({
    mutationKey: ["discussion"],
    mutationFn: discussion,
    onSuccess: (res) => {
      toast.success(res?.message);
      queryClient.invalidateQueries({
        queryKey: ["problem"],
      });
      queryClient.invalidateQueries({
        queryKey: ["discussion"],
      });
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!content.trim()) return;

    discussionMutate(
      {
        problemId: problem?.id,
        content,
        ...(parentId && { parentId }),
      },
      {
        onSuccess: () => {
          setContent("");
          setParentId(null);
        },
        onError: (error) => {
          console.error("Failed to submit comment", error);
        },
      }
    );
  };

  const { data: problemDiscussion } = useQuery({
    queryKey: ["discussion", problemId],
    queryFn: () => {
      return getAllDiscussionRelatedToProblem(problemId);
    },
    enabled: !!problemId,
  });

  function parseMemoryOrTime(str: any) {
    try {
      if (!str || str === "undefined") return [];
      return JSON.parse(str).map(Number);
    } catch (err) {
      console.error("Error parsing:", str);
      return [];
    }
  }

  let totalMemory = 0;
  let totalTime = 0;

  submissiondata?.forEach((submission: any) => {
    const memoryArray = parseMemoryOrTime(submission?.memory);
    const timeArray = parseMemoryOrTime(submission?.time);

    totalMemory += memoryArray.reduce((a: any, b: any) => a + b, 0);
    totalTime += timeArray.reduce((a: any, b: any) => a + b, 0);
  });
  console.log(problemDiscussion?.data, "discussion");

  return (
    <div className="h-full flex flex-col bg-[#1e232c]">
      <Tabs defaultValue="description" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-[#1e232c] border-b border-gray-600 flex-shrink-0">
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-gray-600 data-[state=active]:text-blue-400 text-gray-300"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="data-[state=active]:bg-gray-600 data-[state=active]:text-blue-400 text-gray-300"
          >
            Submissions
          </TabsTrigger>
          <TabsTrigger
            value="Editorial"
            className="data-[state=active]:bg-gray-600 data-[state=active]:text-blue-400 text-gray-300"
          >
            Editorial
          </TabsTrigger>
          <TabsTrigger
            value="discussion"
            className="data-[state=active]:bg-gray-600 data-[state=active]:text-blue-400 text-gray-300"
          >
            Discussion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="flex-1 m-0 overflow-auto">
          <div className="p-4 sm:p-6 space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-3 text-white">
                {problem?.title}
              </h1>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                <Badge className="bg-green-600 hover:bg-green-700 text-white">
                  {problem?.difficulty}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 h-7 w-7 sm:h-8 sm:w-8"
                  aria-label="Upvote problem"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleVoteMutate({
                      problemId: problem?.id,
                      type: "UPVOTE",
                    });
                  }}
                >
                  <ArrowBigUp
                    className={`w-6 h-6 size-4 ${
                      problem?.vote === "UPVOTE"
                        ? "text-green-500 fill-current"
                        : ""
                    }`}
                  />
                </Button>

                <span>{voteData?.data.upvote}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 h-7 w-7 sm:h-8 sm:w-8"
                  aria-label="Downvote problem"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleVoteMutate({
                      problemId: problem?.id,
                      type: "DOWNVOTE",
                    });
                  }}
                >
                  <ArrowBigDown
                    className={`w-6 h-6 size-4 ${
                      problem?.vote === "DOWNVOTE"
                        ? "text-red-500 fill-current"
                        : ""
                    }`}
                  />
                </Button>
                <span>{voteData?.data.downvote}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHints(!showHints)}
                  className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10 flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHints ? "Hide Hints" : "Show Hints"}
                </Button>
              </div>
            </div>

            {showHints && (
              <div className="bg-gray-900 border border-yellow-400/30 rounded-lg p-4 mb-6">
                {}
                <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Hints
                </h3>
                <div className="space-y-3">
                  {problem?.hints?.map((hint: any, index: any) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded p-3 border border-gray-700"
                    >
                      <p className="text-gray-300 text-sm mb-2">{hint}</p>
                      <div className="flex items-center gap-2"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-900 rounded-lg p-4 sm:p-5 border border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">
                Problem Statement
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed text-sm sm:text-base">
                <p>{problem?.description}</p>
              </div>
            </div>

            {problem?.examples && (
              <div className="bg-gray-900 rounded-lg p-4 sm:p-5 border border-gray-700 space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Examples
                </h3>

                {Object.entries(problem.examples).map(([_, example], idx) => {
                  const typedExample = example as {
                    input: string;
                    output: string;
                    explanation: string;
                  };
                  return (
                    <div
                      key={idx}
                      className="space-y-3 border-t border-gray-700 pt-4"
                    >
                      {/* Example Heading */}
                      <h4 className="text-white font-medium text-base">
                        Example {idx + 1}
                      </h4>

                      {/* Input */}
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Input:</p>
                        <div className="bg-gray-800 rounded border border-gray-700">
                          <pre className="p-3 text-green-400 text-sm font-mono whitespace-pre-wrap break-words">
                            {typedExample?.input}
                          </pre>
                        </div>
                      </div>

                      {/* Output */}
                      <div>
                        <p className="text-sm text-gray-400 mb-1">
                          Expected Output:
                        </p>
                        <div className="bg-gray-800 rounded border border-gray-700">
                          <pre className="p-3 text-blue-400 text-sm font-mono whitespace-pre-wrap break-words">
                            {typedExample.output}
                          </pre>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div>
                        <p className="text-sm text-gray-400 mb-1">
                          Explanation:
                        </p>
                        <div className="bg-gray-800 rounded border border-gray-700">
                          <pre className="p-3 text-yellow-400 text-sm font-mono whitespace-pre-wrap break-words">
                            {typedExample.explanation}
                          </pre>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {problem?.constraints && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                {problem?.constraints?.map((res: any, idx) => (
                  <ul
                    key={idx}
                    className="list-disc list-inside space-y-2 text-sm text-gray-300"
                  >
                    <li>
                      <code className="bg-gray-700 px-1 rounded">{res}</code>
                    </li>
                  </ul>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="flex-1 m-0 overflow-auto">
          <div className="p-4 space-y-4">
            {submissiondata?.length === 0 ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
                    <p className="text-gray-400 text-lg">No submissions yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Submit your solution to see your submission history
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              submissiondata?.map((submission: any) => (
                <div
                  key={submission.id}
                  className="bg-gray-900 text-white rounded-lg p-6 border border-gray-700 shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div
                      className={`text-sm font-semibold ${
                        submission.status === "Accepted"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {submission.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <p>
                        <span className="font-medium text-gray-400">
                          Language:
                        </span>{" "}
                        {submission.language}
                      </p>
                      <p>
                        <span className="font-medium text-gray-400">
                          Avg Time:
                        </span>{" "}
                        {totalTime.toFixed(2)} sec
                      </p>
                      <p>
                        <span className="font-medium text-gray-400">
                          Avg Memory:
                        </span>{" "}
                        {totalMemory} KB
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium text-gray-400">
                          Created:
                        </span>{" "}
                        {new Date(submission.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="font-medium text-gray-400 mb-1">
                      Source Code:
                    </p>
                    <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                      {submission.sourceCode}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="Editorial" className="flex-1 m-0 overflow-auto">
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
                {!problem?.editorial?.trim() ? (
                  <p className="text-gray-400 text-lg">
                    There is no editorial for this problem
                  </p>
                ) : (
                  <p className="text-white text-lg">{problem.editorial}</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="discussion" className="flex-1 m-0 overflow-auto">
          <div className="p-4 space-y-6">
            <form
              onSubmit={handleSubmit}
              className="bg-gray-900 p-4 rounded-lg border border-gray-700"
            >
              <textarea
                placeholder="Write a comment..."
                className="w-full p-3 text-sm text-white bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary text-white px-4 py-2 text-sm rounded hover:bg-primary/70"
                >
                  Post Comment
                </button>
              </div>
            </form>
            <div className="space-y-6">
              {problemDiscussion?.data?.map((data: any) => (
                <CommentCard
                  name={data?.user?.name}
                  comment={data?.content}
                  key={data?.id}
                  problemId={data?.problemId}
                  parentId={data?.id}
                  replies={data?.replies}
                  userId={data?.userId}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProblemDescription;
