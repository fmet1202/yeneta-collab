"use client";

import { useState } from "react";
import { Message, Language } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import SpeakButton from "./SpeakButton";
import QuizCard from "./QuizCard";
import { FileText, Image as ImageIcon, Copy, Check, RefreshCw } from "lucide-react";

interface Props {
  message: Message;
  language: Language;
  onRetry?: (messageId: string) => void;
}

export default function MessageBubble({ message, language, onRetry }: Props) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.type === "quiz") {
    let quizData;
    try { quizData = JSON.parse(message.content); } 
    catch { return null; }
    return (
      <div className="flex w-full justify-start my-4">
        <QuizCard quiz={quizData} language={language} />
      </div>
    );
  }

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} my-3 group relative`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm relative ${
          isUser
            ? "bg-[#1a7a4c] text-white rounded-br-none"
            : "bg-white border border-gray-100 text-[#1a1a2e] rounded-bl-none"
        }`}
      >
        {message.fileName && (
          <div className={`flex items-center gap-2 mb-2 pb-2 text-sm border-b ${isUser ? "border-green-600/50" : "border-gray-200"}`}>
            {message.type === "image" ? <ImageIcon size={16} /> : <FileText size={16} />}
            <span className="truncate">{message.fileName}</span>
          </div>
        )}
        
        <div className={`prose prose-sm max-w-none ${isUser ? "prose-invert" : ""}`}>
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Action Buttons (Copy, Speak, Retry) */}
        <div className={`absolute -bottom-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? "right-2" : "-right-16 top-2 flex-col"}`}>
          
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-[#1a7a4c] transition-colors rounded-full hover:bg-gray-100 bg-white shadow-sm border border-gray-100"
            title={copied ? "Copied!" : "Copy"}
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>

          {!isUser && message.type === "text" && (
            <>
              <div className="bg-white shadow-sm border border-gray-100 rounded-full">
                <SpeakButton text={message.content} language={language} />
              </div>
              
              {onRetry && (
                <button
                  onClick={() => onRetry(message.id)}
                  className="p-1.5 text-gray-400 hover:text-[#f0a500] transition-colors rounded-full hover:bg-gray-100 bg-white shadow-sm border border-gray-100 mt-1"
                  title="Retry"
                >
                  <RefreshCw size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}