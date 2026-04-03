interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

export const speakText = (
  text: string,
  language: "amharic" | "english"
): void => {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = language === "amharic" ? "am-ET" : "en-US";
    utterance.lang = langCode;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang.startsWith(language === "amharic" ? "am" : "en"));
    if (match) {
      utterance.voice = match;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Voices might not be loaded yet
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    speak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      speak();
    };
  }
};

export const stopSpeaking = (): void => {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
};

export const startListening = (
  language: "amharic" | "english",
  onResult: (text: string) => void,
  onError: (error: string) => void
): (() => void) | null => {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    (window as unknown as Record<string, unknown>).SpeechRecognition ||
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError("Speech recognition not supported in this browser");
    return null;
  }

  const recognition = new (SpeechRecognition as new () => SpeechRecognition)();
  recognition.lang = language === "amharic" ? "am-ET" : "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onError(event.error);
  };

  recognition.start();

  return () => {
    recognition.stop();
  };
};
