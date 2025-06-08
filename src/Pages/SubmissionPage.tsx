import { Check, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Topbar from "@/components/Topbar";
import { useState } from "react";
import { LIMIT } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { submissionData } from "@/http/api";
import { Link } from "react-router-dom";

export default function SubmissionPage() {
  const [queryParams, setQueryParams] = useState({
    limit: LIMIT,
    page: 1,
  });

  const { data: submission } = useQuery({
    queryKey: ["submissions", queryParams],
    queryFn: async () => {
      return await submissionData(queryParams.page).then((res) => res.data);
    },
  });

  console.log(submission?.data?.totalPages, "Submission");
  const totalPages = submission?.data?.totalPages;
  return (
    <div className="min-h-screen bg-[#1e232c] text-white">
      <Topbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold text-white">All My Submissions</h1>
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

        <div className="bg-[#252525] rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#2a2a2a] to-[#303030] border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[180px]">
                    Time Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[300px]">
                    Question
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[120px]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[100px]">
                    Runtime
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[100px]">
                    Language
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {submission?.data?.userActivity?.map(
                  (submission: any, index: any) => (
                    <tr
                      key={index}
                      className={`hover:bg-[#2d2d2d] transition-all duration-200 ${
                        index % 2 === 0 ? "bg-[#252525]" : "bg-[#2a2a2a]"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-[#333333] rounded-full flex items-center justify-center mr-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="text-sm font-medium text-gray-300">
                            {submission?.day}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/auth/problems/${submission?.problemId}`}
                          className="text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
                        >
                          {submission?.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {submission?.status === "Accepted" ? (
                          <div className="flex items-center">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-green-900/30 mr-2">
                              <Check className="h-3 w-3 text-green-500" />
                            </span>
                            <span className="text-sm font-medium text-green-500">
                              Accepted
                            </span>
                          </div>
                        ) : submission?.status === "Wrong Answer" ? (
                          <div className="flex items-center">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-red-900/30 mr-2">
                              <X className="h-3 w-3 text-red-500" />
                            </span>
                            <span className="text-sm font-medium text-red-500">
                              Wrong Answer
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-orange-900/30 mr-2">
                              <Clock className="h-3 w-3 text-orange-500" />
                            </span>
                            <span className="text-sm font-medium text-orange-500">
                              Time Limit Exceeded
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {submission.highlighted ? (
                          <div className="inline-flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium shadow-md">
                            {submission.runtime}
                          </div>
                        ) : submission.runtime !== "N/A" ? (
                          <div className="inline-flex items-center px-3 py-1 rounded-md bg-[#333333] text-gray-300 text-sm font-medium">
                            {submission.runtime}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 font-medium">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                            submission?.language === "javascript"
                              ? "bg-yellow-900/30 text-yellow-500 border border-yellow-800/50"
                              : "bg-blue-900/30 text-blue-500 border border-blue-800/50"
                          }`}
                        >
                          {submission?.language}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
