import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { getLanguageId } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { executeCode } from "@/http/api";
import type { Execute } from "@/Types";
import SubmissionResults from "./SubmissionResults";

const languageExtensions: Record<string, any> = {
  JAVASCRIPT: javascript(),
  JAVA: java(),
  PYTHON: python(),
};

const execute = async (executeCodeData: Execute) => {
  const { data } = await executeCode(executeCodeData);
  return data;
};

function Playground({ problem }: { problem: any }) {
  const availableLanguages = useMemo(
    () => Object.keys(problem?.codeSnippets ?? {}),
    [problem]
  );
  const defaultLanguage = availableLanguages[0] ?? "JAVASCRIPT";

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [executionMode, setExecutionMode] = useState<"run" | "submit" | null>(
    null
  );
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const publicTestCases = useMemo(
    () => problem?.testcases?.filter((tc: any) => tc.isPublic) || [],
    [problem]
  );

  const languageId = useMemo(
    () => getLanguageId(selectedLanguage),
    [selectedLanguage]
  );
  const extension = useMemo(
    () => languageExtensions[selectedLanguage] || javascript(),
    [selectedLanguage]
  );

  // Save and load code
  useEffect(() => {
    const saved = localStorage.getItem(
      `code-${problem?.id}-${selectedLanguage}`
    );
    const fallback = problem?.codeSnippets?.[selectedLanguage];
    setCode(saved ?? fallback ?? "");
  }, [problem?.id, selectedLanguage, problem?.codeSnippets]);

  useEffect(() => {
    if (executionResults.length > 0 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [executionResults]);

  const { mutate: runCode, isPending: isRunning } = useMutation({
    mutationKey: ["execute", "run"],
    mutationFn: execute,
    onSuccess: (data) => {
      setExecutionMode("run");
      setExecutionResults(data.data);
      setShowResults(false);
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

  // Save code to localStorage when it changes
  useEffect(() => {
    if (problem?.id && selectedLanguage) {
      localStorage.setItem(`code-${problem.id}-${selectedLanguage}`, code);
    }
  }, [code, selectedLanguage, problem?.id]);

  if (showResults && submissionData) {
    return (
      <SubmissionResults
        submissionData={submissionData}
        onClose={() => setShowResults(false)}
      />
    );
  }

  return (
    <div className="flex flex-col bg-dark-fill-3 relative overflow-x-hidden">
      {/* Language selector */}
      <div className="p-2 bg-gray-800 text-white">
        <label htmlFor="language" className="mr-2 text-sm font-medium">
          Language:
        </label>
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

      {/* Split Editor/Testcases */}
      <Split
        className="h-[calc(100vh-130px)]"
        direction="vertical"
        sizes={[60, 40]}
        minSize={60}
      >
        <div className="w-full overflow-auto">
          <CodeMirror
            value={code}
            theme={vscodeDark}
            extensions={[extension]}
            onChange={setCode}
            style={{ fontSize: 16, height: "100%", maxHeight: "1000px" }}
          />
        </div>

        <div className="w-full px-5 overflow-auto">
          <div className="flex justify-between items-center h-10 space-x-6">
            <div className="relative flex flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-white">
                Test Cases
              </div>
              <hr className="absolute bottom-0 w-16 h-0.5 rounded-full border-none bg-white" />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="bg-gray-600 hover:bg-gray-500 text-white px-5 py-1.5 rounded-md text-sm font-medium"
              >
                {isRunning ? "Running..." : "Run"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white px-5 py-1.5 rounded-md text-sm font-medium"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          {/* Test Case Tabs */}
          <div className="flex mt-4 flex-wrap gap-2">
            {publicTestCases.map((tc: any, i: number) => (
              <button
                key={tc.id}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === i
                    ? "bg-white text-black"
                    : "bg-dark-fill-3 text-white hover:bg-dark-fill-2"
                }`}
              >
                Case {i + 1}
              </button>
            ))}
          </div>

          {/* Test Case Input/Output */}
          {publicTestCases[activeTab] && (
            <div className="mt-6 text-white">
              <p className="text-sm font-medium">Input:</p>
              <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3 mt-1">
                {publicTestCases[activeTab].input}
              </div>
              <p className="text-sm font-medium mt-4">Output:</p>
              <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3 mt-1">
                {publicTestCases[activeTab].output}
              </div>
            </div>
          )}

          {/* Execution Results */}
          {executionResults.length > 0 && (
            <div ref={resultRef} className="mt-6 text-white">
              <h2 className="text-lg font-semibold mb-4">
                {executionMode === "run" ? "Run Results" : "Submission Results"}
              </h2>
              {executionResults.map((result, index) => (
                <div
                  key={index}
                  className={`mb-4 p-4 rounded-lg border ${result.passed ? "border-green-500" : "border-red-500"}`}
                >
                  <pre className="whitespace-pre-wrap text-sm">
                    {result.stdout || result.error}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </Split>
    </div>
  );
}

export default Playground;
