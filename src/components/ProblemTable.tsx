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
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
} from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { allProblems } from "@/http/api";
import { useState } from "react";
import { LIMIT } from "@/constants";
import type { FilterData, Problem } from "@/Types";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";

export function ProblemsTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({
    limit: LIMIT,
    page: 1,
  });

  const q = searchParams.get("q") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const status = searchParams.get("status") || "";

  const { data } = useQuery({
    queryKey: ["problems", queryParams, q, difficulty, status],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      const filters: FilterData = {
        queryParams: queryString,
        q,
        difficulty,
        status,
      };

      return allProblems(filters).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });
  const totalPages = data?.data?.pagination.totalPages || 1;

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search problems..."
            onChange={debounce((e) => {
              setSearchParams((prev) => {
                prev.set("q", e.target.value);
                return prev;
              });
              setQueryParams((prev) => ({
                ...prev,
                page: 1,
              }));
            }, 1000)}
            className="pl-9 bg-[#2d2d2d] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-500 text-sm"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select
            onValueChange={(value) => {
              setSearchParams((prev) => {
                prev.set("difficulty", value);
                return prev;
              });
              setQueryParams((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <SelectTrigger className="w-[130px] bg-[#2d2d2d] border-gray-700 text-white focus:ring-gray-500">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-[#2d2d2d] border-gray-700 text-white">
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              setSearchParams((prev) => {
                prev.set("status", value);
                return prev;
              });
              setQueryParams((prev) => ({ ...prev, page: 1 }));
            }}
          >
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

      {/* Problems Table */}
      <div className="border border-gray-700 rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-white">#</TableHead>
              <TableHead className="text-white">Title</TableHead>
              <TableHead className="text-white">Difficulty</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Example static row */}
            {data?.data?.problems.map((problem: Problem) => (
              <TableRow>
                <TableCell className="text-gray-300">
                  {problem.problemNumber}
                </TableCell>
                <TableCell className="text-gray-300">{problem.title}</TableCell>
                <TableCell>
                  <span
                    className={
                      problem.difficulty === "EASY"
                        ? "text-green-500 font-medium"
                        : problem.difficulty === "MEDIUM"
                          ? "text-yellow-500 font-medium"
                          : "text-red-500 font-medium"
                    }
                  >
                    {problem.difficulty}
                  </span>
                </TableCell>
                <TableCell>
                  {problem?.isSolved ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </TableCell>
                <TableCell className="text-gray-300">{problem.topic}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
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
  );
}
