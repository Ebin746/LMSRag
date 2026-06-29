"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Moon, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.detail || "Invalid credentials");
      }

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        console.log(data)
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      router.push("/chat");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex min-h-screen relative overflow-hidden items-center justify-center px-4 py-12 transition-colors duration-500 ${
        isDark ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] ${
            isDark ? "bg-blue-900/20" : "bg-blue-500/10"
          }`}
        />

        <div
          className={`absolute bottom-0 right-0 w-[700px] h-[500px] rounded-full blur-[120px] ${
            isDark ? "bg-teal-900/20" : "bg-teal-500/10"
          }`}
        />
      </div>

      {/* Header */}
      <div className="absolute top-0 w-full p-6 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
            <div className="w-5 h-5 bg-white rounded-sm" />
          </div>

          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Skill
          </span>
        </div>

        {mounted && (
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full p-1 transition ${
              isDark ? "bg-slate-800" : "bg-slate-200"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${
                isDark
                  ? "translate-x-6 bg-slate-900"
                  : "translate-x-0 bg-white"
              }`}
            >
              {isDark ? (
                <Moon size={14} className="text-blue-400" />
              ) : (
                <Sun size={14} className="text-yellow-500" />
              )}
            </div>
          </button>
        )}
      </div>

      {/* Card */}
      <div
        className={`w-full max-w-md rounded-3xl p-8 shadow-2xl border ${
          isDark
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="text-center mb-8">
          <h1
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Welcome Back
          </h1>

          <p
            className={`mt-2 text-sm ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Enter your details to access your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className={`block text-sm mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-3 outline-none ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-slate-50 border-slate-200 text-black"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-3 outline-none ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-slate-50 border-slate-200 text-black"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p
            className={`text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            New User?{" "}
            <Link
              href="/signup"
              className="text-blue-600 font-semibold"
            >
              Sign Up
            </Link>
          </p>

          <Link
            href="/"
            className="block mt-3 text-sm text-blue-600 font-semibold"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}