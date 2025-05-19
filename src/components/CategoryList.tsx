import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllTopicAndCompanyName } from "@/http/api";

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const res = await getAllTopicAndCompanyName();
      return res.data;
    },
  });

  if (!data?.data?.topicCounts || !data?.data?.uniqueTopics) return null;

  const topicCounts = data.data.topicCounts;
  const categories = data.data.uniqueTopics;
  const visibleCategories = isExpanded ? categories : categories.slice(0, 6);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleCategoryClick = (topic: string) => {
    setSelectedCategory(topic);
    navigate(`/auth/list-problems/${topic}`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex overflow-x-auto scrollbar-hide py-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:gap-4">
        {visibleCategories.map((topic: string, index: number) => (
          <button
            key={index}
            className={`flex items-center gap-2 whitespace-nowrap mr-4 md:mr-0 px-2 py-1 rounded-md transition-colors ${
              selectedCategory === topic ? "bg-[#3a3a3a]" : "hover:bg-[#2d2d2d]"
            }`}
            onClick={() => handleCategoryClick(topic)}
          >
            <span className="text-white text-sm md:text-base">{topic}</span>
            <Badge
              variant="outline"
              className="text-gray-400 border-gray-700 text-xs"
            >
              {topicCounts[topic]}
            </Badge>
          </button>
        ))}

        {categories.length > 6 && (
          <button
            onClick={toggleExpand}
            className="flex items-center gap-2 whitespace-nowrap mr-4 md:mr-0 px-2 py-1 rounded-md hover:bg-[#2d2d2d] transition-colors"
          >
            <span className="text-white text-sm md:text-base">
              {isExpanded ? "Collapse" : "Show More"}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 ml-1 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
