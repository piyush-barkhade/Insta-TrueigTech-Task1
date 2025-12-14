import { Grid, Bookmark, User, Film } from "lucide-react";

export default function ProfileTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "posts", label: "POSTS", icon: Grid },
    { id: "reels", label: "REELS", icon: Film },
    {
      id: "saved",
      label: "SAVED",
      icon: Bookmark,
      className: "hidden sm:flex",
    },
    { id: "tagged", label: "TAGGED", icon: User },
  ];

  return (
    <div className="flex justify-center border-t border-gray-200 mt-10 mb-4">
      <div className="flex gap-8 sm:gap-14 text-gray-500 font-semibold text-xs tracking-wider">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pt-3 cursor-pointer transition ${
                tab.className || ""
              } ${
                isActive
                  ? "border-t border-black text-black"
                  : "hover:text-gray-400"
              }`}
            >
              <Icon size={14} /> {tab.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
