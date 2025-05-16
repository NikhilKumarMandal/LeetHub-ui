import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";

export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isSolved?: boolean;
  progress: number;
  categories: string[];
  icon?: React.ReactNode;
}

interface ProblemsTableProps {
  problems: Problem[];
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

export function ProblemsTable({
  problems,
  selectedCategory,
  onCategorySelect,
}: ProblemsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const pageSize = 10;

  // Filter problems based on search query, difficulty, status, and category
  const filteredProblems = problems.filter((problem) => {
    // Search filter
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Difficulty filter
    const matchesDifficulty =
      difficultyFilter === "all" || problem.difficulty === difficultyFilter;

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "solved" && problem.isSolved) ||
      (statusFilter === "unsolved" && !problem.isSolved);

    // Category filter (already handled by the parent component)

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  // Sort problems
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === "id") {
      return sortOrder === "asc"
        ? Number.parseInt(a.id) - Number.parseInt(b.id)
        : Number.parseInt(b.id) - Number.parseInt(a.id);
    } else if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === "difficulty") {
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
      return sortOrder === "asc"
        ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
    }
    return 0;
  });

  // Paginate problems
  const totalPages = Math.ceil(sortedProblems.length / pageSize);
  const paginatedProblems = sortedProblems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle sort toggle
  const handleSortToggle = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Get sort indicator
  const getSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, start + maxVisiblePages - 3);

      // Adjust start if end is too close to totalPages
      start = Math.max(2, end - (maxVisiblePages - 3));

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Hard":
        return "text-red-500";
      default:
        return "";
    }
  };

  // Get progress color
  const getProgressColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Hard":
        return "bg-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search problems..."
            className="pl-9 bg-[#2d2d2d] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[130px] bg-[#2d2d2d] border-gray-700 text-white focus:ring-gray-500">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-[#2d2d2d] border-gray-700 text-white">
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-[#2d2d2d] border-gray-700 text-white focus:ring-gray-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#2d2d2d] border-gray-700 text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="unsolved">Unsolved</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="bg-[#2d2d2d] border-gray-700 text-gray-400 hover:bg-[#3a3a3a] h-9 w-9 md:h-10 md:w-10"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Selected Category Indicator */}
      {selectedCategory && (
        <div className="text-sm text-gray-400">
          Showing problems for category:{" "}
          <span className="text-white font-medium">{selectedCategory}</span>
          <button
            className="ml-2 text-blue-400 hover:text-blue-300"
            onClick={() => onCategorySelect(selectedCategory)}
          >
            (Clear filter)
          </button>
        </div>
      )}

      {/* Problems Table */}
      <div className="rounded-md border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#2d2d2d]">
            <TableRow className="hover:bg-[#3a3a3a] border-gray-700">
              <TableHead className="w-[50px] text-gray-300">
                <button
                  className="flex items-center"
                  onClick={() => handleSortToggle("id")}
                >
                  # {getSortIndicator("id")}
                </button>
              </TableHead>
              <TableHead className="text-gray-300">
                <button
                  className="flex items-center"
                  onClick={() => handleSortToggle("title")}
                >
                  Title {getSortIndicator("title")}
                </button>
              </TableHead>
              <TableHead className="text-gray-300 hidden md:table-cell">
                <button
                  className="flex items-center"
                  onClick={() => handleSortToggle("difficulty")}
                >
                  Difficulty {getSortIndicator("difficulty")}
                </button>
              </TableHead>
              <TableHead className="text-gray-300 hidden md:table-cell">
                Categories
              </TableHead>
              <TableHead className="text-gray-300 w-[100px] hidden lg:table-cell">
                Progress
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => (
                <TableRow
                  key={problem.id}
                  className="hover:bg-[#2d2d2d] border-gray-700 cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <div className="w-6 md:w-8 text-center">
                      <div
                        className={`h-4 w-4 md:h-5 md:w-5 rounded-full bg-[#2d2d2d] border ${
                          problem.isSolved
                            ? "border-green-500"
                            : "border-gray-700"
                        } flex items-center justify-center mx-auto`}
                      >
                        {problem.isSolved ? (
                          <Check className="h-2 w-2 md:h-3 md:w-3 text-green-500" />
                        ) : problem.icon ? (
                          problem.icon
                        ) : (
                          <span className="text-[10px] md:text-xs text-gray-400">
                            {problem.id}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {problem.title}
                  </TableCell>
                  <TableCell
                    className={`${getDifficultyColor(problem.difficulty)} hidden md:table-cell`}
                  >
                    {problem.difficulty}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {problem.categories.slice(0, 2).map((category, index) => (
                        <Badge
                          key={index}
                          className="bg-[#3a3a3a] hover:bg-[#4a4a4a] text-gray-300 cursor-pointer"
                          onClick={() => onCategorySelect(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                      {problem.categories.length > 2 && (
                        <Badge className="bg-[#3a3a3a] text-gray-300">
                          +{problem.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="w-full h-2 md:h-2.5 bg-[#2d2d2d] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(problem.difficulty)}`}
                        style={{ width: `${problem.progress}%` }}
                      ></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-400"
                >
                  <p>No problems found matching your criteria.</p>
                  {(searchQuery ||
                    difficultyFilter !== "all" ||
                    statusFilter !== "all" ||
                    selectedCategory) && (
                    <button
                      className="mt-2 text-blue-400 hover:text-blue-300"
                      onClick={() => {
                        setSearchQuery("");
                        setDifficultyFilter("all");
                        setStatusFilter("all");
                        if (selectedCategory)
                          onCategorySelect(selectedCategory);
                      }}
                    >
                      Clear all filters
                    </button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, filteredProblems.length)} of{" "}
            {filteredProblems.length}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-[#2d2d2d] border-gray-700 text-gray-400 hover:bg-[#3a3a3a]"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className={
                  page === currentPage
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white border-none h-8 w-8 p-0"
                    : "bg-[#2d2d2d] border-gray-700 text-gray-400 hover:bg-[#3a3a3a] h-8 w-8 p-0"
                }
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={typeof page !== "number"}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-[#2d2d2d] border-gray-700 text-gray-400 hover:bg-[#3a3a3a]"
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
