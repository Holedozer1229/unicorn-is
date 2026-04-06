import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/billing/getUserTier";
import { enforceAICap } from "@/lib/billing/enforceLimit";
import { getUsage, incrementUsage } from "@/lib/usage";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();

    if (!idea) {
      return new Response(JSON.stringify({ error: "Idea required" }), { status: 400 });
    }

    // 🔐 AUTH
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 💸 TIER CONTROL
    const tier = getUserTier(user.id);
    const usage = await getUsage(`score:${user.id}`);

    const cap = enforceAICap(tier, usage, 2000);
    if (!cap.allowed) {
      return new Response(JSON.stringify({ error: cap.reason }), { status: 403 });
    }

    const prompt = `
    Analyze this content idea for virality.

    Return JSON ONLY:
    {
      "score": number (0-100),
      "insight": "short explanation",
      "improvements": ["tip1", "tip2", "tip3"]
    }

    Idea:
    ${idea}
    `;

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let full = "";

        for await (const chunk of result.textStream) {
          full += chunk;
          controller.enqueue(encoder.encode(chunk));
        }

        try {
          const parsed = JSON.parse(full);

          // ✅ track usage AFTER success
          await incrementUsage(`score:${user.id}`);

          controller.enqueue(
            encoder.encode(`\n\n${JSON.stringify(parsed)}`)
          );
        } catch {
          controller.enqueue(
            encoder.encode(`\n\n${JSON.stringify({
              score: 50,
              insight: "Fallback analysis",
              improvements: ["Refine hook", "Increase emotion", "Shorten intro"]
            })}`)
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
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
