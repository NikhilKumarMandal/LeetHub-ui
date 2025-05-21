import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Sparkles } from "lucide-react";

const playlistData = [
  {
    id: 1,
    title: "Array Manipulation Techniques",
    description:
      "Master essential array manipulation techniques used in technical interviews. Learn in-place algorithms, two-pointer approaches, sliding window, and more advanced patterns that appear frequently in coding challenges.",
  },
  {
    id: 2,
    title: "Dynamic Programming Fundamentals",
    description:
      "Build a strong foundation in dynamic programming from basic to advanced concepts. This playlist covers memoization, tabulation, and common DP patterns with step-by-step explanations.",
  },
  {
    id: 3,
    title: "Graph Algorithms & Traversals",
    description:
      "Comprehensive guide to graph algorithms including DFS, BFS, Dijkstra's, and more complex network flow problems. Perfect for interview preparation and competitive programming.",
  },
  {
    id: 4,
    title: "Binary Tree & BST Problems",
    description:
      "Tackle the most common binary tree and binary search tree problems. Learn traversal techniques, construction algorithms, and validation approaches used in technical interviews.",
  },
  {
    id: 5,
    title: "String Manipulation Challenges",
    description:
      "Master string algorithms including pattern matching, substring problems, and text processing techniques. Essential for technical interviews at top tech companies.",
  },
  {
    id: 6,
    title: "System Design Interview Prep",
    description:
      "Prepare for system design interviews with real-world architecture problems. Learn how to design scalable systems, handle trade-offs, and communicate your thought process effectively.",
  },
  {
    id: 7,
    title: "Greedy Algorithms",
    description:
      "Explore the world of greedy algorithms and learn when and how to apply this powerful technique to solve optimization problems efficiently.",
  },
  {
    id: 8,
    title: "Backtracking Masterclass",
    description:
      "Deep dive into backtracking algorithms for solving complex combinatorial problems. Learn how to efficiently explore solution spaces and prune search trees.",
  },
];

// Color schemes for cards - more vibrant and professional
const colorSchemes = [
  {
    gradient: "from-purple-500 to-indigo-600",
    pattern:
      "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]",
    text: "text-white",
    border: "border-purple-400",
    button: "bg-white text-purple-700 hover:bg-purple-50",
    icon: "text-purple-200",
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    pattern:
      "bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))]",
    text: "text-white",
    border: "border-emerald-400",
    button: "bg-white text-emerald-700 hover:bg-emerald-50",
    icon: "text-emerald-200",
  },
  {
    gradient: "from-rose-500 to-pink-600",
    pattern:
      "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]",
    text: "text-white",
    border: "border-rose-400",
    button: "bg-white text-rose-700 hover:bg-rose-50",
    icon: "text-rose-200",
  },
  {
    gradient: "from-amber-500 to-orange-600",
    pattern:
      "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]",
    text: "text-white",
    border: "border-amber-400",
    button: "bg-white text-amber-700 hover:bg-amber-50",
    icon: "text-amber-200",
  },
  {
    gradient: "from-blue-500 to-cyan-600",
    pattern:
      "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]",
    text: "text-white",
    border: "border-blue-400",
    button: "bg-white text-blue-700 hover:bg-blue-50",
    icon: "text-blue-200",
  },
  {
    gradient: "from-violet-500 to-purple-600",
    pattern: "bg-[linear-gradient(to_right,_var(--tw-gradient-stops))]",
    text: "text-white",
    border: "border-violet-400",
    button: "bg-white text-violet-700 hover:bg-violet-50",
    icon: "text-violet-200",
  },
];

export default function PlaylistCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Function to truncate description
  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {playlistData.map((playlist, index) => {
        const colorIndex = index % colorSchemes.length;
        const colors = colorSchemes[colorIndex];
        const isHovered = hoveredCard === playlist.id;

        return (
          <Card
            key={playlist.id}
            className={`relative overflow-hidden border-2 ${colors.border} shadow-lg transition-all duration-300 ${
              isHovered ? "shadow-xl translate-y-[-4px]" : ""
            }`}
            onMouseEnter={() => setHoveredCard(playlist.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              className={`absolute inset-0 ${colors.pattern} ${colors.gradient} opacity-90`}
            />

            {/* Card content */}
            <div className="relative p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`text-2xl ${colors.icon}`}>
                  {index % 2 === 0 ? (
                    <Code size={28} />
                  ) : (
                    <Sparkles size={28} />
                  )}
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                  Playlist {playlist.id}
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-3 ${colors.text}`}>
                {playlist.title}
              </h3>

              <p
                className={`${colors.text} text-opacity-90 text-sm mb-6 flex-grow`}
              >
                {truncateDescription(playlist.description, 100)}
              </p>

              <Button
                className={`w-full mt-auto ${colors.button} group font-medium transition-all duration-300 flex items-center justify-center`}
              >
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
