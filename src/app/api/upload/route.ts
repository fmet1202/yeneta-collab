import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { getImagePrompt } from "@/lib/prompts";
import { Language } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const language = (formData.get("language") as Language) || "amharic";

    if (!file) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid image type. Use JPG, PNG, WebP, or GIF." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    const prompt = getImagePrompt(language);

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      },
    ]);

    const explanation = result.response.text();

    return NextResponse.json({ explanation });
  } catch (error: unknown) {
    console.error("Upload API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
