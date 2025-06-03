import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Search } from "lucide-react";

import PlaylistCards from "@/components/PlaylistCard";
import { Link } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { ProblemsTable } from "@/components/ProblemTable";
import CategoryList from "@/components/CategoryList";
import Topbar from "@/components/Topbar";

export default function HomePage1() {
  return (
    <div className="min-h-screen bg-gradient-to-b bg-[#1a1a1a]">
      <Topbar />
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Featured Playlists */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  Featured Playlists
                </h2>
                <PlaylistCards />
              </div>

              {/* Problem List */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h2 className="text-xl font-bold text-white">Problems</h2>
                  <Tabs defaultValue="all" className="w-auto">
                    <TabsList className="bg-gray-800 border-gray-700">
                      <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                      >
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        value="algorithms"
                        className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                      >
                        Algorithms
                      </TabsTrigger>
                      <TabsTrigger
                        value="database"
                        className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                      >
                        Database
                      </TabsTrigger>
                      <TabsTrigger
                        value="shell"
                        className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                      >
                        Shell
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <CategoryList />
                </div>
                <ProblemsTable />
              </div>
            </div>

            {/* Sidebar - Calendar */}
            <div className="space-y-6">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white">Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample data
const topicTags = [
  "array",
  "string",
  "hash-table",
  "dynamic-programming",
  "math",
  "sorting",
  "greedy",
  "depth-first-search",
  "binary-search",
  "tree",
];

const problems = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["array", "hash-table"],
    acceptance: 48,
    solutions: 24356,
    status: "solved",
  },
  {
    id: "2",
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["linked-list", "math", "recursion"],
    acceptance: 39,
    solutions: 18245,
    status: "attempted",
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["hash-table", "string", "sliding-window"],
    acceptance: 33,
    solutions: 15789,
    status: null,
  },
  {
    id: "4",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["array", "binary-search", "divide-and-conquer"],
    acceptance: 35,
    solutions: 12567,
    status: null,
  },
  {
    id: "5",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    tags: ["string", "dynamic-programming"],
    acceptance: 31,
    solutions: 14532,
    status: "solved",
  },
  {
    id: "6",
    title: "ZigZag Conversion",
    difficulty: "Medium",
    tags: ["string"],
    acceptance: 41,
    solutions: 9876,
    status: null,
  },
  {
    id: "7",
    title: "Reverse Integer",
    difficulty: "Medium",
    tags: ["math"],
    acceptance: 26,
    solutions: 13245,
    status: null,
  },
  {
    id: "8",
    title: "String to Integer (atoi)",
    difficulty: "Medium",
    tags: ["string", "math"],
    acceptance: 16,
    solutions: 8765,
    status: null,
  },
  {
    id: "9",
    title: "Palindrome Number",
    difficulty: "Easy",
    tags: ["math"],
    acceptance: 52,
    solutions: 16789,
    status: "solved",
  },
  {
    id: "10",
    title: "Regular Expression Matching",
    difficulty: "Hard",
    tags: ["string", "dynamic-programming", "recursion"],
    acceptance: 28,
    solutions: 7654,
    status: null,
  },
];
