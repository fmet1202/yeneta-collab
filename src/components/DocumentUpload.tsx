"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, FileText, Loader2, BookOpen, List, GraduationCap } from "lucide-react";
import { Language, DocumentAction } from "@/types";

interface Props {
  language: Language;
  onClose: () => void;
  onProcess: (file: File, action: DocumentAction) => void;
  isProcessing: boolean;
}

export default function DocumentUpload({ language, onClose, onProcess, isProcessing }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const isAmharic = language === "amharic";

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 20 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    disabled: isProcessing,
  });

  return (
    <div className="absolute bottom-full mb-4 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 z-30 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-[#1a1a2e]">
          {isAmharic ? "ማጥኛ ቁሳቁስ ስቀል" : "Upload Study Material"}
        </h3>
        <button onClick={onClose} disabled={isProcessing} className="text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-[#1a7a4c] bg-green-50" : "border-gray-300 hover:border-[#1a7a4c] hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-600">
            {isAmharic ? "ፋይሉን እዚህ ይጎትቱ ወይም ይጫኑ" : "Drag & drop your file here, or click to select"}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            PDF, DOCX, PPTX, TXT, JPG, PNG (Max 20MB)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <FileText className="text-[#1a7a4c]" />
            <span className="flex-1 truncate text-sm font-medium">{file.name}</span>
            <button 
              onClick={() => setFile(null)} 
              disabled={isProcessing}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-sm font-medium text-center text-gray-600">
            {isAmharic ? "ምን ላድርግልዎ?" : "What would you like me to do?"}
          </p>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onProcess(file, "explain")}
              disabled={isProcessing}
              className="flex flex-col items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-[#1a7a4c] hover:bg-green-50 transition-colors disabled:opacity-50"
            >
              <BookOpen size={20} className="text-[#1a7a4c]" />
              <span className="text-xs font-semibold">{isAmharic ? "አስረዳኝ" : "Explain"}</span>
            </button>
            <button
              onClick={() => onProcess(file, "summarize")}
              disabled={isProcessing}
              className="flex flex-col items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-[#f0a500] hover:bg-yellow-50 transition-colors disabled:opacity-50"
            >
              <List size={20} className="text-[#f0a500]" />
              <span className="text-xs font-semibold">{isAmharic ? "አጠቃልልኝ" : "Summarize"}</span>
            </button>
            <button
              onClick={() => onProcess(file, "quiz")}
              disabled={isProcessing}
              className="flex flex-col items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-[#e63946] hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <GraduationCap size={20} className="text-[#e63946]" />
              <span className="text-xs font-semibold">{isAmharic ? "ፈትነኝ" : "Quiz Me"}</span>
            </button>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-[#1a7a4c] text-sm font-medium mt-4">
              <Loader2 size={16} className="animate-spin" />
              {isAmharic ? "በማስኬድ ላይ..." : "Processing..."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
