import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { getSystemPrompt } from "@/lib/prompts";
import { ChatRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { message, language, history }: ChatRequest = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const systemPrompt = getSystemPrompt(language || "english");

    const chatHistory = (history || []).map((msg) => ({
      role: msg.role === "user" ? "user" as const : "model" as const,
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(
      `${systemPrompt}\n\nStudent: ${message}`
    );

    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
