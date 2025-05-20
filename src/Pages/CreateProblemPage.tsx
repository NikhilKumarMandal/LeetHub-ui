"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import SimpleEditor from "@/components/SimpleEditor";
import CodeEditor from "@/components/Editor";
import { ArrowLeft, Save, Plus, Trash2, Code, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Available programming languages
const LANGUAGES = [
  { id: "JAVASCRIPT", name: "JavaScript" },
  { id: "PYTHON", name: "Python" },
  { id: "JAVA", name: "Java" },
  { id: "CPP", name: "C++" },
  { id: "CSHARP", name: "C#" },
  { id: "GO", name: "Go" },
  { id: "RUBY", name: "Ruby" },
  { id: "SWIFT", name: "Swift" },
  { id: "KOTLIN", name: "Kotlin" },
  { id: "RUST", name: "Rust" },
];

// Available topics
const TOPICS = [
  "arrays",
  "strings",
  "linked-lists",
  "trees",
  "graphs",
  "dynamic-programming",
  "recursion",
  "sorting",
  "searching",
  "math",
  "bit-manipulation",
];

export default function CreateProblemPage() {
  // Basic info state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [constraints, setConstraints] = useState("");
  const [hints, setHints] = useState("");
  const [editorial, setEditorial] = useState("");

  // Selected languages for this problem
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Examples state (language-specific)
  const [examples, setExamples] = useState<
    Record<string, { input: string; output: string; explanation: string }>
  >({});

  // Test cases state
  const [testcases, setTestcases] = useState<
    Array<{ input: string; output: string; isPublic: boolean }>
  >([{ input: "", output: "", isPublic: true }]);

  // Code snippets state (language-specific)
  const [codeSnippets, setCodeSnippets] = useState<Record<string, string>>({});

  // Reference solutions state (language-specific)
  const [referenceSolutions, setReferenceSolutions] = useState<
    Record<string, string>
  >({});

  // Add a new language to the problem
  const addLanguage = (languageId: string) => {
    if (!selectedLanguages.includes(languageId)) {
      setSelectedLanguages([...selectedLanguages, languageId]);

      // Initialize empty examples, code snippets and reference solutions for this language
      setExamples({
        ...examples,
        [languageId]: { input: "", output: "", explanation: "" },
      });

      setCodeSnippets({
        ...codeSnippets,
        [languageId]: "",
      });

      setReferenceSolutions({
        ...referenceSolutions,
        [languageId]: "",
      });
    }
  };

  // Remove a language from the problem
  const removeLanguage = (languageId: string) => {
    if (selectedLanguages.length > 1) {
      const newSelectedLanguages = selectedLanguages.filter(
        (lang) => lang !== languageId
      );
      setSelectedLanguages(newSelectedLanguages);

      // Remove this language from examples, code snippets and reference solutions
      const newExamples = { ...examples };
      delete newExamples[languageId];
      setExamples(newExamples);

      const newCodeSnippets = { ...codeSnippets };
      delete newCodeSnippets[languageId];
      setCodeSnippets(newCodeSnippets);

      const newReferenceSolutions = { ...referenceSolutions };
      delete newReferenceSolutions[languageId];
      setReferenceSolutions(newReferenceSolutions);
    }
  };

  // Update example for a specific language
  const updateExample = (languageId: string, field: string, value: string) => {
    setExamples({
      ...examples,
      [languageId]: {
        ...examples[languageId],
        [field]: value,
      },
    });
  };

  // Add a new test case
  const addTestcase = () => {
    setTestcases([...testcases, { input: "", output: "", isPublic: false }]);
  };

  // Remove a test case
  const removeTestcase = (index: number) => {
    const newTestcases = [...testcases];
    newTestcases.splice(index, 1);
    setTestcases(newTestcases);
  };

  // Update a test case
  const updateTestcase = (index: number, field: string, value: any) => {
    const newTestcases = [...testcases];
    newTestcases[index] = { ...newTestcases[index], [field]: value };
    setTestcases(newTestcases);
  };

  // Update code snippet for a specific language
  const updateCodeSnippet = (languageId: string, value: string) => {
    setCodeSnippets({
      ...codeSnippets,
      [languageId]: value,
    });
  };

  // Update reference solution for a specific language
  const updateReferenceSolution = (languageId: string, value: string) => {
    setReferenceSolutions({
      ...referenceSolutions,
      [languageId]: value,
    });
  };

  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  // Save the problem
  const saveProblem = () => {
    const problem = {
      title,
      description,
      difficulty,
      topic: selectedTopics,
      examples,
      constraints,
      hints,
      editorial,
      testcases,
      codeSnippets,
      referenceSolutions,
      companyName,
    };

    console.log("Saving problem:", problem);
    // Here you would typically send this to your API
    alert("Problem saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4">
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link to={""}>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-700 text-gray-300 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-white">
                Create New Problem
              </h1>
            </div>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-black gap-2"
              onClick={saveProblem}
            >
              <Save className="h-4 w-4" />
              Save Problem
            </Button>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="bg-gray-800 border-gray-700 mb-6">
              <TabsTrigger
                value="basic"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="examples"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
              >
                Examples
              </TabsTrigger>
              <TabsTrigger
                value="testcases"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
              >
                Test Cases
              </TabsTrigger>
              <TabsTrigger
                value="solutions"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
              >
                Solutions
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-300">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter problem title"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">
                      Description
                    </Label>
                    <SimpleEditor
                      value={description}
                      onChange={setDescription}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Topics</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {TOPICS.map((topic) => (
                          <div
                            key={topic}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`topic-${topic}`}
                              checked={selectedTopics.includes(topic)}
                              onCheckedChange={() => toggleTopic(topic)}
                              className="border-gray-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                            />
                            <label
                              htmlFor={`topic-${topic}`}
                              className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {topic.charAt(0).toUpperCase() +
                                topic.slice(1).replace(/-/g, " ")}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-gray-300">
                        Difficulty
                      </Label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="mt-6">
                        <Label htmlFor="company" className="text-gray-300">
                          Company Name (Optional)
                        </Label>
                        <Input
                          id="company"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Enter company name"
                          className="bg-gray-800 border-gray-700 text-white mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Label className="text-gray-300">Supported Languages</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedLanguages.map((langId) => (
                        <Badge
                          key={langId}
                          className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/20 border-amber-500/30 flex items-center gap-1 py-1.5"
                        >
                          {LANGUAGES.find((l) => l.id === langId)?.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 text-amber-400 hover:text-amber-300 hover:bg-transparent"
                            onClick={() => removeLanguage(langId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}

                      <Select onValueChange={addLanguage}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-auto">
                          <Plus className="h-4 w-4 mr-1" /> Add Language
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {LANGUAGES.filter(
                            (lang) => !selectedLanguages.includes(lang.id)
                          ).map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Problem Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="constraints" className="text-gray-300">
                      Constraints
                    </Label>
                    <Textarea
                      id="constraints"
                      value={constraints}
                      onChange={(e) => setConstraints(e.target.value)}
                      placeholder="Enter problem constraints"
                      className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hints" className="text-gray-300">
                      Hints
                    </Label>
                    <Textarea
                      id="hints"
                      value={hints}
                      onChange={(e) => setHints(e.target.value)}
                      placeholder="Enter hints for solving the problem"
                      className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="editorial" className="text-gray-300">
                      Editorial
                    </Label>
                    <SimpleEditor value={editorial} onChange={setEditorial} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Examples Tab */}
            <TabsContent value="examples">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Examples (Language-Specific)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedLanguages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">
                        Please add at least one programming language first
                      </p>
                      <Select onValueChange={addLanguage}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-auto mx-auto">
                          <Plus className="h-4 w-4 mr-1" /> Add Language
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Tabs
                      defaultValue={selectedLanguages[0]}
                      className="w-full"
                    >
                      <TabsList className="bg-gray-800 border-gray-700 mb-6">
                        {selectedLanguages.map((langId) => (
                          <TabsTrigger
                            key={langId}
                            value={langId}
                            className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                          >
                            {LANGUAGES.find((l) => l.id === langId)?.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {selectedLanguages.map((langId) => (
                        <TabsContent key={langId} value={langId}>
                          <div className="p-4 border border-gray-800 rounded-lg space-y-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor={`example-input-${langId}`}
                                className="text-gray-300"
                              >
                                Input
                              </Label>
                              <CodeEditor
                                value={examples[langId]?.input || ""}
                                onChange={(value) =>
                                  updateExample(langId, "input", value)
                                }
                                language="plaintext"
                                height="100px"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`example-output-${langId}`}
                                className="text-gray-300"
                              >
                                Output
                              </Label>
                              <CodeEditor
                                value={examples[langId]?.output || ""}
                                onChange={(value) =>
                                  updateExample(langId, "output", value)
                                }
                                language="plaintext"
                                height="100px"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`example-explanation-${langId}`}
                                className="text-gray-300"
                              >
                                Explanation
                              </Label>
                              <Textarea
                                id={`example-explanation-${langId}`}
                                value={examples[langId]?.explanation || ""}
                                onChange={(e) =>
                                  updateExample(
                                    langId,
                                    "explanation",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter explanation for this example"
                                className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                              />
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Test Cases Tab */}
            <TabsContent value="testcases">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Test Cases</CardTitle>
                  <Button
                    onClick={addTestcase}
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Test Case
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {testcases.map((testcase, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-800 rounded-lg space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-white font-medium">
                          Test Case {index + 1}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`public-${index}`}
                              checked={testcase.isPublic}
                              onCheckedChange={(checked) =>
                                updateTestcase(index, "isPublic", checked)
                              }
                              className="border-gray-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                            />
                            <label
                              htmlFor={`public-${index}`}
                              className="text-sm font-medium leading-none text-gray-300"
                            >
                              Public
                            </label>
                          </div>

                          {testcases.length > 1 && (
                            <Button
                              onClick={() => removeTestcase(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor={`testcase-input-${index}`}
                          className="text-gray-300"
                        >
                          Input
                        </Label>
                        <CodeEditor
                          value={testcase.input}
                          onChange={(value) =>
                            updateTestcase(index, "input", value)
                          }
                          language="plaintext"
                          height="100px"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor={`testcase-output-${index}`}
                          className="text-gray-300"
                        >
                          Expected Output
                        </Label>
                        <CodeEditor
                          value={testcase.output}
                          onChange={(value) =>
                            updateTestcase(index, "output", value)
                          }
                          language="plaintext"
                          height="100px"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Solutions Tab */}
            <TabsContent value="solutions">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Code Snippets & Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedLanguages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">
                        Please add at least one programming language first
                      </p>
                      <Select onValueChange={addLanguage}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-auto mx-auto">
                          <Plus className="h-4 w-4 mr-1" /> Add Language
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Tabs defaultValue="snippets" className="w-full">
                      <TabsList className="bg-gray-800 border-gray-700 mb-6">
                        <TabsTrigger
                          value="snippets"
                          className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                        >
                          Code Snippets
                        </TabsTrigger>
                        <TabsTrigger
                          value="solutions"
                          className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                        >
                          Reference Solutions
                        </TabsTrigger>
                      </TabsList>

                      {/* Code Snippets Tab */}
                      <TabsContent value="snippets">
                        <Tabs
                          defaultValue={selectedLanguages[0]}
                          className="w-full"
                        >
                          <TabsList className="bg-gray-800 border-gray-700 mb-6">
                            {selectedLanguages.map((langId) => (
                              <TabsTrigger
                                key={langId}
                                value={langId}
                                className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                              >
                                {LANGUAGES.find((l) => l.id === langId)?.name}
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {selectedLanguages.map((langId) => (
                            <TabsContent key={langId} value={langId}>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label
                                    htmlFor={`code-snippet-${langId}`}
                                    className="text-gray-300"
                                  >
                                    Code Snippet (
                                    {
                                      LANGUAGES.find((l) => l.id === langId)
                                        ?.name
                                    }
                                    )
                                  </Label>
                                  <Badge className="bg-gray-700 text-gray-300">
                                    <Code className="h-3 w-3 mr-1" /> Template
                                  </Badge>
                                </div>
                                <CodeEditor
                                  value={codeSnippets[langId] || ""}
                                  onChange={(value) =>
                                    updateCodeSnippet(langId, value)
                                  }
                                  language={
                                    LANGUAGES.find(
                                      (l) => l.id === langId
                                    )?.name.toLowerCase() || "plaintext"
                                  }
                                  height="350px"
                                />
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </TabsContent>

                      {/* Reference Solutions Tab */}
                      <TabsContent value="solutions">
                        <Tabs
                          defaultValue={selectedLanguages[0]}
                          className="w-full"
                        >
                          <TabsList className="bg-gray-800 border-gray-700 mb-6">
                            {selectedLanguages.map((langId) => (
                              <TabsTrigger
                                key={langId}
                                value={langId}
                                className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                              >
                                {LANGUAGES.find((l) => l.id === langId)?.name}
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {selectedLanguages.map((langId) => (
                            <TabsContent key={langId} value={langId}>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label
                                    htmlFor={`reference-solution-${langId}`}
                                    className="text-gray-300"
                                  >
                                    Reference Solution (
                                    {
                                      LANGUAGES.find((l) => l.id === langId)
                                        ?.name
                                    }
                                    )
                                  </Label>
                                  <Badge className="bg-green-700/30 text-green-400 border-green-700/50">
                                    <Check className="h-3 w-3 mr-1" /> Solution
                                  </Badge>
                                </div>
                                <CodeEditor
                                  value={referenceSolutions[langId] || ""}
                                  onChange={(value) =>
                                    updateReferenceSolution(langId, value)
                                  }
                                  language={
                                    LANGUAGES.find(
                                      (l) => l.id === langId
                                    )?.name.toLowerCase() || "plaintext"
                                  }
                                  height="350px"
                                />
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
