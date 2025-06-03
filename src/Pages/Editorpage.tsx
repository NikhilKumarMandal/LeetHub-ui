// src/pages/EditorPage.jsx
import { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { socket } from "../lib/socket";
import Editor from "@monaco-editor/react";
import { useAuthStore } from "@/store/store";
import { io } from "socket.io-client";
const socket = io("http://localhost:8080");
const EditorPage = () => {
  const { roomId } = useParams<string>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const userName = user?.name;
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [output, setOutput] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [version, setVersion] = useState("*");

  // Ref for typing debounce
  //   const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Wait for user state to load before redirecting
    if (user === undefined) return;
    if (!userName) {
      navigate("/");
      return;
    }

    socket.emit("join", { roomId, userName });

    socket.on("userJoined", (users) => setUsers(users));
    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("userTyping", (userTypingName) => {
      setTyping(`${userTypingName} is typing...`);
      setTimeout(() => setTyping(""), 2000);
    });

    socket.on("languageUpdate", setLanguage);

    socket.on("codeResponse", (res) => {
      setOutput(res.run.output);
    });

    const handleBeforeUnload = () => socket.emit("leaveRoom");
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.emit("leaveRoom");
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("codeResponse");
    };
  }, [roomId, userName, user, navigate]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId as string);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };
  const typingTimeoutRef = useRef<number | null>(null);

  const handleCodeChange = (newCode: string | undefined) => {
    setCode(newCode ?? "");
    socket.emit("codeChange", { roomId, code: newCode });

    if (typingTimeoutRef.current !== null) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      socket.emit("typing", { roomId, userName });
    }, 300);
  };

  const handleLanguageChange = (e: any) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit("languageChange", { roomId, language: newLang });
  };

  const runCode = () => {
    socket.emit("compileCode", { code, roomId, language, version });
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold break-words">
              Room: {roomId}
            </h2>
            <button
              onClick={copyRoomId}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
            >
              Copy ID
            </button>
            {copySuccess && (
              <span className="text-green-400 block mt-1 text-sm">
                {copySuccess}
              </span>
            )}
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Users in Room:</h3>
            <ul className="space-y-1 text-sm">
              {users.map((user, idx) => (
                <li key={idx} className="truncate">
                  {user}..
                </li>
              ))}
            </ul>
          </div>

          {typing && <p className="text-yellow-400 text-sm mb-4">{typing}</p>}

          <div className="mb-4">
            <label htmlFor="language" className="block mb-1 text-sm">
              Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </div>

        <button
          onClick={leaveRoom}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
        >
          Leave Room
        </button>
      </div>

      {/* Editor + Output */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="p-4 border-t border-gray-300 bg-white">
          <button
            onClick={runCode}
            className="mb-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            Execute
          </button>

          <textarea
            className="w-full h-32 bg-gray-100 border border-gray-300 rounded p-2 text-sm resize-none mt-2 text-black"
            value={output}
            readOnly
            placeholder="Output will appear here"
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
