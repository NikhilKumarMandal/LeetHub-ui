import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pointer } from "@/components/magicui/pointer";
import { motion } from "motion/react";
export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[40%] -right-[60%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
            Features
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Everything You Need to Excel
            </h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides all the tools and resources you need to
              become a better programmer and ace technical interviews.
            </p>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <div className="grid max-w-5xl w-full gap-6 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            {/* <PointerDemo1 /> */}
            <Card className="col-span-1 row-span-1 overflow-hidden border bg-gradient-to-br from-slate-50 to-slate-100 transition-all dark:from-slate-900 dark:to-slate-800 shadow-none">
              <CardHeader className="relative pb-2">
                <CardTitle className="text-xl font-bold">
                  AExtensive Problem Library
                </CardTitle>
              </CardHeader>
              <CardContent className="relative flex h-40 items-center justify-center p-6">
                <span className="pointer-events-none text-center text-xl font-medium text-slate-800 dark:text-slate-200">
                  Access 2000+ coding challenges across 20+ categories from easy
                  to hard difficulty levels.
                </span>
              </CardContent>
              <Pointer>
                <motion.div
                  animate={{
                    scale: [0.8, 1, 0.8],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-pink-600"
                  >
                    <motion.path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="currentColor"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                </motion.div>
              </Pointer>
            </Card>

            <Card className="col-span-1 row-span-1 overflow-hidden border bg-gradient-to-br from-blue-50 to-blue-100 transition-all dark:from-blue-900 dark:to-blue-800 shadow-none">
              <CardHeader className="relative pb-2">
                <CardTitle className="text-xl font-bold">
                  Interactive Coding Environmen
                </CardTitle>
              </CardHeader>
              <CardContent className="relative flex h-40 items-center justify-center p-6">
                <span className="pointer-events-none text-center text-xl font-medium text-blue-800 dark:text-blue-200">
                  Code in 15+ programming languages with our powerful online IDE
                  with syntax highlighting and auto-completion.
                </span>
              </CardContent>
              <Pointer className="fill-blue-500" />
            </Card>
            <Card className="col-span-1 row-span-1 overflow-hidden border bg-gradient-to-br from-purple-50 to-purple-100 transition-all dark:from-purple-900 dark:to-purple-800 shadow-none">
              <CardHeader className="relative pb-2">
                <CardTitle className="text-xl font-bold">
                  Interview Preparation
                </CardTitle>
              </CardHeader>
              <CardContent className="relative flex h-40 items-center justify-center p-6">
                <span className="pointer-events-none text-center text-xl font-medium text-purple-800 dark:text-purple-200">
                  Prepare for technical interviews with company-specific problem
                  sets and mock interviews.
                </span>
              </CardContent>
              <Pointer>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" className="fill-purple-500" />
                  <circle cx="12" cy="12" r="5" className="fill-white" />
                </svg>
              </Pointer>
            </Card>
            <Card className="col-span-1 row-span-1 overflow-hidden border bg-gradient-to-br from-green-50 to-green-100 transition-all dark:from-green-900 dark:to-green-800 shadow-none">
              <CardHeader className="relative pb-2">
                <CardTitle className="text-xl font-bold">
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="relative flex h-40 items-center justify-center p-6">
                <span className="pointer-events-none text-center text-xl font-medium text-green-800 dark:text-green-200">
                  Prepare for technical interviews with company-specific problem
                  sets and mock interviews.
                </span>
              </CardContent>
              <Pointer>
                <div className="text-2xl">👆</div>
              </Pointer>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
