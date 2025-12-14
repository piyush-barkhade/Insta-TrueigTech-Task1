import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/api";
import { LogIn, User } from "lucide-react";

export default function RightPanel() {
  const userId = localStorage.getItem("userId");

  const [loggedInUser, setLoggedInUser] = useState(null);

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      if (!userId) return;
      try {
        const res = await api.get(`/users/${userId}`);
        setLoggedInUser(res.data.user);
      } catch (error) {
        console.error("Failed to fetch logged-in user profile:", error);
      }
    };

    fetchLoggedInUser();
  }, [userId]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!userId) return;
      try {
        const res = await api.get("/users/suggestions");
        setSuggestions(res.data);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [userId]);

  const handleFollow = async (suggestedId) => {
    try {
      await api.put(`/users/${suggestedId}/follow`);

      setSuggestions((prev) => prev.filter((user) => user._id !== suggestedId));
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  if (!userId || !loggedInUser) {
    return (
      <aside className="w-80 hidden lg:block fixed right-0 top-0 h-screen bg-gray-50 pt-8 px-6 z-50">
        <div className="p-4 rounded-lg border border-gray-200 text-center">
                    <LogIn size={32} className="mx-auto mb-3 text-gray-500" /> 
          <p className="text-sm font-semibold mb-2">
            Discover people you know!
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Log in or sign up to see suggested users and connect.
          </p>
          <Link
            to="/login"
            className="w-full inline-block bg-blue-500 text-white text-sm font-semibold py-1.5 rounded-md hover:bg-blue-600 transition"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="w-full inline-block mt-2 text-blue-500 text-sm font-semibold py-1.5 rounded-md hover:text-blue-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 hidden lg:block fixed right-0 top-0 h-screen bg-gray-50 pt-8 px-6 z-50">
      <div className="sticky top-10">
        <Link
          to={`/profile/${userId}`}
          className="flex items-center justify-between mb-6 hover:bg-gray-50 rounded-md p-2 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
              {loggedInUser.profilePic ? (
                <img
                  src={loggedInUser.profilePic}
                  alt={`${loggedInUser.username}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={24} className="text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">{loggedInUser.username}</p>
              <p className="text-xs text-gray-500">{loggedInUser.name}</p> 
            </div>
          </div>
          <span className="text-blue-500 text-xs font-semibold">Switch</span> 
        </Link>
        <div className="flex justify-between mb-4 px-2">
          <p className="text-sm font-semibold text-gray-500">
            Suggested for you
          </p>
          <p className="text-xs font-semibold cursor-pointer">See All</p>
        </div>
        {suggestions.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center mb-4 px-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={`${user.username}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  <Link to={`/profile/${user._id}`}> {user.username}</Link>
                </p>
                <p className="text-xs text-gray-500">Suggested for you</p>
              </div>
            </div>
            <button
              onClick={() => handleFollow(user._id)}
              className="text-blue-500 text-xs font-semibold"
            >
              Follow
            </button>
          </div>
        ))}
        {suggestions.length === 0 && (
          <p className="text-xs text-gray-500 px-2">
            No new suggestions at the moment.
          </p>
        )}
        <div className="px-2 mt-6">
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400">
            {[
              "About",
              "Help",
              "Press",
              "API",
              "Jobs",
              "Privacy",
              "Terms",
              "Locations",
              "Language",
              "Meta Verified",
            ].map((item, i) => (
              <span key={i} className="cursor-pointer hover:underline">
                {item}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4 px-2">
          © 2025 INSTARIGHT BY PIYUSH BARKHADE
        </p>
      </div>
    </aside>
  );
}
