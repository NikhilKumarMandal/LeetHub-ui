import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Category {
  name: string;
  count: string | number;
  isExpandable?: boolean;
}

interface CategoryListProps {
  categories: Category[];
  expandedCategories: Category[];
  onCategorySelect: (category: string) => void;
  selectedCategory: string | null;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  expandedCategories,
  onCategorySelect,
  selectedCategory,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleCategoryClick = (categoryName: string) => {
    onCategorySelect(categoryName);
  };

  return (
    <div className="flex flex-col">
      <div className="flex overflow-x-auto scrollbar-hide py-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:gap-4">
        {isExpanded ? (
          <>
            {categories
              .filter((c) => !c.isExpandable)
              .map((category, index) => (
                <button
                  key={`main-${index}`}
                  className={`flex items-center gap-2 whitespace-nowrap mr-4 md:mr-0 px-2 py-1 rounded-md transition-colors ${
                    selectedCategory === category.name
                      ? "bg-[#3a3a3a]"
                      : "hover:bg-[#2d2d2d]"
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <span className="text-white text-sm md:text-base">{category.name}</span>
                  <Badge variant="outline" className="text-gray-400 border-gray-700 text-xs">
                    {category.count}
                  </Badge>
                </button>
              ))}

            {expandedCategories.map((category, index) => (
              <button
                key={`expanded-${index}`}
                className={`flex items-center gap-2 whitespace-nowrap mr-4 md:mr-0 px-2 py-1 rounded-md transition-colors ${
                  selectedCategory === category.name
                    ? "bg-[#3a3a3a]"
                    : "hover:bg-[#2d2d2d]"
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <span className="text-white text-sm md:text-base">{category.name}</span>
                <Badge variant="outline" className="text-gray-400 border-gray-700 text-xs">
                  {category.count}
                </Badge>
              </button>
            ))}

            <button
              onClick={toggleExpand}
              className="flex items-center gap-2 whitespace-nowrap mr-4 md:mr-0 px-2 py-1 rounded-md hover:bg-[#2d2d2d] transition-colors"
            >
              <span className="text-white text-sm md:text-base">Collapse</span>
              <ChevronUp className="h-4 w-4 ml-1 text-gray-400" />
            </button>
          </>
        ) : (
          <>
            {categories.map((category, index) => (
              <button
                key={`collapsed-${index}`}
                className={`flex items-center gap-2 whitespace-nowrap mr-4 md:mr-0 px-2 py-1 rounded-md transition-colors ${
                  selectedCategory === category.name && !category.isExpandable
                    ? "bg-[#3a3a3a]"
                    : "hover:bg-[#2d2d2d]"
                }`}
                onClick={() =>
                  category.isExpandable
                    ? toggleExpand()
                    : handleCategoryClick(category.name)
                }
              >
                <span className="text-white text-sm md:text-base">{category.name}</span>
                {category.isExpandable ? (
                  <div className="flex items-center text-gray-400">
                    <Badge
                      variant="outline"
                      className="text-gray-400 border-gray-700 text-xs mr-1"
                    >
                      {category.count}
                    </Badge>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                ) : (
                  <Badge variant="outline" className="text-gray-400 border-gray-700 text-xs">
                    {category.count}
                  </Badge>
                )}
              </button>
            ))}
          </>
        )}
      </div>

      {(categories.length + (isExpanded ? expandedCategories.length : 0)) > 6 && (
        <button
          onClick={toggleExpand}
          className="md:hidden mt-2 text-xs text-gray-400 hover:text-white flex items-center justify-center"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="ml-1 h-3 w-3" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-1 h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CategoryList;
