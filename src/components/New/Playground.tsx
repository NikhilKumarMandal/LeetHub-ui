import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { Play, Upload } from "lucide-react";
import type { Execute, ProblemDescriptionProps } from "@/Types";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { getLanguageId } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { executeCode } from "@/http/api";

const languageExtensions: Record<string, any> = {
  JAVASCRIPT: javascript(),
  JAVA: java(),
  PYTHON: python(),
};

const execute = async (executeCodeData: Execute) => {
  const { data } = await executeCode(executeCodeData);
  return data;
};

function Playground({ problem }: ProblemDescriptionProps) {
  const [activeTab, setActiveTab] = useState("testcase");
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(
    null
  );
  const [executionMode, setExecutionMode] = useState<"run" | "submit" | null>(
    null
  );
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  const testCases = problem?.testcases.filter((tc) => tc.isPublic);
  const selectedTestCase = testCases?.find(
    (tc) => tc.id === selectedTestCaseId
  );

  const availableLanguages = Object.keys(problem?.codeSnippets ?? {});
  const defaultLanguage =
    availableLanguages.length > 0 ? availableLanguages[0] : "JAVASCRIPT";

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(
    problem?.codeSnippets?.[defaultLanguage] || ""
  );

  const languageId = getLanguageId(selectedLanguage);
  const extension = languageExtensions[selectedLanguage] || javascript();

  console.log(executionResults);

  useEffect(() => {
    if (problem?.codeSnippets?.[selectedLanguage]) {
      setCode(problem.codeSnippets[selectedLanguage]);
    } else if (problem?.codeSnippets) {
      const fallbackLang = Object.keys(problem.codeSnippets)[0];
      setSelectedLanguage(fallbackLang);
      setCode(problem.codeSnippets[fallbackLang]);
    }
  }, [selectedLanguage, problem?.codeSnippets]);

  useEffect(() => {
    if (problem?.id && selectedLanguage) {
      localStorage.setItem(`code-${problem.id}-${selectedLanguage}`, code);
    }
  }, [code, selectedLanguage, problem?.id]);

  const { mutate: runCode, isPending: isRunning } = useMutation({
    mutationKey: ["execute", "run"],
    mutationFn: execute,
    onSuccess: (data) => {
      setExecutionMode("run");
      setExecutionResults(data.data);
      setShowResults(false);
      setActiveTab("result");
    },
    onError: (err) => console.error("Run error:", err),
  });

  console.log("submissionData", submissionData);

  const { mutate: submitCode, isPending: isSubmitting } = useMutation({
    mutationKey: ["execute", "submit"],
    mutationFn: execute,
    onSuccess: (data) => {
      setExecutionMode("submit");
      setExecutionResults(data.data);

      setSubmissionData({
        id: data.id || "temp-id",
        problemId: problem.id,
        sourceCode: code,
        language: selectedLanguage,
        status: data.status || "Wrong Answer",
        memory: data.data?.testcase?.map((tc: any) => tc.memory ?? "6720"),
        time: data.data?.testcase?.map((tc: any) => tc.time ?? "0.052"),
        testcase:
          data.data?.testcase?.map((tc: any, i: number) => ({
            id: tc.id || `tc-${i}`,
            submissionId: data.id || "temp-id",
            testCase: tc.testCase ?? tc.input ?? "",
            expected: tc.expected_output ?? tc.expected ?? "",
            stdout: tc.actual_output ?? tc.stdout ?? "",
            passed: tc.passed ?? false,
            time: tc.time ?? "0.052",
            memory: tc.memory ?? "6720",
            status: tc.passed ? "Accepted" : "Wrong Answer",
          })) || [],
        createdAt: new Date().toISOString(),
      });
      setActiveTab("result");
      setShowResults(true);
    },
    onError: (err) => console.error("Submit error:", err),
  });

  const handleRun = useCallback(() => {
    if (!problem) return;
    setExecutionMode("run");
    setShowResults(false);
    runCode({
      source_code: code,
      language_id: languageId!,
      problemId: problem.id,
      mode: "run",
    });
  }, [code, languageId, problem, runCode]);

  const handleSubmit = useCallback(() => {
    if (!problem) return;
    setExecutionMode("submit");
    submitCode({
      source_code: code,
      language_id: languageId!,
      problemId: problem.id,
      mode: "submit",
    });
  }, [code, languageId, problem, submitCode]);

  useEffect(() => {
    if (testCases?.length && !selectedTestCaseId) {
      setSelectedTestCaseId(testCases[0].id);
    }
  }, [testCases, selectedTestCaseId]);

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="w-full h-full bg-black"
    >
      {/* Code Editor Panel */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="flex flex-col h-full bg-gray-900 overflow-hidden">
          {/* Language Selector */}
          <div className="p-2 bg-gray-800 text-white">
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* CodeMirror Editor */}
          <div className="flex-1 relative overflow-hidden">
            <CodeMirror
              value={code}
              theme={vscodeDark}
              extensions={[extension]}
              onChange={(value: string) => setCode(value)}
              style={{ fontSize: 16, height: "100%" }}
              height="750px"
            />
          </div>
        </div>
      </ResizablePanel>

      {/* Handle between Editor and TestCase */}
      <ResizableHandle withHandle />

      {/* Test Case / Result Panel */}
      <ResizablePanel defaultSize={50} minSize={20}>
        <div className="flex flex-col h-full bg-gray-800 overflow-hidden">
          {/* Tabs & Buttons */}
          <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
            <div className="flex items-center">
              <button
                onClick={() => setActiveTab("testcase")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "testcase"
                    ? "border-green-500 text-green-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Testcase
              </button>
              <button
                onClick={() => setActiveTab("result")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "result"
                    ? "border-green-500 text-green-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Test Result
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleRun}
                disabled={isRunning}
                variant="outline"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>

          {/* Test Case Content */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Test Case List */}
            <div className="w-32 border-r border-gray-700 p-2 overflow-y-auto">
              <div className="space-y-1">
                {testCases?.map((testCase, idx) => (
                  <button
                    key={testCase.id}
                    onClick={() => setSelectedTestCaseId(testCase.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedTestCaseId === testCase.id
                        ? "bg-gray-700 text-white border border-gray-600"
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    <span>Case {idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content */}
            {/* Right Content */}
            <div className="flex-1 p-4 overflow-y-auto text-white">
              {activeTab === "testcase" && selectedTestCase && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Input</h3>
                  <pre className="bg-gray-900 p-2 rounded text-sm">
                    {selectedTestCase.input}
                  </pre>

                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Expected Output
                  </h3>
                  <pre className="bg-gray-900 p-2 rounded text-sm">
                    {selectedTestCase.output}
                  </pre>
                </div>
              )}

              {activeTab === "result" && executionResults?.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 space-y-3 overflow-y-auto">
                    {executionResults?.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded border ${
                          result.passed
                            ? "border-green-500 bg-green-800/20"
                            : "border-red-500 bg-red-800/20"
                        }`}
                      >
                        <div className="font-medium">
                          Test Case {index + 1} —{" "}
                          {result.passed ? "✅ Passed" : "❌ Failed"}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">
                          <div>
                            <strong>Input:</strong> {result.testCase}
                          </div>
                          <div>
                            <strong>Expected:</strong> {result.expected_output}
                          </div>
                          <div>
                            <strong>Output:</strong> {result.actual_output}
                          </div>
                          {result.stderr && (
                            <div className="bg-red-900 text-red-300 p-2 rounded mt-2 whitespace-pre-wrap">
                              <strong>Syntax Error:</strong>
                              <br />
                              {result.stderr}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default Playground;

//     <div className="p-4 space-y-3 overflow-y-auto">
//       {executionResults?.map((result, index) => (
//         <div
//           key={index}
//           className={`p-3 rounded border ${
//             result.passed ? "border-green-500 bg-green-800/20" : "border-red-500 bg-red-800/20"
//           }`}
//         >
//           <div className="font-medium">
//             Test Case {index + 1} — {result.passed ? "✅ Passed" : "❌ Failed"}
//           </div>
//           <div className="text-sm text-gray-300 mt-1">
//             <div><strong>Input:</strong> {result.testCase}</div>
//             <div><strong>Expected:</strong> {result.expected}</div>
//             <div><strong>Output:</strong> {result.stdout}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   ) : (
