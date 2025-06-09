import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { CircularProgressBar } from "@/components/CircularProgressBar";
import { AvatarModal } from "@/components/AvatarModal";
import SubmissionHeatmap from "@/components/SubmissionHeatmap";
import Topbar from "@/components/Topbar";
import { useQuery } from "@tanstack/react-query";
import { submissionActivity } from "@/http/api";
import { useAuthStore } from "@/store/store";

export default function ProfilePage() {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const { user } = useAuthStore();

  const avatar = user?.avatar?.url as string;
  const [avatarUrl, setAvatarUrl] = useState(avatar);

  const handleAvatarClick = () => {
    setIsAvatarModalOpen(true);
  };
  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
    setIsAvatarModalOpen(false);
  };

  const handleModalClose = () => {
    setIsAvatarModalOpen(false);
  };

  const { data: submissionData } = useQuery({
    queryKey: ["totalSubmission"],
    queryFn: async () => {
      return await submissionActivity().then((res) => res.data);
    },
  });

  return (
    <div className="min-h-screen bg-[#1e232c] text-white">
      <Topbar />

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            <div className="rounded-lg bg-[#282828] p-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={handleAvatarClick}
                    className="h-16 w-16 overflow-hidden rounded-md bg-gray-700 hover:ring-2 hover:ring-green-500 transition-all duration-200 group"
                  >
                    <img
                      src={avatar || "/default-avatar.png"}
                      alt="Profile"
                      width={64}
                      height={64}
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Change
                      </span>
                    </div>
                  </button>
                </div>
                <div>
                  <h1 className="flex items-center text-xl font-semibold">
                    {user?.name}
                    <span className="ml-2 text-green-500">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  </h1>
                  <p className="text-gray-400">{user?.name}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-[#282828] p-6">
              <h2 className="mb-4 text-lg font-medium">
                Submission Count by Language
              </h2>
              <div className="space-y-2">
                {Object.entries(submissionData?.data?.languageStats || {}).map(
                  ([language, count]: [string, any]) => (
                    <div
                      key={language}
                      className="flex items-center justify-between"
                    >
                      <span className="rounded-full bg-gray-700 px-3 py-1 text-sm text-white">
                        {language}
                      </span>
                      <span className="text-sm text-white">
                        {count} problems solved
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-[#282828] p-6">
                <div className="flex flex-col items-center justify-center">
                  <CircularProgressBar
                    value={submissionData?.data?.totalSolved}
                    maxValue={submissionData?.data?.totalProblems}
                    size={180}
                    strokeWidth={15}
                  />
                  <div className="mt-4 text-center">
                    <p className="flex items-center justify-center">
                      <CheckIcon className="mr-1 h-5 w-5 text-green-500" />
                      <span>Solved</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-[#282828] p-6">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-teal-400">Easy</span>
                      <span>
                        {submissionData?.data?.solvedByDifficulty?.easy}/
                        {submissionData?.data?.totalByDifficulty?.easy}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-teal-400"
                        style={{ width: "7.4%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-yellow-400">Med.</span>
                      <span>
                        {submissionData?.data?.solvedByDifficulty?.medium}/
                        {submissionData?.data?.totalByDifficulty?.medium}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-yellow-400"
                        style={{ width: "2.8%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-red-400">Hard</span>
                      <span>
                        {submissionData?.data?.solvedByDifficulty?.hard}/
                        {submissionData?.data?.totalByDifficulty?.hard}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-red-400"
                        style={{ width: "0.2%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-[#282828] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium">
                    {submissionData?.data?.totalSubmissions}{" "}
                    <span className="text-gray-400 text-base">
                      total submission tell date
                    </span>
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">
                    Total active days:{" "}
                    <span className="text-white">
                      {submissionData?.data?.activeDays}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Max streak:{" "}
                    <span className="text-white">
                      {submissionData?.data?.maxStreak}
                    </span>
                  </div>
                </div>
              </div>
              <SubmissionHeatmap
                data={submissionData?.data?.submissionActivity}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Avatar Modal */}
      {isAvatarModalOpen && (
        <AvatarModal
          isOpen={isAvatarModalOpen}
          onClose={handleModalClose}
          onAvatarUpdate={handleAvatarUpdate}
          currentAvatar={avatarUrl}
        />
      )}
    </div>
  );
}
