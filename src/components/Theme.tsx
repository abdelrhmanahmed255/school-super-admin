/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "./providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";

function SunIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M12.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
      <path
        strokeLinecap="round"
        d="M10 5.5v-1M13.182 6.818l.707-.707M14.5 10h1M13.182 13.182l.707.707M10 15.5v-1M6.11 13.889l.708-.707M4.5 10h1M6.11 6.111l.708.707"
      />
    </svg>
  );
}

function MoonIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M15.224 11.724a5.5 5.5 0 0 1-6.949-6.949 5.5 5.5 0 1 0 6.949 6.949Z" />
    </svg>
  );
}

const ChangeTheme = () => {
  const { mode, setMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  const newMode = mode === "dark" ? "light" : "dark";

  const toggleTheme = useCallback(() => {
    setMode(newMode);
    localStorage.setItem("theme", newMode);
    document.documentElement.classList.toggle("dark", newMode === "dark");
  }, [newMode, setMode]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex  h-8 w-8 items-center justify-center rounded-md p-[2px] outline-none transition-all duration-300 hover:bg-zinc-900/5 dark:hover:bg-white/5"
      aria-label={mounted ? `Switch to ${newMode} theme` : "Toggle theme"}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block text-white" />
    </button>
  );
};

export default ChangeTheme;
