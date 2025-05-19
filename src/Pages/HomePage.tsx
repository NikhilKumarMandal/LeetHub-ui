// Home.tsx
import { useState } from "react";
import { Code, Database, Settings, Terminal } from "lucide-react";

import type { ReactNode } from "react";
import CategoryList from "@/components/CategoryList";
import { TopicFilters } from "@/components/TopicFilters";
import SubmissionHeatmap from "@/components/SubmissionHeatmap";
import { Calendar } from "@/components/Calendar";
import { ProblemsTable } from "@/components/ProblemTable";
interface TopicFilter {
  id: string;
  name: string;
  icon: ReactNode;
  color: string;
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const topicFilters: TopicFilter[] = [
    {
      id: "all",
      name: "All Topics",
      icon: <Settings className="h-3 w-3 md:h-4 md:w-4" />,
      color: "text-white",
    },
    {
      id: "algorithms",
      name: "Algorithms",
      icon: <Code className="h-3 w-3 md:h-4 md:w-4" />,
      color: "text-yellow-500",
    },
    {
      id: "database",
      name: "Database",
      icon: <Database className="h-3 w-3 md:h-4 md:w-4" />,
      color: "text-blue-400",
    },
    {
      id: "shell",
      name: "Shell",
      icon: <Terminal className="h-3 w-3 md:h-4 md:w-4" />,
      color: "text-green-400",
    },
    {
      id: "concurrency",
      name: "Concurrency",
      icon: null,
      color: "text-purple-400",
    },
    {
      id: "more",
      name: "»",
      icon: null,
      color: "text-gray-400",
    },
  ];

  const expandedTopicFilters: TopicFilter[] = [
    {
      id: "javascript",
      name: "JavaScript",
      icon: null,
      color: "text-yellow-300",
    },
    { id: "python", name: "Python", icon: null, color: "text-blue-300" },
    { id: "cpp", name: "C++", icon: null, color: "text-purple-300" },
    { id: "golang", name: "Go", icon: null, color: "text-blue-400" },
    { id: "rust", name: "Rust", icon: null, color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <main className="container py-4 md:py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <SubmissionHeatmap />
            <div>
              {selectedCategory && (
                <div className="mb-2 text-sm text-gray-400">
                  Showing problems for category:{" "}
                  <span className="text-white font-medium">
                    {selectedCategory}
                  </span>
                  <button
                    className="ml-2 text-blue-400 hover:text-blue-300"
                    onClick={() => setSelectedCategory(null)}
                  >
                    (Clear filter)
                  </button>
                </div>
              )}
              <CategoryList />
            </div>
            <TopicFilters
              filters={topicFilters}
              expandedFilters={expandedTopicFilters}
            />
            <div className="space-y-1">
              <ProblemsTable />
            </div>
          </div>
          <Calendar />
        </div>
      </main>
    </div>
  );
}
