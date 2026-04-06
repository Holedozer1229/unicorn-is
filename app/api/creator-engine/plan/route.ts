import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: NextRequest) {
  const { niche } = await req.json();

  const prompt = `
Create a 7-day viral content plan.

Return JSON:
{
  "days": [
    {
      "day": "Monday",
      "idea": "...",
      "hook": "...",
      "format": "short video"
    }
  ]
}

Niche: ${niche}
`;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [{ role: "user", content: prompt }],
  });

  return new Response(result.textStream);
}
