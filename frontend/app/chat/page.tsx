"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Chat from "../../components/chat";
import Upload from "../../components/upload";

export default function ChatPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      <div className="max-w-6xl mx-auto space-y-8">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              LMS RAG
            </h1>

            <p className="text-sm text-gray-500">
              {user
                ? `${user.name} (${user.role})`
                : "Guest User"}
            </p>
          </div>

          {user ? (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.reload();
              }}
              className="text-red-600 font-semibold"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="text-blue-600 font-semibold"
            >
              Login
            </button>
          )}

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {user?.role === "admin" && (
            <Upload />
          )}

          <Chat />

        </div>

      </div>

    </div>
  );
}