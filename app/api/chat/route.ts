import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "paste_your_groq_key_here") {
    return NextResponse.json(
      { message: "❌ Open .env.local and paste your Groq API key. Get one free at console.groq.com" },
      { status: 500 }
    );
  }

  try {
    const { messages, model, systemPrompt, temperature, maxTokens } = await req.json();

    const groq = new Groq({ apiKey });

    const allMessages = [
      { role: "system" as const, content: systemPrompt || "You are a helpful assistant." },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const stream = await groq.chat.completions.create({
      model: model || "llama-3.3-70b-versatile",
      messages: allMessages,
      temperature: temperature ?? 0.7,
      max_tokens: maxTokens ?? 2048,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (delta) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
