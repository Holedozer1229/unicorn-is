import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/billing/getUserTier";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, goal } = await req.json();

    if (!topic) {
      return new Response("Missing topic", { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const tier = getUserTier(user.id);

    const prompt = `
You are UnicornOS Creator Engine.

Generate a full creator output system.

INPUT:
- Topic: ${topic}
- Platform: ${platform || "TikTok"}
- Goal: ${goal || "viral growth"}

OUTPUT JSON ONLY:

{
  "hook": "scroll stopping hook (max 12 words)",
  "title": "viral title",
  "script": "full short-form video script",
  "caption": "post caption",
  "hashtags": ["#..."],
  "cta": "call to action",
  "viral_score": number (0-100),
  "retention_tips": ["tip1", "tip2", "tip3"]
}

RULES:
- Must be optimized for short-form retention
- Hook must trigger curiosity gap
- Script must include pacing + beats
- Viral score must be realistic
`;

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let full = "";

        for await (const chunk of result.textStream) {
          full += chunk;
          controller.enqueue(encoder.encode(chunk));
        }

        // attach parsed output at end
        try {
          const parsed = JSON.parse(full);

          controller.enqueue(
            encoder.encode("\n\n" + JSON.stringify(parsed))
          );
        } catch {
          controller.enqueue(
            encoder.encode("\n\n" + JSON.stringify({
              hook: "Fix your input",
              viral_score: 50,
              script: full
            }))
          );
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
      },
    });

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
