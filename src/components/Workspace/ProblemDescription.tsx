import { CheckCircle, Star } from "lucide-react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const ProblemDescription = ({ problem }: any) => {
  return (
    <div className="bg-gray">
      {/* TAB */}
      <div className="flex h-11 w-full items-center pt-2 bg-gray-400 text-white overflow-x-hidden">
        <div
          className={
            "bg-gray-400 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
          }
        >
          Description
        </div>
        <div
          className={
            "bg-gray-400 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
          }
        >
          Description
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">
                {problem?.problemNumber} {problem?.title}
              </div>
            </div>
            <div className="flex items-center mt-3">
              <div
                className={`text-olive bg-olive inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
              >
                {problem?.difficulty}
              </div>
              <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                <CheckCircle />
              </div>
              <div className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6">
                <ThumbsUp />
                <span className="text-xs">120</span>
              </div>
              <div className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6">
                <ThumbsDown />
                <span className="text-xs">2</span>
              </div>
              <div className="cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 ">
                <Star />
              </div>
            </div>

            {/* Problem Statement(paragraphs) */}
            <div className="text-white text-sm">
              <p className="mt-3">{problem?.description}</p>
            </div>

            {/* Examples */}
            <div className="mt-4">
              {problem?.examples &&
                Object.entries(problem.examples).map(
                  ([language, example], index) => {
                    const typedExample = example as {
                      input: string;
                      output: string;
                      explanation: string;
                    };

                    return (
                      <div key={language} className="mb-4">
                        <p className="font-medium text-white">
                          Example {index + 1}:
                        </p>
                        <div className="example-card">
                          <pre>
                            <strong className="text-white">Input:</strong>{" "}
                            {typedExample.input}
                            <br />
                            <strong className="text-white">Output:</strong>{" "}
                            {typedExample.output}
                            <br />
                            <strong className="text-white">
                              Explanation:
                            </strong>{" "}
                            {typedExample.explanation}
                          </pre>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>

            {/* Constraints */}
            <div className="my-5">
              <div className="text-white text-sm font-medium">Constraints:</div>
              <ul className="text-white ml-5 list-disc">
                <li className="mt-2">
                  <code>2 ≤ nums.length ≤ 10</code>
                </li>

                <li className="mt-2">
                  <code>-10 ≤ nums[i] ≤ 10</code>
                </li>
                <li className="mt-2">
                  <code>-10 ≤ target ≤ 10</code>
                </li>
                <li className="mt-2 text-sm">
                  <strong>Only one valid answer exists.</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProblemDescription;
