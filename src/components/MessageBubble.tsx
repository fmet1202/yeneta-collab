"use client";

import { Message, Language } from "@/types";
import ReactMarkdown from "react-markdown";
import SpeakButton from "./SpeakButton";
import QuizCard from "./QuizCard";
import { FileText, Image as ImageIcon } from "lucide-react";

interface Props {
  message: Message;
  language: Language;
}

export default function MessageBubble({ message, language }: Props) {
  const isUser = message.role === "user";

  if (message.type === "quiz") {
    let quizData;
    try {
      quizData = JSON.parse(message.content);
    } catch {
      return null;
    }
    return (
      <div className="flex w-full justify-start my-4">
        <QuizCard quiz={quizData} language={language} />
      </div>
    );
  }

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} my-3`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm relative group ${
          isUser
            ? "bg-[#1a7a4c] text-white rounded-br-none"
            : "bg-white border border-gray-100 text-[#1a1a2e] rounded-bl-none"
        }`}
      >
        {message.fileName && (
          <div className={`flex items-center gap-2 mb-2 pb-2 text-sm border-b ${isUser ? "border-green-600/50 text-green-100" : "border-gray-200 text-gray-500"}`}>
            {message.type === "image" ? <ImageIcon size={16} /> : <FileText size={16} />}
            <span className="truncate">{message.fileName}</span>
          </div>
        )}
        
        <div className={`prose prose-sm max-w-none ${isUser ? "prose-invert" : ""}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {!isUser && message.type === "text" && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <SpeakButton text={message.content} language={language} />
          </div>
        )}
      </div>
    </div>
  );
}
