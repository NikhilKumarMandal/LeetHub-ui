import { BoxRevealDemo } from "@/components/BoxRevealDemo"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

function HeroSections() {
  return (
        <section className="w-full min-h-screen flex items-center overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[40%] -right-[60%] h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute -bottom-[40%] -left-[60%] h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl"></div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 w-fit">
              Launch Promo: 20% Off Pro Plan
            </div>
            {/* <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Master Coding Challenges. Land Your Dream Job.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Practice with 2000+ coding challenges, ace technical interviews, and track your progress with detailed
                analytics.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild className="shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30">
                <Link to="/signup">Start Coding Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="group">
                <Link to="#how-it-works">
                  How It Works
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                <span>2000+ Problems</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                <span>15+ Languages</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                <span>Weekly Contests</span>
              </div>
            </div> */}
            <BoxRevealDemo/>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-lg border bg-background p-2 shadow-xl transition-all hover:shadow-2xl">
              <div className="flex items-center border-b px-3 py-2 bg-muted/50">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="mx-auto text-sm font-medium">Two Sum Problem</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-2">
                <div className="space-y-2 p-4">
                  <div className="text-sm font-medium">Problem:</div>
                  <div className="text-xs text-muted-foreground">
                    Given an array of integers nums and an integer target, return indices of the two numbers such that
                    they add up to target.
                  </div>
                  <div className="mt-4 text-sm font-medium">Example:</div>
                  <div className="rounded-md bg-muted p-2 text-xs">
                    <div>Input: nums = [2,7,11,15], target = 9</div>
                    <div>Output: [0,1]</div>
                  </div>
                </div>
                <div className="space-y-2 rounded-md bg-muted/50 p-4">
                  <div className="text-sm font-medium">Solution:</div>
                  <pre className="text-xs overflow-auto">
                    <code className="text-green-500">
                      {`function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSections