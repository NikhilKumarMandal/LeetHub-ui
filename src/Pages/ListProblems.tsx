import {
  RefreshCcw,
  Play,
  Star,
  Search,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { allProblems, deleteProblem, toggleFavorite } from "@/http/api";
import { useState } from "react";
import { LIMIT } from "@/constants";
import type { FilterData } from "@/Types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import debounce from "lodash.debounce";
import { YoutubeDialog } from "@/components/YoutubeDialog";
import { usePermission } from "@/hooks/userPermission";
import { toast } from "sonner";

const problemdelete = async (id: string) => {
  return await deleteProblem(id);
};

export default function ListProblems() {
  const { topic } = useParams();
  const { isAllowed } = usePermission();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({
    limit: LIMIT,
    page: 1,
  });
  const q = searchParams.get("q") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const status = searchParams.get("status") || "";
  const navigate = useNavigate();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["topicName", queryParams, topic, q, difficulty, status],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();

      const filters: FilterData = {
        queryParams: queryString,
        topic,
        q,
        difficulty,
        status,
      };
      return allProblems(filters).then((res) => res.data);
    },
    enabled: !!topic,
  });

  const { mutate: toggleFavoriteMutate } = useMutation({
    mutationKey: ["favroite"],
    mutationFn: async (problemId: string) => {
      const res = await toggleFavorite(problemId);
      return res;
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["problems", queryParams, q, difficulty, status],
      });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const deleteProblemMutation = useMutation({
    mutationKey: ["problems"],
    mutationFn: (id: string) => problemdelete(id),
    onSuccess: () => {
      toast.success("Problem deleted");
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });

  const problems = data?.data?.problems;
  const totalPages = data?.data?.pagination.totalPages || 1;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-950 text-zinc-100">
      <div className="w-full md:w-[350px] border-r border-zinc-800 p-4 flex flex-col overflow-auto">
        <div className="flex flex-col items-center text-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="self-start mb-4 text-zinc-400 hover:text-white text-sm flex items-center"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
          <div className="relative mb-2">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-800">
              <AvatarImage
                src="/placeholder.svg?height=96&width=96"
                alt="String"
              />
              <AvatarFallback className="bg-zinc-800">
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
                  </svg>
                </div>
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-purple-600 p-1 rounded-md">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4 12 14.01l-3-3" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-2">
            {topic?.toLocaleUpperCase()}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-1">
            LeetHub · {data?.data?.pagination?.total} questions ·{" "}
            {data?.data?.totalProblem} Saved
          </p>

          {/* Action Buttons - Responsive grid */}
          <div className="grid grid-cols-4 gap-2 mt-4 w-full">
            <Button
              onClick={() => {
                if (problems && problems.length > 0) {
                  navigate(`/auth/problems/${problems[0].id}`);
                } else {
                  toast.error("No problems found to practice.");
                }
              }}
              className="col-span-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs sm:text-sm"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Practice
            </Button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-4 border-t border-zinc-800 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Progress</h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400"
              onClick={() => refetch()}
            >
              <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>

          {/* Progress Circle */}
          <div className="bg-zinc-900 rounded-lg p-4 mb-4">
            <div className="relative aspect-square max-w-[180px] mx-auto flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset="230"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold">
                  {data?.data?.solvedCount}
                </span>
                <span className="text-xs sm:text-sm text-zinc-400">
                  /{data?.data?.pagination?.total}
                </span>
                <span className="text-xs sm:text-sm text-green-500">
                  Solved
                </span>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="text-xs sm:text-sm text-zinc-400">
                {data?.data?.solvedCount} Attempting
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Search problems..."
              onChange={debounce((e) => {
                setSearchParams((prev) => {
                  prev.set("q", e.target.value);
                  return prev;
                });
                setQueryParams((prev) => ({
                  ...prev,
                  page: 1,
                }));
              }, 1000)}
              className="pl-10 bg-zinc-900 border-zinc-700 w-full text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select
              onValueChange={(value) => {
                setSearchParams((prev) => {
                  prev.set("difficulty", value);
                  return prev;
                });
                setQueryParams((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <SelectTrigger className="w-[130px] bg-[#2d2d2d] border-gray-700 text-white focus:ring-gray-500">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-[#2d2d2d] border-gray-700 text-white">
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => {
                setSearchParams((prev) => {
                  prev.set("status", value);
                  return prev;
                });
                setQueryParams((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <SelectTrigger className="w-[130px] bg-[#2d2d2d] border-gray-700 text-white focus:ring-gray-500">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#2d2d2d] border-gray-700 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="unsolved">Unsolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Problem List */}
        <div className="flex-1 overflow-auto">
          <div className="grid gap-2 p-3 sm:p-4">
            {problems?.map((problem: any) => (
              <div
                key={problem?.id}
                className="bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-4"
              >
                {problem?.isSolved && (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="font-medium text-xs sm:text-sm">
                      {problem?.problemNumber}.
                    </span>
                    <Link
                      to={`/auth/problems/${problem?.id}`}
                      className="font-medium text-xs sm:text-sm truncate text-white hover:underline"
                    >
                      {problem?.title}
                    </Link>
                  </div>
                </div>
                {problem.ytLink && <YoutubeDialog videoUrl={problem?.ytLink} />}

                <span
                  className={`${
                    problem.difficulty === "EASY"
                      ? "text-teal-500"
                      : problem?.difficulty === "MEDIUM"
                        ? "text-yellow-500"
                        : "text-red-500"
                  } font-medium text-xs sm:text-sm`}
                >
                  {problem?.difficulty}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 h-7 w-7 sm:h-8 sm:w-8"
                  aria-label="Star problem"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavoriteMutate(problem?.id);
                  }}
                >
                  {problem?.isFavorite ? (
                    <Star fill="yellow" className="text-yellow-400 w-4 h-4" />
                  ) : (
                    <Star className="w-4 h-4" />
                  )}
                </Button>

                {isAllowed && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Update problem"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/auth/problems/update/${problem?.id}`);
                      }}
                      className="text-blue-400 hover:text-blue-600 h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete problem"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteProblemMutation.mutate(problem?.id);
                      }}
                      className="text-red-500 hover:text-red-700 h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center gap-3 py-6 border-t border-zinc-800">
          <Button
            size="icon"
            variant="outline"
            disabled={queryParams.page === 1}
            onClick={() =>
              setQueryParams((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            className="bg-[#1f1f1f] border border-gray-600 text-gray-300 hover:bg-[#333] hover:text-white rounded-full p-3 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <span className="px-4 py-2 rounded-full bg-[#FFD369] text-black font-medium shadow-md text-sm">
            Page {queryParams.page} of {totalPages}
          </span>

          <Button
            size="icon"
            variant="outline"
            disabled={queryParams.page === totalPages}
            onClick={() =>
              setQueryParams((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            className="bg-[#1f1f1f] border border-gray-600 text-gray-300 hover:bg-[#333] hover:text-white rounded-full p-3 transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
