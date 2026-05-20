import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "paste_your_groq_key_here") {
    return NextResponse.json({ title: "New Chat" });
  }
  try {
    const { userMessage, assistantMessage } = await req.json();
    const groq = new Groq({ apiKey });
    const res = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Write a short title (max 5 words) for this conversation. Return ONLY the title, nothing else, no quotes, no punctuation at the end.\n\nUser: ${userMessage.slice(0, 150)}\nAssistant: ${assistantMessage.slice(0, 150)}`,
        },
      ],
      max_tokens: 15,
      temperature: 0.5,
      stream: false,
    });
    const title = res.choices[0]?.message?.content?.trim() || "New Chat";
    return NextResponse.json({ title });
  } catch {
    return NextResponse.json({ title: "New Chat" });
  }
}
