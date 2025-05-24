import {
  CheckCircle,
  XCircle,
  Clock,
  MemoryStick,
  Code,
  TrendingUp,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SubmissionData } from "@/Types";

interface SubmissionResultsProps {
  submissionData: SubmissionData;
  onClose?: () => void;
}

export default function SubmissionResults({
  submissionData,
  onClose,
}: SubmissionResultsProps) {
  const { testcase, status, memory, time, language } = submissionData;

  const passedTests = testcase.filter((tc) => tc.passed).length;
  const totalTests = testcase.length;
  const passRate = (passedTests / totalTests) * 100;

  // Calculate total time and memory
  const totalTime = time
    .map((t: any) => Number.parseFloat(t))
    .reduce((sum: any, t: any) => sum + t, 0);
  const maxMemory = Math.max(...memory.map((m: any) => Number.parseInt(m)));
  const avgTime = totalTime / totalTests;

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gray-900 text-white min-h-screen">
      <button
        onClick={onClose}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
        aria-label="Close submission results"
      >
        <X className="w-5 h-5" />
      </button>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Submission Results</h1>
        <div className="flex items-center gap-3">
          <Badge
            variant={status === "Accepted" ? "default" : "destructive"}
            className={`text-lg px-4 py-2 ${
              status === "Accepted"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {status}
          </Badge>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Test Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {passedTests}/{totalTests}
            </div>
            <Progress value={passRate} className="mt-2" />
            <p className="text-xs text-gray-400 mt-1">
              {passRate.toFixed(1)}% passed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Runtime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {avgTime.toFixed(3)}ms
            </div>
            <p className="text-xs text-gray-400">Average execution time</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <MemoryStick className="w-4 h-4" />
              Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {(maxMemory / 1024).toFixed(1)}KB
            </div>
            <p className="text-xs text-gray-400">Peak memory usage</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{language}</div>
            <p className="text-xs text-gray-400">Programming language</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Cases Details */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Test Case Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {testcase.map((tc: any, index: any) => (
            <div
              key={tc.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                tc.passed
                  ? "border-green-500/30 bg-green-900/20"
                  : "border-red-500/30 bg-red-900/20"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(tc.passed)}
                  <span className="font-semibold text-white">
                    Test Case {index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {tc.time}ms
                  </span>
                  <span className="flex items-center gap-1">
                    <MemoryStick className="w-3 h-3" />
                    {(Number.parseInt(tc.memory) / 1024).toFixed(1)}KB
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 font-medium mb-1">Input:</p>
                  <div className="bg-gray-700 p-2 rounded font-mono text-gray-200">
                    {tc.testCase}
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 font-medium mb-1">Expected:</p>
                  <div className="bg-gray-700 p-2 rounded font-mono text-gray-200">
                    {tc.expected}
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 font-medium mb-1">Your Output:</p>
                  <div
                    className={`p-2 rounded font-mono ${
                      tc.passed
                        ? "bg-green-900/30 text-green-200"
                        : "bg-red-900/30 text-red-200"
                    }`}
                  >
                    {tc.stdout}
                  </div>
                </div>
              </div>

              {!tc.passed && (
                <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded">
                  <p className="text-red-400 text-sm font-medium">
                    ❌ Expected "{tc.expected}" but got "{tc.stdout}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Code Preview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Submitted Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-gray-200">{submissionData.sourceCode}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
