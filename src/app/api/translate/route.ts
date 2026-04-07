import { NextRequest } from "next/server";
import { model } from "@/lib/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const { text, targetLanguage } = await req.json();
    
    if (!text) return new Response("No text provided", { status: 400 });

    const prompt = `Translate the following text to ${targetLanguage}. Provide ONLY the translated text, preserving the exact original markdown formatting (bolding, lists, code blocks). Do not add any conversational filler, explanations, or quotes around it.\n\nText to translate:\n${text}`;

    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            controller.enqueue(new TextEncoder().encode(chunk.text()));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Translation error:", error);
    
    if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      return new Response("Translation quota exceeded. Please try again later.", { status: 429 });
    }
    
    return new Response("Translation failed", { status: 500 });
  }
}