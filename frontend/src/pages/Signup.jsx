import { useState } from "react";
import api from "../api/api";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
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
      await api.post("/auth/signup", form);
      window.location = "/login";
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-[350px]">
        <div className="bg-white border border-gray-300 px-10 py-8">
          <h1 className="text-4xl font-serif text-center mb-4">InstaRight</h1>

          <p className="text-center text-gray-500 text-sm font-semibold mb-4">
            Sign up to see photos and videos from your friends.
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={submit} className="flex flex-col gap-2">
            <input
              name="email"
              placeholder="Mobile Number or Email"
              className="border border-gray-300 bg-gray-50 px-2 py-2 text-sm rounded focus:outline-none focus:border-gray-400"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="username"
              placeholder="Username"
              className="border border-gray-300 bg-gray-50 px-2 py-2 text-sm rounded focus:outline-none focus:border-gray-400"
              value={form.username}
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
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            By signing up, you agree to our Terms, Privacy Policy and Cookies
            Policy.
          </p>
        </div>

        <div className="bg-white border border-gray-300 text-center py-4 mt-2">
          <p className="text-sm">
            Have an account?
            <a href="/login" className="text-[#0095f6] font-semibold">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
