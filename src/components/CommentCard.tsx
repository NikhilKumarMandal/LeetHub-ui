import { useState } from "react";
import { MessageCircle, MessageCircleReply } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createDiscussion } from "@/http/api";
import type { DiscussionData } from "@/Types";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: string;
  content: string;
  parentId: string | null;
  problemId: string;
  user: {
    name: string | null;
  };
  replies?: Comment[];
}

interface CommentCardProps {
  name: string;
  comment: string;
  parentId: string | null;
  problemId: string;
  replies?: Comment[];
  level?: number;
}

const discussion = async (discussionData: DiscussionData) => {
  const { data } = await createDiscussion(discussionData);
  return data;
};

const CommentCard = ({
  name,
  comment,
  parentId,
  problemId,
  replies = [],
  level = 0,
}: CommentCardProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: discussion,
    onSuccess: () => {
      setReplyContent("");
      setShowReplyInput(false);
      // You may want to refetch comments here
    },
  });

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    mutate({
      content: replyContent,
      parentId: parentId ?? undefined,
      problemId,
    });
  };

  return (
    <div className={`relative pl-${Math.min(level * 15, 30)} group`}>
      <div className="flex items-start gap-3 relative">
        {level > 0 && (
          <div className="absolute left-[-1rem] top-6 h-full w-0.5 bg-gray-700 rounded-full" />
        )}

        {/* Avatar */}
        <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-orange-600 to-orange-400 text-white rounded-full flex items-center justify-center font-bold shadow-md">
          {name?.charAt(0).toUpperCase() || "U"}
        </div>

        {/* Comment Box */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4 transition-all shadow-sm group-hover:shadow-md">
          <div className="text-sm font-medium text-primary">{name}</div>
          <p className="mt-1 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {comment}
          </p>

          {/* Action Buttons */}
          <div className="mt-2 flex gap-3 text-xs text-gray-400">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="hover:text-orange-400 flex items-center gap-1 transition-colors"
            >
              <MessageCircleReply className="w-4 h-4" />
              Reply
            </button>
            {replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="hover:text-orange-400 transition-colors"
              >
                {showReplies
                  ? "Hide Replies"
                  : `Show Replies (${replies.length})`}
              </button>
            )}
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {showReplyInput && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                <textarea
                  className="w-full p-3 text-sm bg-gray-800 text-white border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
                  rows={2}
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleReplySubmit}
                    disabled={isPending}
                    className="bg-primary text-white px-4 py-1.5 text-sm rounded-md hover:bg-primary/80 transition disabled:opacity-50"
                  >
                    {isPending ? "Posting..." : "Reply"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nested Replies */}
      <AnimatePresence>
        {showReplies && replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4 ml-6"
          >
            {replies.map((reply) => (
              <CommentCard
                key={reply.id}
                name={reply.user?.name ?? "Anonymous"}
                comment={reply.content}
                parentId={reply.id}
                problemId={reply.problemId}
                replies={reply.replies || []}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentCard;
