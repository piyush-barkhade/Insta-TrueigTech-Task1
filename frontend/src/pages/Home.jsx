import { useState, useEffect } from "react";
import { isAuthenticated } from "../utils/auth";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import PostCard from "../components/PostCard";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import TopStories from "../components/TopStories";

const StoriesSkeleton = () => (
  <div className="max-w-4xl mx-auto flex gap-8 overflow-hidden mb-8 p-4 bg-white border border-gray-200 rounded-lg animate-pulse">
    {[...Array(9)].map((_, i) => (
      <div key={i} className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-300 ring-2 ring-gray-400"></div>
        <div className="h-2 w-10 mt-1 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white border rounded mb-6 max-w-3xl mx-auto animate-pulse">
    <div className="p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="w-full h-96 bg-gray-400"></div>
    <div className="p-3 space-y-2">
      <div className="flex gap-4 mb-2">
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
      </div>
      <div className="h-3 w-20 bg-gray-200 rounded"></div>
      <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function Home() {
  const isLoggedIn = isAuthenticated();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      api
        .get("/posts/feed")
        .then((res) => setPosts(res.data))
        .catch((error) => console.error("Failed to fetch feed:", error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const renderFeed = () => {
    if (loading) {
      return (
        <div className="flex-1 min-w-0 pt-8 md:pt-12">
          <div className="max-w-4xl mx-auto">
            <StoriesSkeleton />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      );
    }
    return (
      <div className="flex-1 min-w-0 pt-8 md:pt-8">
        <div className="max-w-4xl mx-auto">
          <TopStories />

          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="text-center p-20 text-gray-500 border border-gray-200 rounded-lg bg-white mt-8">
              <p className="text-lg font-semibold">You're All Caught Up!</p>
              No posts in your feed yet.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderUnauthenticatedPrompt = () => {
    return (
      <div className="flex-1 min-w-0 pt-8 md:pt-12 relative">
        <div className="max-w-4xl mx-auto opacity-50 pointer-events-none">
          <StoriesSkeleton />
          <SkeletonCard />
        </div>
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-50/70">
          <div className="text-center p-8 max-w-sm bg-white border border-gray-300 rounded-lg shadow-xl">
            <LogIn size={48} className="mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Log in to Access Your Feed
            </h2>
            <p className="text-gray-600 mb-6">
              Join our community to start following friends, sharing moments,
              and exploring content.
            </p>
            <Link
              to="/login"
              className="w-full inline-block bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="w-full inline-block mt-3 text-blue-500 font-semibold py-2"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      <Sidebar className="z-50" />
      <div className="flex-1 flex justify-center">
        {isLoggedIn ? renderFeed() : renderUnauthenticatedPrompt()}
      </div>
      <RightPanel className="z-50" />
    </div>
  );
}
