"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Language } from "@/types";
import LanguageToggle from "./LanguageToggle";
import { GraduationCap, Menu, Square, Moon, Sun, X, Sidebar as SidebarIcon } from "lucide-react";
import { subscribeToTTS, stopSpeaking } from "@/lib/speech";
import { useTheme } from "next-themes";

interface Props {
  language: Language;
  setLanguage: (lang: Language) => void;
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export default function Navbar({ language, setLanguage, onMenuClick, isSidebarOpen }: Props) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const handleToggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const unsubscribe = subscribeToTTS(setIsAudioPlaying);
    return () => { unsubscribe(); };
  }, []);

  return (
    <div className="p-3 pb-0">
      <nav className="flex justify-between items-center px-4 md:px-6 w-full bg-surface/95 backdrop-blur-xl rounded-2xl h-[60px] shadow-sm border border-border-subtle gap-4">
        
        {/* Left: Sidebar Toggle & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {onMenuClick && (
            <button 
              onClick={onMenuClick} 
              className="p-2 -ml-2 text-content-muted hover:bg-surface-hover hover:text-content rounded-lg transition-colors active:scale-95 shrink-0"
              title="Toggle Sidebar"
            >
              {/* On mobile it's an X or Menu, on desktop it's a sleek Sidebar icon */}
              <div className="md:hidden">
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
              <div className="hidden md:block">
                <SidebarIcon size={20} className={isSidebarOpen ? "text-primary" : "text-content-muted"} />
              </div>
            </button>
          )}
          
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-primary p-2 rounded-xl shadow-sm border border-primary/20 group-hover:brightness-110 transition-all shrink-0">
              <GraduationCap className="text-content-inverse" size={20} />
            </div>
            <div className="flex flex-col justify-center truncate">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-content leading-none font-headline truncate">Yeneta</h1>
              <span className="hidden sm:block text-[0.5rem] font-bold text-primary tracking-[0.2em] uppercase mt-0.5 font-label opacity-80 truncate">የኔታ</span>
            </div>
          </Link>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-auto">
          {isAudioPlaying && (
            <button 
              onClick={stopSpeaking} 
              className="flex items-center gap-2 px-3 py-1.5 bg-error-muted text-error-text border border-error-base/50 rounded-full hover:bg-error-base/20 transition-colors animate-pulse text-[0.6875rem] font-bold tracking-wide shadow-sm"
            >
              <Square size={12} fill="currentColor" /> <span className="hidden sm:inline">Stop Audio</span>
            </button>
          )}

          <div className="flex items-center gap-2 md:gap-3">
            {mounted && (
              <button
                onClick={handleToggleTheme}
                className="flex items-center gap-1 p-1 rounded-full bg-background border border-border-strong hover:bg-surface-hover transition-all duration-200 group shrink-0 shadow-sm"
                aria-label="Toggle theme"
              >
                <div className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${resolvedTheme !== "dark" ? 'bg-primary text-content-inverse shadow-sm' : 'text-content-muted group-hover:text-content'}`}>
                  <Sun size={14} />
                </div>
                <div className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${resolvedTheme === "dark" ? 'bg-primary text-content-inverse shadow-sm' : 'text-content-muted group-hover:text-content'}`}>
                  <Moon size={14} />
                </div>
              </button>
            )}

            <LanguageToggle language={language} setLanguage={setLanguage} />
          </div>
        </div>
      </nav>
    </div>
  );
}
