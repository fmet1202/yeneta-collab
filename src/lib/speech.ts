"use client";

import { Language } from "@/types";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const speakText = (text: string, language: Language) => {
  if (!("speechSynthesis" in window)) {
    console.error("SpeechSynthesis API not supported");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "amharic" ? "am-ET" : "en-US";
  
  window.speechSynthesis.speak(utterance);
};

export const startListening = (
  language: Language,
  onResult: (text: string) => void,
  onError: (err: string) => void
): SpeechRecognition | null => {
  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognitionClass) {
    onError("Speech Recognition API is not supported in your browser.");
    return null;
  }

  const recognition = new SpeechRecognitionClass();
  recognition.lang = language === "amharic" ? "am-ET" : "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onError(event.error);
  };

  recognition.start();
  return recognition;
};
