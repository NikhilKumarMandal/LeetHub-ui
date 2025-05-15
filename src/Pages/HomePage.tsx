// Home.tsx
import { useState } from "react";
import {
  ArrowUpDown,
  Code,
  Database,
  Filter,
  Search,
  Settings,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";


import type { ReactNode } from "react";
import FeaturedCard from "@/components/FeaturedCard";
import CategoryList from "@/components/CategoryList";
import { Input } from "@/components/ui/input";
import { TopicFilters } from "@/components/TopicFilters";
import { ProblemItem, type ProblemItemProps } from "@/components/ProblemItem";
import { Calendar } from "@/components/ui/calendar";



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

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  isSolved?: boolean;
  progress: number;
  categories: string[];
  icon?: ReactNode;
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>("all");
  const [date, setDate] = useState<Date | undefined>(new Date());
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
    { id: "javascript", name: "JavaScript", icon: null, color: "text-yellow-300" },
    { id: "python", name: "Python", icon: null, color: "text-blue-300" },
    { id: "cpp", name: "C++", icon: null, color: "text-purple-300" },
    { id: "golang", name: "Go", icon: null, color: "text-blue-400" },
    { id: "rust", name: "Rust", icon: null, color: "text-orange-400" },
  ];
  

  const allProblems: Problem[] = [
    {
      id: "838",
      title: "838. Push Dominoes",
      difficulty: "Medium",
      progress: 60,
      categories: ["Array", "Two Pointers", "String", "Dynamic Programming"],
      icon: <Database className="h-2 w-2 md:h-3 md:w-3 text-blue-400" />,
    },
    {
      id: "1",
      title: "1. Two Sum",
      difficulty: "Easy",
      isSolved: true,
      progress: 80,
      categories: ["Array", "Hash Table"],
    },
    {
      id: "2",
      title: "2. Add Two Numbers",
      difficulty: "Medium",
      isSolved: true,
      progress: 60,
      categories: ["Linked List", "Math", "Recursion"],
    },
    {
      id: "3",
      title: "3. Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      progress: 60,
      categories: ["Hash Table", "String", "Sliding Window"],
    },
    {
      id: "4",
      title: "4. Median of Two Sorted Arrays",
      difficulty: "Hard",
      progress: 40,
      categories: ["Array", "Binary Search", "Divide and Conquer"],
    },
    {
      id: "5",
      title: "5. Longest Palindromic Substring",
      difficulty: "Medium",
      progress: 55,
      categories: ["String", "Dynamic Programming"],
    },
    {
      id: "15",
      title: "15. 3Sum",
      difficulty: "Medium",
      progress: 65,
      categories: ["Array", "Two Pointers", "Sorting"],
    },
    {
      id: "20",
      title: "20. Valid Parentheses",
      difficulty: "Easy",
      isSolved: true,
      progress: 90,
      categories: ["String", "Stack"],
    },
    {
      id: "23",
      title: "23. Merge k Sorted Lists",
      difficulty: "Hard",
      progress: 35,
      categories: ["Linked List", "Divide and Conquer", "Heap (Priority Queue)"],
    },
    {
      id: "42",
      title: "42. Trapping Rain Water",
      difficulty: "Hard",
      progress: 30,
      categories: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    },
  ];

  const handleCategorySelect = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };
  

  const filteredProblems: ProblemItemProps[] = allProblems.map((problem) => ({
    id: problem.id,
    title: problem.title,
    difficulty:
      problem.difficulty === "Easy" || problem.difficulty === "Medium" || problem.difficulty === "Hard"
        ? problem.difficulty
        : "Easy",
    isSolved: !!problem.isSolved,
    progress: typeof problem.progress === "number" ? problem.progress : 0,
    icon: problem.icon,
  }))
  

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <main className="container py-4 md:py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
            </div>

            <div>
              {selectedCategory && (
                <div className="mb-2 text-sm text-gray-400">
                  Showing problems for category:{" "}
                  <span className="text-white font-medium">{selectedCategory}</span>
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

            <TopicFilters filters={topicFilters} expandedFilters={expandedTopicFilters} />

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search questions"
                  className="pl-9 bg-[#2d2d2d] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-500 text-sm"
                />
              </div>
              <Button variant="outline" size="icon" className="bg-[#2d2d2d] border-gray-700 text-gray-400 hover:bg-[#3a3a3a] h-9 w-9 md:h-10 md:w-10">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-[#2d2d2d] border-gray-700 text-gray-400 hover:bg-[#3a3a3a] h-9 w-9 md:h-10 md:w-10">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              {filteredProblems.map((problem) => (
                <ProblemItem key={problem.id} {...problem} />
              ))}
            </div>
          </div>

          {/* Right Sidebar Widgets */}

          <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}

  />
        </div>
      </main>
    </div>
  );
}

