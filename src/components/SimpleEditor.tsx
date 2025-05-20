"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  LinkIcon,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SimpleEditor({ value, onChange }: SimpleEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Update the editor content when the value prop changes
  useEffect(() => {
    if (editorRef.current && !isFocused) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isFocused]);

  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      onChange(newValue);
    }
  };

  const execCommand = (command: string, value = "") => {
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current?.focus();
  };

  const insertHeading = (level: number) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      const headingTag = `h${level}`;
      const headingHtml = `<${headingTag}>${selectedText || `Heading ${level}`}</${headingTag}>`;

      document.execCommand("insertHTML", false, headingHtml);
      handleInput();
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const insertCode = () => {
    const code = prompt("Enter code:");
    if (code) {
      // Create a pre and code element
      const codeHtml = `<pre style="background-color: #1e293b; padding: 10px; border-radius: 4px; overflow-x: auto;"><code style="font-family: monospace; color: #e2e8f0;">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre><p></p>`;

      // Insert the HTML
      if (editorRef.current) {
        // Focus the editor first
        editorRef.current.focus();

        // Insert the HTML at the current cursor position
        document.execCommand("insertHTML", false, codeHtml);

        // Update the value
        handleInput();
      }
    }
  };

  return (
    <div className="border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gray-800 p-2 flex flex-wrap gap-1 border-b border-gray-700">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={() => insertHeading(1)}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={() => insertHeading(2)}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={() => insertHeading(3)}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-700 mx-1 self-center"></div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={() => execCommand("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={() => execCommand("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-700 mx-1 self-center"></div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={() => execCommand("insertUnorderedList")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={() => execCommand("insertOrderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-700 mx-1 self-center"></div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={insertLink}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={insertCode}
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        className="min-h-[300px] p-3 bg-gray-800 text-white outline-none overflow-auto"
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning={true}
      ></div>
    </div>
  );
}
