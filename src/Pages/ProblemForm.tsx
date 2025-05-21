import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash, Plus, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { createProblem } from "@/http/api";

const problem = async (problemData: any) => {
  const { data } = await createProblem(problemData);
  return data;
};

// // Mock function to fetch existing problem data
// const fetchProblemData = async (id: string) => {
//   // In a real app, this would be an API call
//   // For demo purposes, we'll return the sample data
//   return {
//     title: "Subtract two number",
//     description: "Given two numbers a and b add them up and return the outout",
//     difficulty: "HARD",
//     topic: ["tree"],
//     examples: {
//       PYTHON: {
//         input: "3 7",
//         output: "10",
//         explanation: "Adding 3 and 7 gives 10.",
//       },
//       JAVASCRIPT: {
//         input: "-5 12",
//         output: "7",
//         explanation: "Adding -5 and 12 gives 7.",
//       },
//     },
//     constraints: "-10^9 ≤ a, b ≤ 10^9",
//     testcases: [
//       {
//         input: "100 200",
//         output: "300",
//         isPublic: true,
//       },
//       {
//         input: "-500 -600",
//         output: "-1100",
//         isPublic: false,
//       },
//       {
//         input: "0 0",
//         output: "0",
//         isPublic: true,
//       },
//     ],
//     codeSnippets: {
//       JAVASCRIPT:
//         "const fs = require('fs');\n\nfunction addTwoNumbers(a, b) {\n    // Write your code here\n    // Return the sum of a and b\n    return a + b;\n}\n\n// Reading input from stdin (using fs to read all input)\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\n\nconsole.log(addTwoNumbers(a, b));",
//       PYTHON:
//         "def add_two_numbers(a, b):\n    # Write your code here\n    # Return the sum of a and b\n    return a + b\n\nimport sys\ninput_line = sys.stdin.read()\na, b = map(int, input_line.split())\nprint(add_two_numbers(a, b))",
//       JAVA: "import java.util.Scanner;\n\npublic class Main {\n    public static int addTwoNumbers(int a, int b) {\n        // Write your code here\n        // Return the sum of a and b\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(addTwoNumbers(a, b));\n    }\n}",
//     },
//     referenceSolutions: {
//       JAVASCRIPT:
//         "const fs = require('fs');\n\n// Reading input from stdin (using fs to read all input)\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\n\nconsole.log(a + b);",
//       PYTHON: "import sys\ninput_line = sys.stdin.read()\na, b = map(int, input_line.split())\nprint(a + b)",
//       JAVA: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}",
//     },
//   }
// }

// Common topics for coding problems
const commonTopics = [
  "array",
  "string",
  "hash-table",
  "dynamic-programming",
  "math",
  "sorting",
  "greedy",
  "depth-first-search",
  "binary-search",
  "tree",
  "breadth-first-search",
  "matrix",
  "two-pointers",
  "bit-manipulation",
  "stack",
];

// Zod schema for the form
const languageEnum = z.enum(["JAVASCRIPT", "PYTHON", "JAVA"]);

const exampleSchema = z.object({
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
  explanation: z.string().optional(),
});

const testCaseSchema = z.object({
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
  isPublic: z.boolean().default(false),
});

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  topic: z.array(z.string()).min(1, "At least one topic is required"),
  constraints: z.string().min(1, "Constraints are required"),
  examples: z.record(languageEnum, exampleSchema),
  testcases: z
    .array(testCaseSchema)
    .min(1, "At least one test case is required"),
  codeSnippets: z.record(
    languageEnum,
    z.string().min(1, "Code snippet is required")
  ),
  referenceSolutions: z.record(
    languageEnum,
    z.string().min(1, "Reference solution is required")
  ),
});

type ProblemFormValues = z.infer<typeof problemSchema>;

// Create a wrapper component that uses React Query hooks
export function ProblemForm() {
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});
  const [topicInput, setTopicInput] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Initialize form with empty values
  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "MEDIUM",
      topic: [],
      constraints: "",
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      testcases: [{ input: "", output: "", isPublic: true }],
      codeSnippets: {
        JAVASCRIPT: "console.log('')",
        PYTHON: "print('')",
        JAVA: "System.out.println('');",
      },
      referenceSolutions: {
        JAVASCRIPT: "function solution() {}",
        PYTHON: "def solution(): pass",
        JAVA: "public class Solution {}",
      },
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["problem"],
    mutationFn: problem,
    onSuccess: () => {
      toast.success("Problem updated successfully");
      setJsonErrors({});
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  function onSubmit(data: ProblemFormValues) {
    mutate(data);
  }

  const addTopic = () => {
    if (!topicInput.trim()) return;
    const currentTopics = form.getValues("topic");
    if (!currentTopics.includes(topicInput.trim())) {
      const newTopics = [...currentTopics, topicInput.trim()];
      form.setValue("topic", newTopics);
      setSelectedTopics(newTopics);
      setTopicInput("");
    }
  };

  const removeTopic = (topicToRemove: string) => {
    const currentTopics = form.getValues("topic");
    const newTopics = currentTopics.filter((topic) => topic !== topicToRemove);
    form.setValue("topic", newTopics);
    setSelectedTopics(newTopics);
  };

  const toggleTopic = (topic: string) => {
    const currentTopics = form.getValues("topic");
    if (currentTopics.includes(topic)) {
      const newTopics = currentTopics.filter((t) => t !== topic);
      form.setValue("topic", newTopics);
      setSelectedTopics(newTopics);
    } else {
      const newTopics = [...currentTopics, topic];
      form.setValue("topic", newTopics);
      setSelectedTopics(newTopics);
    }
  };

  const addTestCase = () => {
    const currentTestCases = form.getValues("testcases");
    form.setValue("testcases", [
      ...currentTestCases,
      { input: "", output: "", isPublic: false },
    ]);
  };

  const removeTestCase = (index: number) => {
    const currentTestCases = form.getValues("testcases");
    if (currentTestCases.length > 1) {
      form.setValue(
        "testcases",
        currentTestCases.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Problem</CardTitle>
          <CardDescription>
            Update the details of your coding problem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter problem title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter problem description"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Topics</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Select from common topics or add your own</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* Common topics selection */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {commonTopics.map((topic) => (
                          <Badge
                            key={topic}
                            variant={
                              selectedTopics.includes(topic)
                                ? "default"
                                : "outline"
                            }
                            className={`cursor-pointer ${selectedTopics.includes(topic) ? "bg-primary" : "bg-background hover:bg-gray-100"}`}
                            onClick={() => toggleTopic(topic)}
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      {/* Custom topic input */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a custom topic"
                          value={topicInput}
                          onChange={(e) => setTopicInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTopic();
                            }
                          }}
                        />
                        <Button type="button" onClick={addTopic} size="sm">
                          Add
                        </Button>
                      </div>

                      {/* Selected topics */}
                      {selectedTopics.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">
                            Selected Topics:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedTopics.map((topic) => (
                              <div
                                key={topic}
                                className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full"
                              >
                                <span>{topic}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0 hover:bg-primary-foreground/20"
                                  onClick={() => removeTopic(topic)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="constraints"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Constraints</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Specify the constraints for input values. Use
                                mathematical notation like:
                              </p>
                              <ul className="list-disc pl-4 mt-1">
                                <li>-10^9 ≤ a, b ≤ 10^9</li>
                                <li>1 ≤ n ≤ 10^5</li>
                                <li>0 ≤ arr[i] ≤ 1000</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Enter problem constraints"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Specify the constraints for input values, e.g., "-10^9 ≤
                        a, b ≤ 10^9"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Examples */}
              <div className="space-y-4 bg-black">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Examples</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-black">
                        <p>
                          Provide examples for each supported language. Examples
                          should demonstrate how the problem works.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Tabs defaultValue="JAVASCRIPT">
                  <TabsList className="mb-4">
                    <TabsTrigger value="JAVASCRIPT">JavaScript</TabsTrigger>
                    <TabsTrigger value="PYTHON">Python</TabsTrigger>
                    <TabsTrigger value="JAVA">Java</TabsTrigger>
                  </TabsList>

                  {(["JAVASCRIPT", "PYTHON", "JAVA"] as const).map((lang) => (
                    <TabsContent
                      key={lang}
                      value={lang}
                      className="space-y-4 bg-black"
                    >
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-500 mb-3">
                          Provide an example for {lang} that demonstrates how to
                          solve the problem.
                        </p>

                        <FormField
                          control={form.control}
                          name={`examples.${lang}.input`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Input</FormLabel>
                              <FormControl>
                                <Input placeholder="Example input" {...field} />
                              </FormControl>
                              <FormDescription>
                                The input format that will be provided to the
                                solution
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`examples.${lang}.output`}
                          render={({ field }) => (
                            <FormItem className="mt-3">
                              <FormLabel>Output</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Example output"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                The expected output from the solution
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`examples.${lang}.explanation`}
                          render={({ field }) => (
                            <FormItem className="mt-3">
                              <FormLabel>Explanation</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Explanation of the example"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Explain how the output is derived from the input
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Test Cases */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Test Cases</h3>
                  <Button
                    type="button"
                    onClick={addTestCase}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Test Case
                  </Button>
                </div>

                <Accordion type="multiple" className="w-full">
                  {form.watch("testcases").map((testcase, index) => (
                    <AccordionItem key={index} value={`testcase-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex justify-between items-center w-full pr-4">
                          <div className="flex items-center gap-2">
                            <span>Test Case {index + 1}</span>
                            {testcase.isPublic && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-200"
                              >
                                Public
                              </Badge>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTestCase(index);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <FormField
                          control={form.control}
                          name={`testcases.${index}.input`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Input</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Test case input"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`testcases.${index}.output`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Output</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Expected output"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`testcases.${index}.isPublic`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Public Test Case</FormLabel>
                                <FormDescription>
                                  If checked, this test case will be visible to
                                  users
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Code Snippets */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Code Snippets</h3>
                <Tabs defaultValue="JAVASCRIPT">
                  <TabsList className="mb-4">
                    <TabsTrigger value="JAVASCRIPT">JavaScript</TabsTrigger>
                    <TabsTrigger value="PYTHON">Python</TabsTrigger>
                    <TabsTrigger value="JAVA">Java</TabsTrigger>
                  </TabsList>

                  {(["JAVASCRIPT", "PYTHON", "JAVA"] as const).map((lang) => (
                    <TabsContent key={lang} value={lang}>
                      <FormField
                        control={form.control}
                        name={`codeSnippets.${lang}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code Snippet</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={`Enter ${lang} code snippet`}
                                className="font-mono h-64"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This is the starter code that will be provided to
                              users
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Reference Solutions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Reference Solutions</h3>
                <Tabs defaultValue="JAVASCRIPT">
                  <TabsList className="mb-4">
                    <TabsTrigger value="JAVASCRIPT">JavaScript</TabsTrigger>
                    <TabsTrigger value="PYTHON">Python</TabsTrigger>
                    <TabsTrigger value="JAVA">Java</TabsTrigger>
                  </TabsList>

                  {(["JAVASCRIPT", "PYTHON", "JAVA"] as const).map((lang) => (
                    <TabsContent key={lang} value={lang}>
                      <FormField
                        control={form.control}
                        name={`referenceSolutions.${lang}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reference Solution</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={`Enter ${lang} reference solution`}
                                className="font-mono h-64"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This is the correct solution that will be used for
                              validation
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Updating Problem..." : "Update Problem"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
