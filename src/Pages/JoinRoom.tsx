import { useAuthStore } from "@/store/store";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const JoinRoom = () => {
  const { user } = useAuthStore();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
  }, [user]);

  const joinRoom = () => {
    if (roomId && userName) {
      navigate(`/auth/editor/${roomId}`, { state: { userName } });
    }
  };

  const generateRoomId = () => {
    const newId = uuidv4();
    setRoomId(newId);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Join Code Room
        </h1>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Room ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <button
              onClick={generateRoomId}
              className="bg-indigo-500 text-white px-3 py-2 rounded-md hover:bg-indigo-600 transition"
            >
              Generate
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />
        </div>

        <button
          onClick={joinRoom}
          disabled={!roomId || !userName}
          className={`w-full py-2 rounded-md text-white font-medium transition ${
            roomId && userName
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
