import { Link } from "react-router-dom";
import { User, X } from "lucide-react";

export default function FollowListModal({ title, users, onClose }) {
  if (!users) return null;

  return (
    <div
      className="fixed inset-0  bg-opacity-60 z-[100] flex justify-center items-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-100"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-grow space-y-3">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <Link
                  to={`/profile/${user._id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg flex-grow"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex-shrink-0 flex items-center justify-center">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-gray-500" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.name}</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-5">
              {title === "Followers"
                ? "No followers yet."
                : "Not following anyone."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
