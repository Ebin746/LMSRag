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

  const isAdmin = user?.role === "admin";

  return (
    <div className="h-screen bg-white flex flex-col text-slate-900 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 flex-shrink-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Nestsoft</span>
              <span className="ml-2 text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:inline">
                {isAdmin ? "Admin Panel" : "Learning Portal"}
              </span>
            </div>
          </div>

          {/* User Info + Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>
            )}
            {user ? (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.reload();
                }}
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {isAdmin ? (
          <div className="flex-1 w-full bg-gradient-to-br from-slate-50 to-blue-50/50 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto space-y-6">
              
              {/* Vibrant Dashboard Header */}
              <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-3xl p-8 sm:p-10 shadow-xl shadow-blue-900/20 relative overflow-hidden">
                {/* Decorative glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
                
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Knowledge Base Admin</h1>
                      <p className="text-blue-200 text-sm sm:text-base font-medium max-w-xl">
                        Manage course materials, embed new documents, and oversee the AI's training data.
                      </p>
                    </div>
                  </div>
                  <div className="hidden lg:flex px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-blue-100 text-sm font-semibold items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    System Online
                  </div>
                </div>
              </div>

              {/* Side-by-Side Dashboard Layout */}
              <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                
                {/* Upload Section (Left sidebar - 4 columns) */}
                <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
                  <Upload />
                </div>

                {/* Documents Section (Right main area - 8 columns) */}
                <div className="lg:col-span-8">
                  <UploadedDocuments />
                </div>
                
              </div>
            </div>
          </div>
        ) : (
          /* Student / Teacher View: Chat Box */
          <div className="flex-1 min-h-0 w-full max-w-5xl mx-auto flex flex-col relative p-4 sm:p-6 lg:p-8">
             <Chat />
          </div>
        )}
      </main>
    </div>
  );
}