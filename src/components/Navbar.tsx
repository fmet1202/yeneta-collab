"use client";

import Link from "next/link";
import { Language } from "@/types";
import LanguageToggle from "./LanguageToggle";
import { GraduationCap } from "lucide-react";

interface Props {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function Navbar({ language, setLanguage }: Props) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-[#1a7a4c] p-2 rounded-lg group-hover:bg-[#135c39] transition-colors">
          <GraduationCap className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e] leading-none">የኔታ</h1>
          <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">Yeneta</span>
        </div>
      </Link>

      <LanguageToggle language={language} setLanguage={setLanguage} />
    </nav>
  );
}
