import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAllTopicAndCompanyName } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function TrendingCompanies() {
  const navigate = useNavigate();
  const { data: companyName } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const res = await getAllTopicAndCompanyName();
      return res.data;
    },
  });

  const companies = companyName?.data?.uniqueCompanies || [];
  const companyCounts = companyName?.data?.companyCounts || {};

  const handleCategoryClick = (companyName: string) => {
    navigate(`/auth/problem-list/${companyName}`);
  };

  return (
    <Card className="bg-[#1e232c] border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Trending Companies</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {companies.map((company: string) => (
            <Badge
              key={company}
              variant="secondary"
              className="bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer justify-between p-2"
              onClick={() => handleCategoryClick(company)}
            >
              <span>{company}</span>
              <span className="bg-gray-600 text-xs px-1 rounded">
                {companyCounts[company] ?? 0}
              </span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
