"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-14 h-8 rounded-full p-1 ${isDark ? "bg-slate-800" : "bg-slate-300"
        }`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isDark
          ? "translate-x-6 bg-slate-950"
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
  );
}