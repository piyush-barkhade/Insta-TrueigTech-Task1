import { useState } from "react";
import api from "../api/api";

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
      setError("Sorry, your password was incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-[350px]">
        <div className="bg-white border border-gray-300 px-10 py-8">
          <h1 className="text-4xl font-serif text-center mb-8">Instagram</h1>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={submit} className="flex flex-col gap-2">
            <input
              name="email"
              placeholder="Phone number, username, or email"
              className="border border-gray-300 bg-gray-50 px-2 py-2 text-sm rounded focus:outline-none focus:border-gray-400"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="border border-gray-300 bg-gray-50 px-2 py-2 text-sm rounded focus:outline-none focus:border-gray-400"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              disabled={loading}
              className="mt-2 bg-[#0095f6] text-white text-sm font-semibold py-1.5 rounded disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="h-px bg-gray-300" />
            <span className="mx-4 text-xs text-gray-500 font-semibold">OR</span>
            <div className="h-px bg-gray-300" />
          </div>

          <p className="text-center text-sm text-[#385185] font-semibold cursor-pointer">
            Log in with Facebook
          </p>

          <p className="text-center text-xs text-blue-900 mt-4 cursor-pointer">
            Forgot password?
          </p>
        </div>

        <div className="bg-white border border-gray-300 text-center py-4 mt-2">
          <p className="text-sm">
            Don’t have an account?{" "}
            <a href="/signup" className="text-[#0095f6] font-semibold">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
