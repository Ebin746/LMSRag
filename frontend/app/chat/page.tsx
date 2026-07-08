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
          <div className="max-w-7xl mx-auto px-6 py-8 w-full overflow-y-auto space-y-8">
            {/* Page Title */}
            <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Knowledge Base Management</h1>
                <p className="text-sm text-slate-500">Upload and manage course materials for the AI knowledge base</p>
              </div>
            </div>

            {/* Upload Component */}
            <div className="max-w-2xl">
              <Upload />
            </div>

            {/* Documents List */}
            <UploadedDocuments />
          </div>
        ) : (
          /* Student / Teacher View: Full height chat */
          <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto flex flex-col relative">
             <Chat />
          </div>
        )}
      </main>
    </div>
  );
}