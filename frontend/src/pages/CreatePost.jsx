import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { Image, Menu, Upload } from "lucide-react";

export default function CreatePost() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!imageUrl || !caption) {
      alert("Please provide both an image URL and a caption.");
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post("/posts", {
        image: imageUrl,
        caption: caption,
      });
      navigate("/");
    } catch (error) {
      console.error("Post creation failed:", error);
      alert("Failed to create post. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <button
        className="fixed top-4 left-4 z-[99] md:hidden p-2 bg-white rounded-full shadow-lg border border-gray-200"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <div className="flex-1 flex justify-center items-start pt-16 md:pt-8 pb-8">
        <form
          onSubmit={submit}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl lg:max-w-3xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
        >
          <div className="md:w-3/5 bg-gray-100 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-200">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Post Preview"
                className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/600x400.png?text=Invalid+Image+URL";
                }}
              />
            ) : (
              <div className="text-center p-8 text-gray-500">
                <Image size={64} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold">Start a new post</p>
                <p className="text-sm mt-1">
                  Paste an image URL to see a preview.
                </p>
              </div>
            )}
          </div>
          <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between">
            <h2 className="text-2xl font-serif mb-6 border-b pb-3 text-gray-700">
              Write Caption
            </h2>
            <div className="space-y-6 flex-1">
              <input
                name="image"
                placeholder="Paste Image URL here..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border border-gray-300 p-3 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
              <textarea
                name="caption"
                placeholder="Write a compelling caption..."
                rows="6"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-bold text-lg mt-8 transition-colors ${
                isSubmitting
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? (
                "Sharing..."
              ) : (
                <>
                  <Upload size={20} className="inline mr-2" /> Share Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
