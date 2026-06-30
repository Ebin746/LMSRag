"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Chat from "../../components/chat";
import Upload from "../../components/upload";
import UploadedDocuments from "../../components/uploaded-documents";

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
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header - Glassmorphism */}
        <div className="flex justify-between items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 rounded-2xl transition-all">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-tight">
              LMS RAG
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              {user ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {user.name} <span className="uppercase text-xs tracking-wider opacity-70 border border-slate-300 dark:border-slate-600 px-2 py-0.5 rounded-full ml-1">{user.role}</span>
                </span>
              ) : "Guest User"}
            </p>
          </div>

          {user ? (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.reload();
              }}
              className="text-sm font-semibold px-5 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-all shadow-sm"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="text-sm font-semibold px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transition-all"
            >
              Login
            </button>
          )}

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {user?.role === "admin" && (
            <div className="w-full">
              <Upload />
            </div>
          )}

          <div className="w-full">
            <Chat />
          </div>

        </div>

        {user?.role === "admin" && (
          <div className="w-full mt-8">
            <UploadedDocuments />
          </div>
        )}

      </div>

    </div>
  );
}