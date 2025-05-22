import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Code,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPlaylist } from "@/http/api";
import { useNavigate } from "react-router-dom";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["playlistData"],
    queryFn: () => {
      return fetchAllPlaylist().then((res) => res.data);
    },
  });

  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.querySelector("div")?.offsetWidth || 300;
      scrollContainerRef.current.scrollBy({
        left: -cardWidth - 24,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.querySelector("div")?.offsetWidth || 300;
      scrollContainerRef.current.scrollBy({
        left: cardWidth + 24,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-4 no-scrollbar scroll-smooth"
      >
        {data?.data?.map((playlist: any, index: any) => {
          const colorIndex = index % colorSchemes.length;
          const colors = colorSchemes[colorIndex];

          return (
            <div key={playlist.id} className="w-[300px] flex-shrink-0">
              <Card
                className={`h-[320px] relative overflow-hidden border-2 ${colors.border} shadow-lg transition-all duration-300`}
                onMouseEnter={() => setHoveredCard(playlist.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`absolute inset-0 ${colors.pattern} ${colors.gradient} opacity-90`}
                />

                <div className="relative p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`text-2xl ${colors.icon}`}>
                      {index % 2 === 0 ? (
                        <Code size={28} />
                      ) : (
                        <Sparkles size={28} />
                      )}
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-primary">
                      Playlist {index}
                    </div>
                  </div>

                  <h3 className={`text-xl font-bold mb-3 ${colors.text}`}>
                    {playlist.name}
                  </h3>

                  <p
                    className={`${colors.text} text-opacity-90 text-sm mb-6 flex-grow`}
                  >
                    {truncateDescription(playlist.description, 100)}
                  </p>

                  <Button
                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                    className={`w-full mt-auto text-black group font-medium transition-all duration-300 flex items-center justify-center`}
                  >
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 hidden sm:block">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-gray-800/50 border-gray-700 hover:bg-gray-700"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-5 w-5 text-gray-300" />
        </Button>
      </div>
      <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 hidden sm:block">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-gray-800/50 border-gray-700 hover:bg-gray-700"
          onClick={scrollRight}
        >
          <ChevronRight className="h-5 w-5 text-gray-300" />
        </Button>
      </div>
    </div>
  );
}
