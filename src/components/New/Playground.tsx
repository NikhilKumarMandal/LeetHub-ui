import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { Play, Settings, Upload } from "lucide-react";
import type { Execute, ProblemDescriptionProps } from "@/Types";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { getLanguageId } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { executeCode } from "@/http/api";
import { Maximize, Minimize } from "lucide-react";
import { useLocation } from "react-router-dom";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { monokai } from "@uiw/codemirror-theme-monokai";

const languageExtensions: Record<string, any> = {
  JAVASCRIPT: javascript(),
  JAVA: java(),
  PYTHON: python(),
};

const execute = async (executeCodeData: Execute) => {
  const { data } = await executeCode(executeCodeData);
  return data;
};

const themeMap: Record<string, any> = {
  vscodeDark: vscodeDark,
  dracula: dracula,
  monokai: monokai,
  light: githubLight,
  dark: vscodeDark,
  githubDark: githubDark,
};

function Playground({ problem }: ProblemDescriptionProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("testcase");
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(
    null
  );
  const [executionMode, setExecutionMode] = useState<"run" | "submit" | null>(
    null
  );
  const [executionResults, setExecutionResults] = useState<any>([]);
  const [executionResultsForRun, setExecutionResultsForRun] = useState<any[]>(
    []
  );
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState("vscodeDark");
  const [showSettings, setShowSettings] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const testCases = problem?.testcases.filter((tc) => tc.isPublic);
  const selectedTestCase = testCases?.find(
    (tc) => tc.id === selectedTestCaseId
  );

  const availableLanguages = Object.keys(problem?.starterFunction ?? {});
  const defaultLanguage =
    availableLanguages.length > 0 ? availableLanguages[0] : "JAVASCRIPT";

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(
    problem?.starterFunction?.[defaultLanguage as any] || ""
  );

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const playlistId =
    location?.state?.playlistId1 || searchParams.get("playlistId");

  const languageId = getLanguageId(selectedLanguage);
  const extension = languageExtensions[selectedLanguage] || javascript();

  useEffect(() => {
    if (problem?.starterFunction?.[selectedLanguage as any]) {
      setCode(problem.starterFunction[selectedLanguage as any]);
    } else if (problem?.starterFunction) {
      const fallbackLang = Object.keys(problem.starterFunction)[0];
      setSelectedLanguage(fallbackLang);
      setCode(problem.starterFunction[fallbackLang as any]);
    }
  }, [selectedLanguage, problem?.starterFunction]);

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
      setExecutionResultsForRun(data.data);
      setShowResults(false);
      setActiveTab("result");
    },
    onError: (err) => console.error("Run error:", err),
  });

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
      setActiveTab("submission");
      queryClient.invalidateQueries({
        queryKey: ["submission"],
      });
    },
    onError: (err) => console.error("Submit error:", err),
  });

  const passedTests =
    executionResults?.testcase?.filter((tc: any) => tc.passed)?.length || 0;
  const totalTests = executionResults?.testcase?.length || 0;
  const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  const timeArray = executionResults?.time
    ? JSON.parse(executionResults.time)
    : [];
  const memoryArray = executionResults?.memory
    ? JSON.parse(executionResults.memory)
    : [];
  const totalTime = timeArray
    .map((t: any) => parseFloat(t))
    .reduce((sum: number, t: number) => sum + t, 0);
  const avgTime = totalTests > 0 ? totalTime / totalTests : 0;

  const maxMemory =
    memoryArray.length > 0
      ? Math.max(...memoryArray.map((m: any) => parseInt(m)))
      : 0;

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
      playlistId: playlistId!,
    });
  }, [code, languageId, problem, submitCode]);

  useEffect(() => {
    if (testCases?.length && !selectedTestCaseId) {
      setSelectedTestCaseId(testCases[0].id);
    }
  }, [testCases, selectedTestCaseId]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };
  return (
    <ResizablePanelGroup
      direction="vertical"
      className="w-full h-full bg-black"
    >
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="flex flex-col h-full bg-gray-900 overflow-hidden">
          <div className="p-2 bg-gray-800 text-white flex items-center gap-3">
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

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullScreen}
              className="p-1 hover:bg-gray-700 rounded"
            >
              {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <Settings size={20} />
            </button>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  Editor Settings
                </h2>

                {/* Font Size */}
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Font Size
                  </label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                  >
                    {[12, 14, 16, 18, 20, 24].map((size) => (
                      <option key={size} value={size}>
                        {size}px
                      </option>
                    ))}
                  </select>
                </div>

                {/* Theme */}
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                  >
                    {[
                      "light",
                      "dark",
                      "monokai",
                      "github",
                      "dracula",
                      "githubDark",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 relative overflow-hidden">
            <CodeMirror
              value={code}
              theme={themeMap[theme]}
              extensions={[extension]}
              onChange={(value: string) => setCode(value)}
              style={{ fontSize: `${fontSize}px`, height: "100%" }}
              height="550px"
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35} minSize={15}>
        <div className="flex flex-col h-full bg-gray-800 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
            <div className="flex items-center gap-1">
              {["testcase", "result", "submission", "leto"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? "border-green-500 text-green-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab === "testcase" && "Testcase"}
                  {tab === "result" && "Test Result"}
                  {tab === "submission" && "Submit Result"}
                  {tab === "leto" && "Ask LETO"}
                </button>
              ))}
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

          {/* Body */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Left Sidebar: Test Case List */}
            {activeTab === "testcase" && (
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
            )}

            {/* Right Content */}
            <div className="flex-1 p-4 overflow-y-auto text-white">
              {/* Test Case Tab Content */}
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

              {/* Test Result Tab Content */}
              {activeTab === "result" && executionResultsForRun?.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 space-y-3 overflow-y-auto">
                    {executionResultsForRun.map((result, index) => (
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

              {/* Submission Result Tab */}
              {activeTab === "submission" && (
                <div className="bg-[#1e1e2f] p-6 rounded-xl shadow-lg border border-gray-700 text-sm text-gray-200 space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    📦 Submission Result
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#2c2c3e] p-4 rounded-lg">
                      <p className="text-gray-400">🧪 Test Cases Passed</p>
                      <p className="text-green-400 font-semibold text-lg">
                        {passedTests} / {totalTests}
                      </p>
                    </div>
                    <div className="bg-[#2c2c3e] p-4 rounded-lg">
                      <p className="text-gray-400">✅ Pass Rate</p>
                      <p className="text-yellow-400 font-semibold text-lg">
                        {passRate.toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-[#2c2c3e] p-4 rounded-lg">
                      <p className="text-gray-400">⏱️ Avg Execution Time</p>
                      <p className="text-blue-400 font-semibold text-lg">
                        {avgTime.toFixed(3)} s
                      </p>
                    </div>
                    <div className="bg-[#2c2c3e] p-4 rounded-lg">
                      <p className="text-gray-400">🧠 Max Memory Usage</p>
                      <p className="text-purple-400 font-semibold text-lg">
                        {maxMemory} KB
                      </p>
                    </div>
                  </div>

                  {executionResults?.testcase?.some(
                    (tc: any) => !tc.passed
                  ) && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-red-400 mb-2">
                        ❌ Failed Test Cases
                      </h4>
                      <div className="space-y-3">
                        {executionResults.testcase.map(
                          (tc: any, idx: number) =>
                            !tc.passed ? (
                              <div
                                key={idx}
                                className="bg-[#2b2b3d] border border-red-500/30 p-4 rounded-lg"
                              >
                                <p className="text-sm text-gray-400 mb-1">
                                  Case{" "}
                                  <span className="font-semibold">
                                    #{idx + 1}
                                  </span>
                                </p>
                                <p>
                                  <span className="text-gray-400">
                                    Expected:
                                  </span>{" "}
                                  <code className="text-green-400">
                                    {tc.expected}
                                  </code>
                                </p>
                                <p>
                                  <span className="text-gray-400">Output:</span>{" "}
                                  <code className="text-red-400">
                                    {tc.stdout}
                                  </code>
                                </p>
                              </div>
                            ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ask LETO Tab */}
              {activeTab === "leto" && (
                <div className="text-sm text-gray-300">
                  <h3 className="text-lg font-semibold mb-2">
                    🧠 Ask Better Approach
                  </h3>
                  <p>
                    Want to improve your solution? Ask LETO for a better
                    approach based on test results.
                  </p>
                  {/* Optional: Add a textarea + button to "Ask LETO" here */}
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
