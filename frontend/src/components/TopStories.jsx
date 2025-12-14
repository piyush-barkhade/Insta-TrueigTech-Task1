export default function TopStories() {
  return (
    <div className="bg-white rounded-lg mb-6 px-4 py-3 overflow-hidden border border-gray-200">
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center flex-shrink-0 w-18"
          >
            <div className="w-18 h-18 rounded-full border-2 border-pink-500 p-[2px]">
              <div className="bg-gray-200 w-full h-full rounded-full" />
            </div>
            <span className="text-xs mt-1 truncate">user{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
