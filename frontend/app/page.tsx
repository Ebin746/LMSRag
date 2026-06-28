"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowRight, BookOpen, MessageSquare, ShieldCheck } from "lucide-react";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 flex flex-col ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* Background Glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] transition-colors duration-700 ${isDark ? "bg-blue-900/20" : "bg-blue-500/10"}`} />
        <div className={`absolute bottom-0 right-0 w-[700px] h-[500px] rounded-full blur-[120px] transition-colors duration-700 ${isDark ? "bg-teal-900/20" : "bg-teal-500/10"}`} />
      </div>

      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center shadow-lg">
            <BookOpen className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            LMS RAG
          </span>
        </div>
        <div className="flex items-center gap-6">
          {mounted && <ThemeToggle />}
          <Link href="/login" className="hidden sm:block font-medium hover:text-blue-500 transition">
            Log In
          </Link>
          <Link href="/signup" className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-0.5">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10 mt-12 mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 border border-blue-500/20 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          v1.1.0 is now live
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-4xl mb-8 leading-tight">
          Supercharge your Learning with{" "}
          <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
            AI-Powered RAG
          </span>
        </h1>

        <p className={`text-lg sm:text-xl max-w-2xl mb-12 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          A production-ready Role-Based LMS platform that lets you upload course materials, intelligently search through them, and chat directly with your customized knowledge base.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link href="/chat" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1">
            Enter Dashboard
            <ArrowRight size={20} />
          </Link>
          <Link href="/login" className={`w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all border ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-100"}`}>
            Log In
          </Link>
        </div>

        {/* Features Preview */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full text-left">
          <div className={`p-6 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white/50 border-slate-200"} shadow-xl`}>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-500">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Context</h3>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>Upload PDF course materials and instantly make them searchable across batches and modules.</p>
          </div>

          <div className={`p-6 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white/50 border-slate-200"} shadow-xl`}>
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4 text-teal-500">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Interactive Chat</h3>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>Ask complex questions and receive AI-generated answers directly sourced from your materials.</p>
          </div>

          <div className={`p-6 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white/50 border-slate-200"} shadow-xl`}>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 text-emerald-500">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Role-Based Access</h3>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>Secure access ensuring students, teachers, and admins only see what they're authorized to.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
