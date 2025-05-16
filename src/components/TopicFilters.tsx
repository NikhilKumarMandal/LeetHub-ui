import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TopicFilter {
  id: string;
  name: string;
  icon?: ReactNode;
  color: string;
}

interface TopicFiltersProps {
  filters: TopicFilter[];
  expandedFilters: TopicFilter[];
}

export function TopicFilters({ filters, expandedFilters }: TopicFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<string>(
    filters[0]?.id || ""
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleFilterClick = (filterId: string) => {
    if (filterId === "all" || filterId === "more") {
      setIsExpanded(!isExpanded);
    }
    setActiveFilter(filterId);
  };

  const displayFilters = isExpanded
    ? [...filters.filter((f) => f.id !== "more"), ...expandedFilters]
    : filters.filter((f) => f.id !== "more" || !isExpanded);

  return (
    <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:gap-2">
      {displayFilters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const isAllTopics = filter.id === "all";
        const isMoreButton = filter.id === "more";

        const bgColor = isActive
          ? "bg-white/5"
          : filter.color.includes("bg-")
            ? filter.color
            : `bg-[#2d2d2d] ${filter.color}`;

        return (
          <Button
            key={filter.id}
            variant="outline"
            className={`${bgColor} border-gray-700 hover:bg-[#3a3a3a] rounded-full text-xs md:text-sm whitespace-nowrap mr-2 md:mr-0`}
            onClick={() => handleFilterClick(filter.id)}
          >
            {filter.icon && <span className="mr-2">{filter.icon}</span>}
            {filter.name}
            {isAllTopics && (
              <span className="ml-1">
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </span>
            )}
          </Button>
        );
      })}

      {isExpanded && (
        <Button
          variant="outline"
          className="bg-[#2d2d2d] text-gray-400 border-gray-700 hover:bg-[#3a3a3a] rounded-full text-xs md:text-sm whitespace-nowrap mr-2 md:mr-0"
          onClick={() => setIsExpanded(false)}
        >
          Collapse <ChevronUp className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
