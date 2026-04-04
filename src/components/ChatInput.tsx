"use client";

import { useState, useRef } from "react";
import {
  Send,
  Mic,
  Square,
  Paperclip,
  X,
  FileText,
} from "lucide-react";
import { Language } from "@/types";
import { startListening } from "@/lib/speech";

interface Props {
  onSend: (message: string, file?: File) => void;
  onToggleUpload: () => void;
  language: Language;
  isLoading: boolean;
  onStopGeneration: () => void;
}

export default function ChatInput({
  onSend,
  onToggleUpload,
  language,
  isLoading,
  onStopGeneration,
}: Props) {
  const [text, setText] = useState("");
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stopFnRef = useRef<(() => void) | null>(null);

  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const isAmharic = language === "amharic";

  const handleSend = () => {
    if ((text.trim() || stagedFile) && !isLoading) {
      if (text.trim()) setMessageHistory((prev) => [text.trim(), ...prev]);
      setHistoryIndex(-1);
      onSend(text.trim(), stagedFile || undefined);
      setText("");
      setStagedFile(null);
      setSpeechError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (messageHistory.length === 0) return;
      const newIndex = Math.min(historyIndex + 1, messageHistory.length - 1);
      setHistoryIndex(newIndex);
      setText(messageHistory[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setText("");
        return;
      }
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setText(messageHistory[newIndex]);
    }
  };

  const toggleMic = () => {
    setSpeechError("");

    if (isListening) {
      if (stopFnRef.current) stopFnRef.current();
      setIsListening(false);
      return;
    }

    setIsListening(true);

    stopFnRef.current = startListening(
      language,
      (t) => {
        setText((prev) => prev + (prev ? " " : "") + t);
      },
      (error) => {
        setSpeechError(error);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!stopFnRef.current) {
      setIsListening(false);
    }
  };

  return (
    <div className="bg-white border-t p-4 flex flex-col gap-2 sticky bottom-0 z-20">
      {stagedFile && (
        <div className="flex items-center gap-2 bg-green-50 text-[#1a7a4c] p-2 px-3 rounded-lg w-max border border-green-200">
          <FileText size={16} />
          <span className="text-sm max-w-[200px] truncate font-medium">
            {stagedFile.name}
          </span>
          <button
            onClick={() => setStagedFile(null)}
            className="hover:text-red-500 ml-2"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {speechError && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {speechError}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) =>
            e.target.files && setStagedFile(e.target.files[0])
          }
        />

        <button
          onClick={onToggleUpload}
          className="p-3 text-gray-500 hover:text-[#1a7a4c] hover:bg-green-50 rounded-full transition-colors hidden sm:block"
          title="Advanced Upload"
        >
          <Paperclip size={20} />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-gray-500 hover:text-[#1a7a4c] hover:bg-green-50 rounded-full transition-colors sm:hidden"
          title="Quick Upload"
        >
          <Paperclip size={20} />
        </button>

        <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-2 border focus-within:border-[#1a7a4c] transition-colors">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAmharic ? "ጥያቄዎን ያስገቡ..." : "Ask a question..."}
            className="flex-1 bg-transparent outline-none text-[#1a1a2e]"
            disabled={isLoading}
          />
          <button
            onClick={toggleMic}
            type="button"
            className={`p-2 rounded-full transition-colors ${
              isListening
                ? "text-[#e63946] bg-red-100 animate-pulse"
                : "text-gray-400 hover:text-[#1a7a4c]"
            }`}
            title={isListening ? "Stop listening" : "Start speech to text"}
          >
            {isListening ? (
              <Square size={16} fill="currentColor" />
            ) : (
              <Mic size={18} />
            )}
          </button>
        </div>

        {isLoading ? (
          <button
            onClick={onStopGeneration}
            className="p-3 bg-[#e63946] text-white rounded-full hover:bg-red-700 shadow-sm shrink-0"
            title="Stop Generation"
          >
            <Square size={20} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!text.trim() && !stagedFile}
            className="p-3 bg-[#1a7a4c] text-white rounded-full hover:bg-[#135c39] disabled:opacity-50 transition-colors shrink-0"
          >
            <Send size={20} />
          </button>
        )}
      </div>
    </div>
  );
}