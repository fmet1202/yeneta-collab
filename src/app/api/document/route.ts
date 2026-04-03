import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { getDocumentPrompt } from "@/lib/prompts";
import { Language, DocumentAction } from "@/types";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("document") as File | null;
    const language = (formData.get("language") as Language) || "amharic";
    const action = (formData.get("action") as DocumentAction) || "explain";

    if (!file) {
      return NextResponse.json(
        { error: "No document provided" },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ===== PDF — Gemini reads directly =====
    if (fileName.endsWith(".pdf")) {
      const base64 = buffer.toString("base64");
      const prompt = getDocumentPrompt(language, action);

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64,
          },
        },
      ]);

      const response = result.response.text();

      if (action === "quiz") {
        return parseQuizResponse(response);
      }

      return NextResponse.json({ response });
    }

    // ===== DOCX — Extract text with mammoth =====
    if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      const content = result.value;

      if (!content.trim()) {
        return NextResponse.json(
          { error: "Document appears to be empty" },
          { status: 400 }
        );
      }

      return processTextContent(content, language, action);
    }

    // ===== PPTX — Send to Gemini directly =====
    if (fileName.endsWith(".pptx")) {
      const base64 = buffer.toString("base64");
      const prompt = getDocumentPrompt(language, action);

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType:
              "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            data: base64,
          },
        },
      ]);

      const response = result.response.text();

      if (action === "quiz") {
        return parseQuizResponse(response);
      }

      return NextResponse.json({ response });
    }

    // ===== TXT — Read as text =====
    if (fileName.endsWith(".txt")) {
      const content = new TextDecoder().decode(buffer);

      if (!content.trim()) {
        return NextResponse.json(
          { error: "File appears to be empty" },
          { status: 400 }
        );
      }

      return processTextContent(content, language, action);
    }

    return NextResponse.json(
      { error: "Unsupported file type. Use PDF, DOCX, PPTX, or TXT." },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("Document API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Helper: Process plain text content through Gemini
async function processTextContent(
  content: string,
  language: Language,
  action: DocumentAction
) {
  const prompt = getDocumentPrompt(language, action);

  const result = await model.generateContent(
    `${prompt}\n\nDocument Content:\n${content}`
  );

  const response = result.response.text();

  if (action === "quiz") {
    return parseQuizResponse(response);
  }

  return NextResponse.json({ response });
}

// Helper: Parse quiz JSON from AI response
function parseQuizResponse(response: string) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const quiz = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ quiz });
    }

    // If no JSON found, return raw response
    return NextResponse.json({ response });
  } catch {
    // If JSON parsing fails, return raw response
    return NextResponse.json({ response });
  }
}
