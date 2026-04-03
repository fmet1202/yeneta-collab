import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { getDocumentPrompt } from "@/lib/prompts";
import { Language } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { content, language }: { content: string; language: Language } =
      await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required to generate a quiz" },
        { status: 400 }
      );
    }

    const prompt = getDocumentPrompt(language || "english", "quiz");

    const result = await model.generateContent(
      `${prompt}\n\nContent to create quiz from:\n${content}`
    );

    const response = result.response.text();

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const quiz = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ quiz });
      }
    } catch {
      // JSON parsing failed, return raw
    }

    return NextResponse.json({ response });
  } catch (error: unknown) {
    console.error("Quiz API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
