import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const targetLang = targetLanguage === "amharic" ? "Amharic" : "English";
    
    const prompt = `Translate the following text to ${targetLang}. Only provide the translation, nothing else:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const translation = result.response.text();

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}