import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prompt, aspectRatio = "1:1" } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-preview-image-generation",
      generationConfig: {
        responseModalities: ["text", "image"],
      },
      safetySettings,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;

    const text = response.text?.();
    const imageParts = response.candidates?.[0]?.content?.parts?.filter(
      (part: any) => part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imageParts || imageParts.length === 0) {
      return NextResponse.json({ 
        error: "No image generated",
        text: text || "Could not generate an image for this prompt."
      }, { status: 200 });
    }

    const imageData = imageParts[0].inlineData;
    const imageBase64 = imageData.data;
    const mimeType = imageData.mimeType;

    return NextResponse.json({
      imageUrl: `data:${mimeType};base64,${imageBase64}`,
      text: text || "Here's an image based on your request.",
      prompt,
    });

  } catch (error: any) {
    console.error("Image generation error:", error);
    
    if (error.message?.includes("SAFETY") || error.message?.includes("blocked")) {
      return NextResponse.json({ 
        error: "Image could not be generated due to safety settings. Please try a different prompt." 
      }, { status: 200 });
    }

    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}
