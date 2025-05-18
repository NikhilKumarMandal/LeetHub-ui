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

  const allProblems = [
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
      id: "21",
      title: "21. Merge Two Sorted Lists",
      difficulty: "Easy",
      isSolved: true,
      progress: 85,
      categories: ["Linked List", "Recursion"],
    },
    {
      id: "23",
      title: "23. Merge k Sorted Lists",
      difficulty: "Hard",
      progress: 35,
      categories: [
        "Linked List",
        "Divide and Conquer",
        "Heap (Priority Queue)",
      ],
    },
    {
      id: "33",
      title: "33. Search in Rotated Sorted Array",
      difficulty: "Medium",
      progress: 70,
      categories: ["Array", "Binary Search"],
    },
    {
      id: "42",
      title: "42. Trapping Rain Water",
      difficulty: "Hard",
      progress: 30,
      categories: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    },
    {
      id: "49",
      title: "49. Group Anagrams",
      difficulty: "Medium",
      progress: 75,
      categories: ["Hash Table", "String", "Sorting"],
    },
    {
      id: "53",
      title: "53. Maximum Subarray",
      difficulty: "Medium",
      isSolved: true,
      progress: 80,
      categories: ["Array", "Divide and Conquer", "Dynamic Programming"],
    },
    {
      id: "70",
      title: "70. Climbing Stairs",
      difficulty: "Easy",
      isSolved: true,
      progress: 95,
      categories: ["Math", "Dynamic Programming", "Memoization"],
    },
    {
      id: "76",
      title: "76. Minimum Window Substring",
      difficulty: "Hard",
      progress: 25,
      categories: ["Hash Table", "String", "Sliding Window"],
    },
    {
      id: "98",
      title: "98. Validate Binary Search Tree",
      difficulty: "Medium",
      progress: 60,
      categories: [
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Binary Tree",
      ],
    },
    {
      id: "101",
      title: "101. Symmetric Tree",
      difficulty: "Easy",
      isSolved: true,
      progress: 90,
      categories: [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree",
      ],
    },
    {
      id: "121",
      title: "121. Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      isSolved: true,
      progress: 85,
      categories: ["Array", "Dynamic Programming"],
    },
    {
      id: "141",
      title: "141. Linked List Cycle",
      difficulty: "Easy",
      isSolved: true,
      progress: 80,
      categories: ["Hash Table", "Linked List", "Two Pointers"],
    },
    {
      id: "146",
      title: "146. LRU Cache",
      difficulty: "Medium",
      progress: 50,
      categories: ["Hash Table", "Linked List", "Design"],
    },
    {
      id: "200",
      title: "200. Number of Islands",
      difficulty: "Medium",
      progress: 70,
      categories: [
        "Array",
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Matrix",
      ],
    },
    {
      id: "206",
      title: "206. Reverse Linked List",
      difficulty: "Easy",
      isSolved: true,
      progress: 95,
      categories: ["Linked List", "Recursion"],
    },
    {
      id: "217",
      title: "217. Contains Duplicate",
      difficulty: "Easy",
      isSolved: true,
      progress: 100,
      categories: ["Array", "Hash Table", "Sorting"],
    },
    {
      id: "238",
      title: "238. Product of Array Except Self",
      difficulty: "Medium",
      progress: 65,
      categories: ["Array", "Prefix Sum"],
    },
    {
      id: "242",
      title: "242. Valid Anagram",
      difficulty: "Easy",
      isSolved: true,
      progress: 90,
      categories: ["Hash Table", "String", "Sorting"],
    },
    {
      id: "297",
      title: "297. Serialize and Deserialize Binary Tree",
      difficulty: "Hard",
      progress: 40,
      categories: [
        "String",
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Design",
        "Binary Tree",
      ],
    },
    {
      id: "300",
      title: "300. Longest Increasing Subsequence",
      difficulty: "Medium",
      progress: 55,
      categories: ["Array", "Binary Search", "Dynamic Programming"],
    },
    {
      id: "322",
      title: "322. Coin Change",
      difficulty: "Medium",
      progress: 60,
      categories: ["Array", "Dynamic Programming", "Breadth-First Search"],
    },
    {
      id: "347",
      title: "347. Top K Frequent Elements",
      difficulty: "Medium",
      progress: 75,
      categories: [
        "Array",
        "Hash Table",
        "Divide and Conquer",
        "Sorting",
        "Heap (Priority Queue)",
        "Bucket Sort",
        "Counting",
        "Quickselect",
      ],
    },
    {
      id: "424",
      title: "424. Longest Repeating Character Replacement",
      difficulty: "Medium",
      progress: 50,
      categories: ["Hash Table", "String", "Sliding Window"],
    },
    {
      id: "572",
      title: "572. Subtree of Another Tree",
      difficulty: "Easy",
      isSolved: true,
      progress: 85,
      categories: [
        "Tree",
        "Depth-First Search",
        "String Matching",
        "Binary Tree",
        "Hash Function",
      ],
    },
    {
      id: "704",
      title: "704. Binary Search",
      difficulty: "Easy",
      isSolved: true,
      progress: 100,
      categories: ["Array", "Binary Search"],
    },
    {
      id: "733",
      title: "733. Flood Fill",
      difficulty: "Easy",
      isSolved: true,
      progress: 90,
      categories: [
        "Array",
        "Depth-First Search",
        "Breadth-First Search",
        "Matrix",
      ],
    },
    {
      id: "838",
      title: "838. Push Dominoes",
      difficulty: "Medium",
      progress: 60,
      categories: ["Array", "Two Pointers", "String", "Dynamic Programming"],
      icon: <Database className="h-2 w-2 md:h-3 md:w-3 text-blue-400" />,
    },
    {
      id: "981",
      title: "981. Time Based Key-Value Store",
      difficulty: "Medium",
      progress: 55,
      categories: ["Hash Table", "String", "Binary Search", "Design"],
    },
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
