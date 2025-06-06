import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PlaylistCards from "@/components/PlaylistCard";
import { Calendar } from "@/components/ui/calendar";
import { ProblemsTable } from "@/components/ProblemTable";
import CategoryList from "@/components/CategoryList";
import Topbar from "@/components/Topbar";

export default function HomePage1() {
  return (
    <div className="min-h-screen bg-[#1e232c]">
      <Topbar />
      <div className="container mx-auto px-4">
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  Featured Playlists
                </h2>
                <PlaylistCards />
              </div>

              <div>
                <div>
                  <CategoryList />
                </div>
                <ProblemsTable />
              </div>
            </div>

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
