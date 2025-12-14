import { User, Archive, ChevronDown, Pencil, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ProfileHeader({
  user,
  postsCount,
  isOwnProfile,
  initialIsFollowing,
  openModal,
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(user.followers.length);
  const [currentProfilePic, setCurrentProfilePic] = useState(
    user.profilePic || ""
  );
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const settingsRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFollowToggle = async () => {
    try {
      const res = await api.put(`/users/${user._id}/follow`);
      const newFollowingState = res.data.following;

      setIsFollowing(newFollowingState);
      setFollowersCount((prevCount) =>
        newFollowingState ? prevCount + 1 : prevCount - 1
      );
    } catch (error) {
      console.error("Follow/Unfollow failed", error);
    }
  };

  const handleImageEditClick = async () => {
    if (!isOwnProfile) return;
    const imageUrl = prompt("Enter the new image URL (Leave blank to remove):");
    if (imageUrl === null) return;
    const newPic = imageUrl.trim();
    if (newPic.length > 0 && !newPic.startsWith("http")) {
      alert("Please enter a valid URL starting with 'http' or 'https'.");
      return;
    }
    try {
      const payload = { imageUrl: newPic };
      const res = await api.put("/users/profilePic", payload);
      setCurrentProfilePic(res.data.profilePic || "");
      alert(`Profile picture successfully ${newPic ? "updated" : "removed"}!`);
    } catch (error) {
      console.error("Profile picture update failed:", error);
      alert("Failed to update profile picture.");
    }
  };

  const handleOptionClick = (option) => {
    setOpen(false);
    if (option === "logout") {
      localStorage.removeItem("token");
      navigate("/login");
    } else if (option === "edit") {
      console.log("Edit clicked...");
    } else if (option === "cancel") {
    }
  };

  const renderActionButtons = () => {
    if (isOwnProfile) {
      return (
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setOpen(!open)}
            className="text-sm font-semibold py-1 px-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
          >
            <Settings size={24} />
          </button>

          {open && (
            <div className="absolute -right-12 mt-1 w-36 bg-white shadow-lg rounded-md border border-gray-200 z-50">
              <button
                onClick={() => handleOptionClick("edit")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleOptionClick("logout")}
                className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>

              <button
                onClick={() => handleOptionClick("cancel")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      );
    } else {
      if (isFollowing) {
        return (
          <div className="flex gap-2">
            <button
              onClick={handleFollowToggle}
              className="bg-gray-200 text-sm font-semibold py-1 px-3 rounded-lg flex items-center gap-1 hover:bg-gray-300 transition text-black border border-gray-300"
            >
              Following <ChevronDown size={14} />
            </button>
            <button
              className="bg-gray-200 text-sm font-semibold py-1 px-4 rounded-lg hover:bg-gray-300 transition cursor-not-allowed"
              onClick={() => console.log("Navigate to chat")}
            >
              Message
            </button>
          </div>
        );
      } else {
        return (
          <button
            onClick={handleFollowToggle}
            className={`text-sm font-semibold py-1 px-4 rounded-lg transition bg-blue-500 text-white hover:bg-blue-600`}
          >
            Follow
          </button>
        );
      }
    }
  };

  return (
    <div className="mb-10">
      <div className="flex items-start gap-16 mb-6">
        <div className="w-40 h-40 flex-shrink-0 relative">
          <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden border">
            {currentProfilePic ? (
              <img
                src={currentProfilePic}
                alt={`${user.username}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-full h-full p-8 text-gray-500" />
            )}
          </div>

          {isOwnProfile && (
            <button
              onClick={handleImageEditClick}
              title="Change profile picture URL"
              className="absolute bottom-0 right-0 w-10 h-10 bg-gray-200 text-black rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:bg-gray-300 transition"
            >
              <Pencil size={20} />
            </button>
          )}
        </div>

        <div className="flex flex-col pt-4 w-full">
          <div className="flex items-center gap-6 mb-4">
            <h2 className="text-xl font-light">{user.username}</h2>
            {renderActionButtons()}
          </div>

          <div className="hidden sm:flex gap-10 mb-4">
            <p className="font-semibold">
              {postsCount || 0} <span className="font-normal">posts</span>
            </p>
            <p
              className="font-semibold cursor-pointer"
              onClick={() => openModal("followers")}
            >
              {followersCount}
              <span className="font-normal"> followers</span> 
            </p>
            <p
              className="font-semibold cursor-pointer"
              onClick={() => openModal("following")}
            >
              {user.following.length}    
              <span className="font-normal"> following</span>   
            </p>
          </div>
        </div>
      </div>

      <div className="sm:pl-56 -mt-12 sm:-mt-10">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm whitespace-pre-wrap">{user.bio}</p>
      </div>
    </div>
  );
}
