import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Heart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { favoriteProblems, toggleFavorite } from "@/http/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { YoutubeDialog } from "@/components/YoutubeDialog";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["favorite"],
    queryFn: () => favoriteProblems().then((res) => res.data),
  });

  const { mutate: toggleFavoriteMutate } = useMutation({
    mutationKey: ["favroite"],
    mutationFn: async (problemId: string) => {
      const res = await toggleFavorite(problemId);
      return res;
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
  });

  const problems = data?.data?.problem;
  console.log(problems);

  return (
    <div className="min-h-screen bg-[#1e232c]">
      <div className="container mx-auto px-4">
        <div className="py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="border-gray-700 text-gray-300 hover:text-white"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  My Favorite Problems
                </h1>
                <p className="text-gray-400 mt-1">
                  {data?.data?.problem.length > 0
                    ? `You have ${data?.data?.problem.length} favorite problem${data?.data?.problem.length !== 1 ? "s" : ""}`
                    : "Start adding problems to your favorites"}
                </p>
              </div>
            </div>
          </div>

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
                  {problem.ytLink && (
                    <YoutubeDialog videoUrl={problem?.ytLink} />
                  )}

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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
