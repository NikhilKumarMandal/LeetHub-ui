import { useEffect, useState } from "react";
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

  const languageId = getLanguageId(selectedLanguage);
  const extension = languageExtensions[selectedLanguage] || javascript();

  const publicTestCases =
    problem?.testcases?.filter((tc: any) => tc.isPublic) || [];

  const {
    mutate: runCode,
    data: runResult,
    isPending: isRunning,
  } = useMutation({
    mutationKey: ["execute", "run"],
    mutationFn: execute,
    onSuccess: (data) => {
      console.log("Run result:", data);
    },
    onError: (err) => {
      console.error("Run error:", err);
    },
  });

  const { mutate: submitCode, isPending: isSubmitting } = useMutation({
    mutationKey: ["execute", "submit"],
    mutationFn: execute,
    onSuccess: (data) => {
      console.log("Submit result:", data);
    },
    onError: (err) => {
      console.error("Submit error:", err);
    },
  });

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
    runCode({
      source_code: code,
      language_id: languageId!,
      problemId: problem.id,
      mode: "run",
    });
  };

  const handleSubmit = () => {
    if (!problem) return;
    submitCode({
      source_code: code,
      language_id: languageId!,
      problemId: problem.id,
      mode: "submit",
    });
  };

  return (
    <div className="flex flex-col bg-dark-fill-3 relative overflow-x-hidden">
      {/* Language selection */}
      <div className="p-2 bg-gray-800 text-white flex gap-2">
        {availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLanguage(lang)}
            className={`px-3 py-1 rounded ${
              selectedLanguage === lang ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            {lang}
          </button>
        ))}
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
            {publicTestCases.map((tc: any, index: number) => (
              <button
                key={tc.id}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-1 rounded-lg text-sm font-medium ${
                  activeTab === index
                    ? "bg-white text-black"
                    : "bg-dark-fill-3 text-white hover:bg-dark-fill-2"
                }`}
              >
                Case {index + 1}
              </button>
            ))}
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
        </div>
      </Split>
    </div>
  );
}

export default Playground;
