import { useState } from "react";
import { CheckCircle, Star, ThumbsUp, ThumbsDown } from "lucide-react";

const ProblemDescription = ({ problem }: any) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {["Description", "Solutions"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-6 py-3 text-xs font-semibold rounded-t-md transition-colors
        ${
          activeTab === tab.toLowerCase()
            ? "bg-gray-800 text-green-400"
            : "bg-gray-700 text-gray-400 hover:bg-gray-600"
        }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content area: flexible and scrollable */}
      <div className="p-6 overflow-auto flex-grow max-h-[calc(100vh-100px)]">
        {activeTab === "description" && (
          <>
            <h2 className="text-2xl font-semibold mb-3">
              {problem?.problemNumber}. {problem?.title}
            </h2>

            <div className="flex items-center space-x-4 mb-6">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize 
                ${
                  problem?.difficulty === "easy"
                    ? "bg-green-700 text-green-300"
                    : problem?.difficulty === "medium"
                      ? "bg-yellow-700 text-yellow-300"
                      : "bg-red-700 text-red-300"
                }`}
              >
                {problem?.difficulty}
              </span>

              <CheckCircle className="text-green-400" size={20} />

              <button
                type="button"
                className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Upvote"
              >
                <ThumbsUp size={18} />
                <span className="text-xs">120</span>
              </button>

              <button
                type="button"
                className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Downvote"
              >
                <ThumbsDown size={18} />
                <span className="text-xs">2</span>
              </button>

              <button
                type="button"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
                aria-label="Star"
              >
                <Star size={20} />
              </button>
            </div>

            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {problem?.description}
            </p>

            {problem?.examples && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Examples</h3>
                {Object.entries(problem.examples).map(
                  ([language, example], idx) => {
                    const typedExample = example as {
                      input: string;
                      output: string;
                      explanation: string;
                    };
                    return (
                      <div
                        key={language}
                        className="mb-6 bg-gray-800 rounded-md p-4 shadow-sm"
                      >
                        <p className="font-medium mb-2 text-green-300">
                          Example {idx + 1} ({language})
                        </p>
                        <pre className="text-sm leading-snug whitespace-pre-wrap">
                          <strong>Input:</strong> {typedExample.input}
                          <br />
                          <strong>Output:</strong> {typedExample.output}
                          <br />
                          <strong>Explanation:</strong>{" "}
                          {typedExample.explanation}
                        </pre>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-3">Constraints</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    2 ≤ nums.length ≤ 10
                  </code>
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    -10 ≤ nums[i] ≤ 10
                  </code>
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    -10 ≤ target ≤ 10
                  </code>
                </li>
                <li>
                  <strong>Only one valid answer exists.</strong>
                </li>
              </ul>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-3">Constraints</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    2 ≤ nums.length ≤ 10
                  </code>
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    -10 ≤ nums[i] ≤ 10
                  </code>
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    -10 ≤ target ≤ 10
                  </code>
                </li>
                <li>
                  <strong>Only one valid answer exists.</strong>
                </li>
              </ul>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-3">Constraints</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    2 ≤ nums.length ≤ 10
                  </code>
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    -10 ≤ nums[i] ≤ 10
                  </code>
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    -10 ≤ target ≤ 10
                  </code>
                </li>
                <li>
                  <strong>Only one valid answer exists.</strong>
                </li>
              </ul>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-3">Constraints</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    2 ≤ nums.length ≤ 10
                  </code>
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    -10 ≤ nums[i] ≤ 10
                  </code>
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    -10 ≤ target ≤ 10
                  </code>
                </li>
                <li>
                  <strong>Only one valid answer exists.</strong>
                </li>
              </ul>
            </div>
          </>
        )}

        {activeTab === "solutions" && (
          <div className="text-gray-400">
            {problem?.solutions && problem.solutions.length > 0 ? (
              problem.solutions.map((solution: any, idx: number) => (
                <div key={idx} className="mb-4 p-4 bg-gray-800 rounded">
                  <pre className="whitespace-pre-wrap text-sm">
                    {solution.code}
                  </pre>
                </div>
              ))
            ) : (
              <p>Solutions content coming soon...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDescription;
