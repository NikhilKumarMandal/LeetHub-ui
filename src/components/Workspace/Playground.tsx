import { useEffect, useState } from "react";
import { useRef } from "react";
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

function Playground({ problem }: any) {
  const availableLanguages = Object.keys(problem?.codeSnippets ?? {});
  const defaultLanguage =
    availableLanguages.length > 0 ? availableLanguages[0] : "JAVASCRIPT";

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(
    problem?.codeSnippets?.[defaultLanguage] || ""
  );
  const [activeTab, setActiveTab] = useState(0);
  const [executionMode, setExecutionMode] = useState<"run" | "submit" | null>(
    null
  );
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const languageId = getLanguageId(selectedLanguage);
  const extension = languageExtensions[selectedLanguage] || javascript();
  const resultRef = useRef<HTMLDivElement>(null);

  const publicTestCases =
    problem?.testcases?.filter((tc: any) => tc.isPublic) || [];

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
    onError: (err) => {
      console.error("Run error:", err);
    },
  });

  const { mutate: submitCode, isPending: isSubmitting } = useMutation({
    mutationKey: ["execute", "submit"],
    mutationFn: execute,
    onSuccess: (data) => {
      setExecutionMode("submit");
      setExecutionResults(data.data);
      console.log("Data", data?.data);
      setSubmissionData({
        id: data.id || "temp-id",
        problemId: problem.id,
        sourceCode: code,
        language: selectedLanguage,
        status: data.status || "Wrong Answer",
        memory: data?.data?.testcase.map((tc: any) => tc.memory ?? "6720"),
        time: data?.data?.testcase.map((tc: any) => tc.time ?? "0.052"),
        testcase:
          data?.data?.testcase.map((tc: any, index: number) => ({
            id: tc.id || `tc-${index}`,
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
    onError: (err) => {
      console.error("Submit error:", err);
    },
  });

  // const handleCloseResults = () => {
  //   setShowResults(false);
  //   setSubmissionData(null);
  //   setEditorKey(prev => prev + 1);
  // };

  useEffect(() => {
    if (problem?.codeSnippets?.[selectedLanguage]) {
      setCode(problem.codeSnippets[selectedLanguage]);
    } else if (problem?.codeSnippets) {
      const fallbackLang = Object.keys(problem.codeSnippets)[0] || "JAVASCRIPT";
      setSelectedLanguage(fallbackLang);
      setCode(problem.codeSnippets[fallbackLang]);
    }
  }, [selectedLanguage, problem?.codeSnippets]);

  const handleRun = () => {
    if (!problem) return;
    setExecutionMode("run");
    setShowResults(false);
    runCode({
      source_code: code,
      language_id: languageId!,
      problemId: problem.id,
      mode: "run",
    });
  };

  const handleSubmit = () => {
    if (!problem) return;
    setExecutionMode("submit");
    submitCode({
      source_code: code,
      language_id: languageId!,
      problemId: problem.id,
      mode: "submit",
    });
  };

  if (showResults && submissionData) {
    console.log(showResults, submissionData);

    return (
      <SubmissionResults
        submissionData={submissionData}
        onClose={() => setShowResults(false)}
      />
    );
  }

  return (
    <div className="flex flex-col bg-dark-fill-3 relative overflow-x-hidden">
      {/* Language selection */}
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
            onChange={(value) => setCode(value)}
            style={{ fontSize: 16 }}
            height="1000px"
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
                className="bg-gray-600 hover:bg-gray-500 text-white px-5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {isRunning ? "Running..." : "Run"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white px-5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          <div className="flex mt-4 flex-wrap gap-2">
            {publicTestCases.map((tc: any, index: number) => {
              const isActive = activeTab === index;

              return (
                <button
                  key={tc.id}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200
          ${isActive ? "bg-white text-black" : "bg-dark-fill-3 text-white hover:bg-dark-fill-2"}
        `}
                >
                  Case {index + 1}
                </button>
              );
            })}
          </div>

          {publicTestCases[activeTab] && (
            <div className="mt-6 text-white">
              <div className="font-semibold">
                <p className="text-sm font-medium">Input:</p>
                <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 mt-1">
                  {publicTestCases[activeTab].input}
                </div>

                <p className="text-sm font-medium mt-4">Output:</p>
                <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 mt-1">
                  {publicTestCases[activeTab].output}
                </div>
              </div>
            </div>
          )}

          {executionResults.length > 0 && (
            <div ref={resultRef} className="mt-6 text-white">
              <h2 className="text-lg font-semibold mb-4">
                {executionMode === "run" ? "Run Results" : "Submission Results"}
              </h2>
              {executionResults.map((result, index) => (
                <div
                  key={index}
                  className={`mb-4 p-4 rounded-lg border ${
                    result.passed
                      ? "border-green-500 bg-green-900/40"
                      : "border-red-500 bg-red-900/40"
                  }`}
                >
                  <p className="font-medium mb-2">Test Case {index + 1}</p>
                  <p>
                    <span className="font-semibold">Input:</span>{" "}
                    {result.testCase}
                  </p>
                  <p>
                    <span className="font-semibold">Expected Output:</span>{" "}
                    {result.expected_output}
                  </p>
                  <p>
                    <span className="font-semibold">Your Output:</span>{" "}
                    {result.actual_output}
                  </p>
                  <p>
                    <span className="font-semibold">Execution Time:</span>{" "}
                    {result.time} ms
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={
                        result.passed ? "text-green-400" : "text-red-400"
                      }
                    >
                      {result.passed ? "Passed ✅" : "Failed ❌"}
                    </span>
                  </p>
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
