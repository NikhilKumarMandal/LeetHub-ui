import { useState } from "react";
import { MessageCircle } from "lucide-react";

const CommentCard = () => {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
      <div className="text-white text-sm">
        <p className="font-semibold">User123</p>
        <p className="mt-1 text-gray-300">
          This is a sample comment about the problem.
        </p>
      </div>

      <div className="mt-3 flex items-center text-gray-400 text-xs gap-4">
        <button
          className="flex items-center gap-1 hover:text-blue-400"
          onClick={() => setShowReply(!showReply)}
        >
          <MessageCircle className="w-4 h-4" />
          Reply
        </button>
      </div>

      {/* Reply input */}
      {showReply && (
        <div className="mt-3 pl-4 border-l border-gray-600">
          <textarea
            placeholder="Write a reply..."
            className="w-full p-2 text-sm text-white bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            rows={2}
          />
          <div className="mt-2 flex justify-end">
            <button className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700">
              Post Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
