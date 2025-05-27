import { useState } from "react";
import { MessageCircleReply, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { createDiscussion, deleteProblemDiscussion } from "@/http/api";
import { toast } from "sonner";

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

const deleteDiscussion = async (id: string) => {
  const { data } = await deleteProblemDiscussion(id);
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
  const queryClient = useQueryClient();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["discussion"],
    mutationFn: async (discussionData: any) => {
      const { data } = await createDiscussion(discussionData);
      return data;
    },
    onSuccess: () => {
      setReplyContent("");
      setShowReplyInput(false);
      toast.success("discussuion added");
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["discussion"] });
    },
  });

  // Mutation to delete comment
  const deleteProblemDiscussion = useMutation({
    mutationKey: ["discussion", parentId],
    mutationFn: (parentId: string) => deleteDiscussion(parentId!),
    onSuccess: () => {
      setShowDeleteModal(false);
      toast.success("discussion deleted");
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["discussion"] });
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

        <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-orange-600 to-orange-400 text-white rounded-full flex items-center justify-center font-bold shadow-md">
          {name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4 transition-all shadow-sm group-hover:shadow-md">
          <div className="text-sm font-medium text-primary">{name}</div>
          <p className="mt-1 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {comment}
          </p>

          <div className="mt-2 flex gap-3 text-xs text-gray-400 items-center">
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

            <button
              onClick={() => setShowDeleteModal(true)}
              className="hover:text-red-500 ml-auto transition-colors"
              title="Delete comment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

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

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full space-y-4 text-center">
            <h2 className="text-lg font-semibold text-white">Delete Comment</h2>
            <p className="text-sm text-gray-300">
              Are you sure you want to delete this comment?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteProblemDiscussion.mutate(parentId!);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
