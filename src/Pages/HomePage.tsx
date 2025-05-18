// Home.tsx
import { useState } from "react";
import { Code, Database, Settings, Terminal } from "lucide-react";

import type { ReactNode } from "react";
import CategoryList from "@/components/CategoryList";
import { TopicFilters } from "@/components/TopicFilters";
import SubmissionHeatmap from "@/components/SubmissionHeatmap";
import { Calendar } from "@/components/Calendar";
import { ProblemsTable } from "@/components/ProblemTable";

// Type definitions
interface Category {
  name: string;
  count: number | string;
  isExpandable?: boolean;
}

interface TopicFilter {
  id: string;
  name: string;
  icon: ReactNode;
  color: string;
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories: Category[] = [
    { name: "Array", count: 1902 },
    { name: "String", count: 787 },
    { name: "Hash Table", count: 691 },
    { name: "Dynamic Programming", count: 582 },
    { name: "Math", count: 575 },
    { name: "Sorting", count: 448 },
    { name: "Greedy", count: "Expand", isExpandable: true },
  ];

  const expandedCategories: Category[] = [
    { name: "Binary Search", count: 389 },
    { name: "Tree", count: 372 },
    { name: "Depth-First Search", count: 341 },
    { name: "Breadth-First Search", count: 237 },
    { name: "Graph", count: 212 },
    { name: "Stack", count: 187 },
    { name: "Backtracking", count: 165 },
    { name: "Design", count: 154 },
    { name: "Bit Manipulation", count: 147 },
  ];

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

  const handleCategorySelect = (category: string | null) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  // const filteredProblems: ProblemsTableProps = allProblems.map((problem) => ({
  //   id: problem.id,
  //   title: problem.title,
  //   difficulty:
  //     problem.difficulty === "Easy" || problem.difficulty === "Medium" || problem.difficulty === "Hard"
  //       ? problem.difficulty
  //       : "Easy",
  //   isSolved: !!problem.isSolved,
  //   progress: typeof problem.progress === "number" ? problem.progress : 0,
  //   icon: problem.icon,
  // }))

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <main className="container py-4 md:py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <SubmissionHeatmap/>
              <FeaturedCard
                title="LeetCode's Interview Crash Course:"
                description="System Design for Interviews and Beyond"
                color="green"
                buttonText="Start Learning"
              />
              <FeaturedCard
                title="LeetCode's Interview Crash Course:"
                description="Data Structures and Algorithms"
                color="purple"
                buttonText="Start Learning"
              />
              <FeaturedCard
                title="New & Trending Company Qs"
                description="Latest Qs From Big Tech"
                color="yellow"
                buttonText="Claim Now"
                badge="Vol. 1"
              />
            </div> */}
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
              <CategoryList
                categories={categories}
                expandedCategories={expandedCategories}
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
            </div>

            <TopicFilters
              filters={topicFilters}
              expandedFilters={expandedTopicFilters}
            />

            <div className="space-y-1">
              <ProblemsTable />
            </div>
          </div>

          {/* Right Sidebar Widgets */}

          <Calendar />
        </div>
      </main>
    </div>
  );
}
