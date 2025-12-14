import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  User,
  LogOut,
  LogIn,
} from "lucide-react";

export default function Sidebar() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const renderAuthLinks = () => {
    if (userId) {
      return (
        <>
          <Link
            className="flex items-center gap-4 font-medium"
            to={`/profile/${userId}`}
          >
            <User size={22} /> Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 text-red-500 font-medium hover:text-red-600 transition cursor-pointer"
          >
            <LogOut size={22} /> Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link className="flex items-center gap-4 font-medium" to="/login">
            <LogIn size={22} /> Login
          </Link>
          <Link className="flex items-center gap-4 font-medium" to="/signup">
            <User size={22} /> Sign Up
          </Link>
        </>
      );
    }
  };

  return (
    <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 border-r bg-white px-6 py-8 z-50">
      <h1 className="text-3xl font-serif mb-10">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500">
          InstaRight
        </span>
        <p className="text-[10px] text-gray-500 mt-1">
          (An Instagram clone for TRUEiGTECH)
        </p>
      </h1>
      <nav className="flex flex-col gap-6 text-[16px]">
        <Link className="flex items-center gap-4 font-medium" to="/">
          <Home size={22} /> Home
        </Link>
        <div className="flex items-center gap-4 cursor-not-allowed text-gray-400">
          <Search size={22} /> Search
        </div>
        <div className="flex items-center gap-4 cursor-not-allowed text-gray-400">
          <Compass size={22} /> Explore
        </div>
        <div className="flex items-center gap-4 cursor-not-allowed text-gray-400">
          <Film size={22} /> Reels
        </div>
        <div className="flex items-center gap-4 cursor-not-allowed text-gray-400">
          <MessageCircle size={22} /> Messages
        </div>
        <div className="flex items-center gap-4 cursor-not-allowed text-gray-400">
          <Heart size={22} /> Notifications
        </div>
        <Link className="flex items-center gap-4" to="/create">
          <PlusSquare size={22} /> Create
        </Link>
        {renderAuthLinks()}
      </nav>
    </aside>
  );
}
