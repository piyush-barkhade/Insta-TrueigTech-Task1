import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Smile,
  User,
} from "lucide-react";
import api from "../api/api";
import CommentsDisplay from "./CommentsDisplay";
import Modal from "./Modal";

const CommentInput = ({
  newCommentText,
  setNewCommentText,
  handleAddComment,
  isCommenting,
}) => {
  return (
    <form
      className="py-2 flex items-center border-t border-gray-100"
      onSubmit={handleAddComment}
    >
      <button
        type="button"
        className="text-gray-400 p-2 hover:text-gray-600 transition"
      >
        <Smile size={24} />
      </button>
      <input
        type="text"
        placeholder="Add a comment..."
        value={newCommentText}
        onChange={(e) => setNewCommentText(e.target.value)}
        className="flex-1 p-2 focus:outline-none text-sm"
        disabled={isCommenting}
      />
      <button
        type="submit"
        className={`font-semibold text-sm mr-2 transition ${
          newCommentText.trim()
            ? "text-blue-500 hover:text-blue-600"
            : "text-blue-300 cursor-default"
        }`}
        disabled={!newCommentText.trim() || isCommenting}
      >
        {isCommenting ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default function PostCard({ post }) {
  const userId = localStorage.getItem("userId");
  const [currentPost, setCurrentPost] = useState(post);
  const [newCommentText, setNewCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const isLiked = currentPost.likes.includes(userId);

  const handleAddComment = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newCommentText.trim() || isCommenting) return;

      setIsCommenting(true);
      const text = newCommentText.trim();
      const postId = currentPost._id;

      setNewCommentText("");

      const tempComment = {
        _id: Date.now(),
        user: {
          _id: userId,
          username: "You",
          profilePic: null,
        },
        text: text,
        createdAt: new Date().toISOString(),
        isTemporary: true,
      };

      setCurrentPost((prev) => ({
        ...prev,
        comments: [...prev.comments, tempComment],
      }));

      try {
        await api.post(`/posts/${postId}/comment`, { text });
      } catch (error) {
        console.error("Failed to add comment:", error);
        alert("Failed to post comment.");
      } finally {
        setIsCommenting(false);
        setShowComments(true);
      }
    },
    [newCommentText, isCommenting, currentPost._id, userId]
  );

  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const newLikes = isLiked
      ? currentPost.likes.filter((id) => id !== userId)
      : [...currentPost.likes, userId];

    const previousLikes = currentPost.likes;
    setCurrentPost({ ...currentPost, likes: newLikes });

    try {
      await api.put(`/posts/${currentPost._id}/like`);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setCurrentPost({ ...currentPost, likes: previousLikes });
    } finally {
      setIsLiking(false);
    }
  };

  const commentInputProps = useMemo(
    () => ({
      newCommentText,
      setNewCommentText,
      handleAddComment,
      isCommenting,
    }),
    [newCommentText, handleAddComment, isCommenting]
  );

  return (
    <>
      <div className="bg-white border rounded mb-6 max-w-3xl mx-auto shadow-sm">
        <div className="p-3 flex items-center gap-3 border-b border-gray-100">
          <Link to={`/profile/${currentPost.user._id}`}>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
              {currentPost.user.profilePic ? (
                <img
                  src={currentPost.user.profilePic}
                  alt={currentPost.user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-gray-500" />
              )}
            </div>
          </Link>
          <Link
            to={`/profile/${currentPost.user._id}`}
            className="text-sm font-semibold hover:underline"
          >
            {currentPost.user.username}
          </Link>
        </div>

        <div className="w-full bg-black flex items-center justify-center">
          <img
            src={currentPost.image}
            alt="Post"
            className="w-full object-contain"
          />
        </div>
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-4">
              <button
                onClick={handleToggleLike}
                disabled={isLiking}
                className="transition transform hover:scale-110"
              >
                <Heart
                  size={28}
                  className={
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
                  }
                />
              </button>
              <button
                onClick={() => setShowComments(true)}
                className="transition transform hover:scale-110"
              >
                <MessageCircle size={28} className="text-gray-700" />
              </button>
              <Send size={28} className="text-gray-700 cursor-not-allowed" />
            </div>
            <Bookmark size={28} className="text-gray-700 cursor-not-allowed" />
          </div>

          <p className="text-sm font-semibold mb-2">
            {currentPost.likes.length}{" "}
            {currentPost.likes.length === 1 ? "like" : "likes"}
          </p>

          <p className="text-sm mb-2 break-words">
            <Link
              to={`/profile/${currentPost.user._id}`}
              className="font-semibold mr-1 hover:underline"
            >
              {currentPost.user.username}
            </Link>
            {currentPost.caption}
          </p>

          {currentPost.comments.length > 0 && (
            <button
              onClick={() => setShowComments(true)}
              className="text-sm text-gray-500 mb-2 hover:underline focus:outline-none"
            >
              View all {currentPost.comments.length} comments
            </button>
          )}

          <CommentInput {...commentInputProps} />
        </div>
      </div>

      <Modal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        title="Comments"
      >
        <CommentsDisplay postId={currentPost._id} />

        <div className="border-t border-gray-200 p-2">
          <CommentInput {...commentInputProps} />
        </div>
      </Modal>
    </>
  );
}
