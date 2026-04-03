"use client";

import { MessageSquare, Plus, Trash2, FolderEdit, Folder as FolderIcon } from "lucide-react";
import { Language } from "@/types";

interface SessionMeta {
  id: string;
  title: string;
  updatedAt: number;
  folder?: string;
}

interface Props {
  sessions: SessionMeta[];
  currentSessionId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onMoveToFolder: (id: string, folderName: string) => void;
  language: Language;
}

export default function Sidebar({ sessions, currentSessionId, onSelect, onNew, onDelete, onMoveToFolder, language }: Props) {
  const isAmharic = language === "amharic";

  const groupedSessions = sessions.reduce((acc, session) => {
    const folder = session.folder || "Uncategorized";
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(session);
    return acc;
  }, {} as Record<string, SessionMeta[]>);

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] text-white">
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 bg-[#1a7a4c] hover:bg-[#135c39] transition-colors py-3 rounded-lg font-medium text-sm shadow-md"
        >
          <Plus size={18} />
          {isAmharic ? "አዲስ ውይይት" : "New Chat"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
        {Object.entries(groupedSessions).map(([folderName, folderSessions]) => (
          <div key={folderName} className="space-y-1">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
              <FolderIcon size={12} /> {folderName === "Uncategorized" ? (isAmharic ? "ያልተመደቡ" : "Recent Chats") : folderName}
            </h3>
            
            {folderSessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  currentSessionId === session.id ? "bg-[#1a7a4c]/20 text-[#1a7a4c] border border-[#1a7a4c]/30" : "hover:bg-white/5 text-gray-300"
                }`}
                onClick={() => onSelect(session.id)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare size={16} className="flex-shrink-0 opacity-70" />
                  <div className="truncate text-sm font-medium">
                    {session.title || (isAmharic ? "አዲስ ውይይት" : "New Chat")}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newFolder = prompt(isAmharic ? "የአቃፊ ስም ያስገቡ (ለመሰረዝ ባዶ ይተዉት):" : "Enter folder name (leave blank to remove):", session.folder || "");
                      if (newFolder !== null) onMoveToFolder(session.id, newFolder);
                    }}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                    title="Move to Folder"
                  >
                    <FolderEdit size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if(window.confirm("Are you sure?")) onDelete(session.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-[#e63946] transition-colors"
                    title="Delete Chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}