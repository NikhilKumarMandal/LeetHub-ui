import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Edit2, Play, Star, Target, Trash2 } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteProblem, getPlaylistById } from "@/http/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePermission } from "@/hooks/userPermission";

const getPlaylistDetailsById = async (id: string) => {
  const { data } = await getPlaylistById(id);
  return data;
};

const problemdelete = async (id: string) => {
  return await deleteProblem(id);
};

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const { isAllowed } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname;

  const match = url.match(/\/playlist\/([a-f0-9\-]+)/i);
  const playlistId1 = match?.[1];

  const { data } = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => getPlaylistDetailsById(playlistId!),
    enabled: !!playlistId,
  });

  console.log(data);

  const deleteProblemMutation = useMutation({
    mutationKey: ["problems"],
    mutationFn: (id: string) => problemdelete(id),
  });

  return (
    <div className="min-h-screen bg-[#0D1117] bg-[radial-gradient(#2C333A_1px,transparent_1px)] bg-[size:24px_24px]">
      <div className="container mx-auto px-4">
        <div className="py-8">
          <div className="flex items-center mb-8">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </Button>
          </div>

          {/* Study Plan Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-40 h-40 relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center text-black font-bold text-7xl">
                JS
                <span className="absolute bottom-1 right-1 bg-amber-300 text-orange-700 text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center">
                  30
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <Target className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">Hello World</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {data?.data?.name}
              </h1>
              <p className="text-gray-300 mb-6 max-w-2xl">
                {data?.data?.description}
              </p>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-medium gap-2">
                <Play className="h-4 w-4 fill-black" />
                Start
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {data?.data?.categories.map((category: any, index: any) => (
                <Card key={index} className="bg-gray-900/60 border-gray-800">
                  <CardHeader className="pb-3 border-b border-gray-800">
                    <CardTitle className="text-white">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-800">
                      {category?.problems.map((problem: any) => (
                        <div
                          key={problem.id}
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
                                to={`/auth/problems/${problem.id}?playlistId=${playlistId}`}
                                state={{ playlistId1 }}
                                className="font-medium text-xs sm:text-sm truncate text-white hover:underline"
                              >
                                {problem?.title}
                              </Link>
                            </div>
                          </div>

                          <span
                            className={`${
                              problem?.difficulty === "EASY"
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
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Update problem"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(
                                    `/auth/problems/update/${problem.id}`
                                  );
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
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader className="pb-3 border-b border-gray-800">
                  <CardTitle className="text-white">Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0"></div>
                      <span className="text-gray-300"></span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
