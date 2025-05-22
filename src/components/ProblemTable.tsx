import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Star,
  Edit2,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  addProblemInPlaylist,
  allProblems,
  deleteProblem,
  getALLPlaylistDetails,
} from "@/http/api";
import { useState } from "react";
import { LIMIT } from "@/constants";
import type { FilterData, Problem } from "@/Types";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { usePermission } from "@/hooks/userPermission";
import { toast } from "sonner";

const problemdelete = async (id: string) => {
  return await deleteProblem(id);
};

const addProblem = async (id: string, problemId: string) => {
  const { data } = await addProblemInPlaylist(id, problemId);
  return data;
};

export function ProblemsTable() {
  const { isAllowed } = usePermission();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({
    limit: LIMIT,
    page: 1,
  });

  const [open, setOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null
  );
  const q = searchParams.get("q") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const status = searchParams.get("status") || "";

  const { data } = useQuery({
    queryKey: ["problems", queryParams, q, difficulty, status],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();

      const filters: FilterData = {
        queryParams: queryString,
        q,
        difficulty,
        status,
      };

      return allProblems(filters).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { data: playlist } = useQuery({
    queryKey: ["playlist"],
    queryFn: () => {
      return getALLPlaylistDetails().then((res) => res.data);
    },
  });

  console.log("playlist", playlist);

  const { mutate } = useMutation({
    mutationKey: ["playlist"],
    mutationFn: ({ id, problemId }: { id: string; problemId: string }) =>
      addProblem(id, problemId),
    onSuccess: () => {
      toast.success("Problem added to playlist");
      setOpen(false);
    },
  });

  const deleteProblemMutation = useMutation({
    mutationKey: ["problems"],
    mutationFn: (id: string) => problemdelete(id),
  });

  const totalPages = data?.data?.pagination.totalPages || 1;
  const problems: Problem[] = data?.data?.problems || [];

  const handleAddToPlaylist = (problemId: string) => {
    setSelectedProblemId(problemId);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#1f1f1f] border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Select Playlist</DialogTitle>
            <DialogDescription>
              Select a playlist to add this problem.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            {playlist?.data.map((pl: any) => (
              <Button
                key={pl.id}
                variant="outline"
                className="bg-[#2d2d2d] hover:bg-[#3a3a3a] border border-gray-600 text-white"
                onClick={() => {
                  if (selectedProblemId) {
                    mutate({ id: pl.id, problemId: selectedProblemId });
                  }
                }}
              >
                {pl.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
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
            className="pl-9 bg-[#2d2d2d] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-500 text-sm"
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

          <Button
            variant="outline"
            size="icon"
            className="bg-[#2d2d2d] border-gray-700 text-gray-400 hover:bg-[#3a3a3a] h-9 w-9 md:h-10 md:w-10"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Problem list */}
      <div className="flex-1 overflow-auto">
        <div className="grid gap-2 p-3 sm:p-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-4"
            >
              {problem.isSolved && (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-medium text-xs sm:text-sm">
                    {problem.problemNumber}.
                  </span>
                  <Link
                    to={`/problems/${problem.id}`}
                    className="font-medium text-xs sm:text-sm truncate text-white hover:underline"
                  >
                    {problem.title}
                  </Link>
                </div>
              </div>

              <span
                className={`${
                  problem.difficulty === "EASY"
                    ? "text-teal-500"
                    : problem.difficulty === "MEDIUM"
                      ? "text-yellow-500"
                      : "text-red-500"
                } font-medium text-xs sm:text-sm`}
              >
                {problem.difficulty}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 h-7 w-7 sm:h-8 sm:w-8"
                aria-label="Star problem"
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>

              {isAllowed && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Add to Playlist"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToPlaylist(problem.id);
                  }}
                  className="text-purple-400 hover:text-purple-600 h-7 w-7 sm:h-8 sm:w-8"
                >
                  <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}

              {isAllowed && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Update problem"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/auth/problems/update/${problem.id}`);
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
                      deleteProblemMutation.mutate(problem.id);
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

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 pt-6">
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

        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white font-medium shadow-md text-sm">
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
  );
}
