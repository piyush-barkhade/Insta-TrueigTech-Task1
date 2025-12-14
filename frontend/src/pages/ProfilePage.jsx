import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import ProfileHeader from "../components/ProfileHeader";
import ProfileTabs from "../components/ProfileTabs";
import ProfilePosts from "../components/ProfilePosts";
import FollowListModal from "../components/FollowListModal";

export default function ProfilePage() {
  const { id } = useParams();
  const userId = id;

  const [modalType, setModalType] = useState(null);
  const loggedInUserId = localStorage.getItem("userId");

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await api.get(`/users/${userId}`);
        setProfileData(res.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        Loading Profile...
      </div>
    );
  }

  if (!profileData || !profileData.user) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        User not found.
      </div>
    );
  }

  const { user, posts } = profileData;

  const isOwnProfile = user._id === loggedInUserId;
  const isCurrentlyFollowing = user.followers.some(
    (follower) => follower._id === loggedInUserId
  );

  const listToShow =
    modalType === "followers" ? user.followers : user.following;

  const renderPlaceholder = () => {
    let message = "";
    switch (activeTab) {
      case "reels":
        message = "No Reels available.";
        break;
      case "saved":
        message = "Only you can see what you've saved.";
        break;
      case "tagged":
        message = "No photos or videos where you were tagged are available.";
        break;
      default:
        message = "Content not available.";
    }
    return <div className="text-center p-20 text-gray-500">{message}</div>;
  };

  return (
    <div className="bg-white min-h-screen flex">
      <Sidebar />

      <div className="flex-1 pt-12 md:pl-20 px-4 md:px-0 min-w-0 ml-56">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader
            user={user}
            postsCount={posts.length}
            isOwnProfile={isOwnProfile}
            initialIsFollowing={isCurrentlyFollowing}
            openModal={setModalType}
          />

          {modalType && listToShow && (
            <FollowListModal
              title={modalType === "followers" ? "Followers" : "Following"}
              users={listToShow}
              onClose={() => setModalType(null)}
            />
          )}

          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "posts" ? (
            <ProfilePosts posts={posts} />
          ) : (
            renderPlaceholder()
          )}
        </div>
      </div>
    </div>
  );
}
