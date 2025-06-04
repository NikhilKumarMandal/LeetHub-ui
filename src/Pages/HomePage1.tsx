import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlaylistCards from "@/components/PlaylistCard";
import { Calendar } from "@/components/ui/calendar";
import { ProblemsTable } from "@/components/ProblemTable";
import CategoryList from "@/components/CategoryList";
import Topbar from "@/components/Topbar";

export default function HomePage1() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-800">
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
