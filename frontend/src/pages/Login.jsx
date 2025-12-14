import { useState } from "react";
import api from "../api/api";
import { Facebook, Loader2 } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      window.location = "/";
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      if (backendMessage) {
        setError(backendMessage);
      } else {
        setError("Login failed. Please check your network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-[350px]">
        <div className="bg-white border border-gray-300 px-10 py-8">
          <h1 className="text-4xl font-serif text-center mb-8 font-extrabold">
            <span
              className="
                bg-clip-text text-transparent bg-gradient-to-r 
                from-indigo-600 via-pink-500 to-yellow-500
              "
            >
              InstaRight
            </span>
          </h1>
          {error && (
            <p className="text-red-600 text-sm text-center mb-4 border border-red-200 bg-red-50 p-2 rounded-md transition-opacity">
              {error}
            </p>
          )}
          <form onSubmit={submit} className="flex flex-col gap-2">
            <input
              name="email"
              placeholder="Phone number, username, or email"
              className="border border-gray-300 bg-gray-50 px-2 py-2 text-sm rounded focus:ring-1 focus:ring-gray-400 focus:outline-none"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="border border-gray-300 bg-gray-50 px-2 py-2 text-sm rounded focus:ring-1 focus:ring-gray-400 focus:outline-none"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              disabled={loading || !form.email || !form.password}
              className="mt-4 bg-[#0095f6] text-white text-sm font-semibold py-1.5 rounded-lg transition-colors duration-300 flex items-center justify-center 
              disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#007edb] focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Log in"
              )}
            </button>
          </form>
          <div className="flex items-center my-4">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="mx-4 text-xs text-gray-500 font-semibold">OR</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>
          <a
            href="#"
            className="flex items-center justify-center text-sm text-[#385185] font-semibold cursor-not-allowed py-1.5 hover:text-[#264070] transition-colors"
          >
            <Facebook size={16} className="mr-2" />
            Log in with Facebook
          </a>
          <a
            href="#"
            className="text-center text-xs text-[#00376B] mt-4 hover:underline block cursor-not-allowed"
          >
            Forgot password?
          </a>
        </div>
        <div className="bg-white border border-gray-300 text-center py-4 mt-2">
          <p className="text-sm">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-[#0095f6] font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
        <div className="text-center mt-6">
                    <p className="text-sm text-gray-700 mb-4">Get the app.</p> 
        </div>
      </div>
    </div>
  );
}
