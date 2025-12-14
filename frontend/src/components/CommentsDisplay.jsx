import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { User } from "lucide-react";

const timeAgo = (dateString) => {
  if (!dateString) {
    return "Unknown time";
  }

  const commentDate = new Date(dateString);

  if (isNaN(commentDate.getTime())) {
    console.error("Invalid date string received by timeAgo:", dateString);
    return "Invalid Date Format";
  }

  const seconds = Math.floor((new Date() - commentDate) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return commentDate.toLocaleDateString();
};

export default function CommentsDisplay({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/posts/${postId}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError("Could not load comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading comments...</div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 max-h-96 overflow-y-auto">
      {comments.length === 0 ? (
        <div className="text-center text-gray-500">No comments yet.</div>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="mb-3 flex items-start gap-3 text-sm"
          >
            <Link to={`/profile/${comment.user._id}`} className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {comment.user.profilePic ? (
                  <img
                    src={comment.user.profilePic}
                    alt={comment.user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={18} className="text-gray-500" />
                )}
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <p className="break-words">
                <Link
                  to={`/profile/${comment.user._id}`}
                  className="font-semibold mr-1 hover:underline"
                >
                  {comment.user.username}
                </Link>
                {comment.text}
              </p>

              <span className="text-xs text-gray-500 mt-1 block">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
