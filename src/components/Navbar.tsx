"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Language } from "@/types";
import LanguageToggle from "./LanguageToggle";
import { GraduationCap, LogOut, Menu } from "lucide-react";

interface Props {
  language: Language;
  setLanguage: (lang: Language) => void;
  onMenuClick?: () => void;
}

export default function Navbar({ language, setLanguage, onMenuClick }: Props) {
  const { data: session, status } = useSession();
  const isAmharic = language === "amharic";

  const handleSignOut = () => {
    if (window.confirm(isAmharic ? "በእርግጥ መውጣት ይፈልጋሉ?" : "Are you sure you want to sign out?")) {
      signOut({ callbackUrl: "/" });
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden p-1 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu size={24} />
          </button>
        )}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#1a7a4c] p-2 rounded-lg group-hover:bg-[#135c39] transition-colors">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-[#1a1a2e] leading-none">የኔታ</h1>
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Yeneta</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <LanguageToggle language={language} setLanguage={setLanguage} />
        
        <div className="h-6 w-px bg-gray-200"></div>

        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <img src={session.user.image || ""} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
              <span className="text-sm font-semibold text-gray-700 truncate max-w-[100px]">
                {session.user.name?.split(" ")[0]}
              </span>
            </div>
            <button onClick={handleSignOut} className="p-2 text-gray-400 hover:text-[#e63946] hover:bg-red-50 rounded-full transition-colors" title={isAmharic ? "ውጣ" : "Sign Out"}>
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button onClick={() => signIn("google")} className="text-sm font-semibold text-[#1a7a4c] hover:bg-green-50 px-4 py-2 rounded-full border border-[#1a7a4c] transition-colors">
            {isAmharic ? "ግባ" : "Sign In"}
          </button>
        )}
      </div>
    </nav>
  );
}
