import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Maximize2, Minimize2 } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  height = "300px",
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Generate line numbers whenever the code changes
  useEffect(() => {
    const lines = (value || "").split("\n").length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => (i + 1).toString()));
  }, [value]);

  // Update the textarea value when the value prop changes and not focused
  useEffect(() => {
    if (textareaRef.current && !isFocused) {
      textareaRef.current.value = value;
    }
  }, [value, isFocused]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Handle tab key in the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Insert tab at cursor position
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Move cursor after the inserted tab
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Get language-specific syntax highlighting class
  const getLanguageClass = () => {
    switch (language.toLowerCase()) {
      case "javascript":
      case "js":
        return "language-javascript";
      case "python":
      case "py":
        return "language-python";
      case "java":
        return "language-java";
      case "cpp":
      case "c++":
        return "language-cpp";
      case "csharp":
      case "c#":
        return "language-csharp";
      case "go":
        return "language-go";
      case "ruby":
        return "language-ruby";
      case "rust":
        return "language-rust";
      case "kotlin":
        return "language-kotlin";
      case "swift":
        return "language-swift";
      default:
        return "language-plaintext";
    }
  };

  return (
    <div
      className={`border border-gray-700 rounded-md overflow-hidden ${
        fullscreen ? "fixed inset-0 z-50 bg-gray-900 p-4" : ""
      }`}
    >
      <div className="bg-gray-800 p-2 flex justify-between items-center border-b border-gray-700">
        <div className="text-sm text-gray-400">
          {language.charAt(0).toUpperCase() + language.slice(1).toLowerCase()}
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={toggleFullscreen}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex">
        {/* Line numbers */}
        <div
          className="bg-gray-900 text-gray-500 text-right p-2 select-none"
          style={{ minWidth: "3rem", userSelect: "none" }}
        >
          {lineNumbers.map((num, i) => (
            <div key={i} className="leading-6 text-xs">
              {num}
            </div>
          ))}
        </div>
        {/* Code editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-gray-800 text-white outline-none p-2 font-mono text-sm resize-none ${getLanguageClass()}`}
          style={{
            height: fullscreen ? "calc(100vh - 8rem)" : height,
            lineHeight: 1.5,
          }}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
}
