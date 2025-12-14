import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Modal from "./Modal";
import PostCard from "./PostCard";
import { Loader2 } from "lucide-react";

export default function ProfilePosts({ posts }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [error, setError] = useState(null);

  const fetchPostDetails = async (postId) => {
    setLoadingPost(true);
    setError(null);
    setModalOpen(true);

    try {
      const res = await api.get(`/posts/${postId}`);
      setSelectedPost(res.data);
    } catch (err) {
      console.error("Failed to fetch post details:", err);
      setError("Could not load post details.");
      setSelectedPost(null);
    } finally {
      setLoadingPost(false);
    }
  };

  const handlePostClick = (e, postId) => {
    e.preventDefault();
    fetchPostDetails(postId);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
    setError(null);
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center p-20 text-gray-500">
        No posts have been uploaded yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 border-t border-gray-300 pt-6">
        {posts.map((post) => (
          <a
            key={post._id}
            href={`/posts/${post._id}`}
            onClick={(e) => handlePostClick(e, post._id)}
            className="aspect-square bg-gray-200 cursor-pointer overflow-hidden relative group"
          >
            <img
              src={post.image}
              alt={`Post by ${post.user.username}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-300">
              <div className="flex gap-4 text-lg font-bold">
                <span>❤️ {post.likes?.length || 0}</span>
                <span>💬 {post.comments?.length || 0}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={
          selectedPost?.user?.username
            ? `${selectedPost.user.username}'s Post`
            : "Post"
        }
      >
        {loadingPost && (
          <div className="p-10 flex justify-center items-center">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        )}

        {error && <div className="p-10 text-center text-red-500">{error}</div>}

        {selectedPost && !loadingPost && <PostCard post={selectedPost} />}

        {!selectedPost && !loadingPost && !error && (
          <div className="p-10 text-center text-gray-500">
            Select a post to view details.
          </div>
        )}
      </Modal>
    </>
  );
}
