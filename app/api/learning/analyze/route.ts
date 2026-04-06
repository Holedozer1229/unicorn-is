import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: NextRequest) {
  const { dataset } = await req.json();

  const prompt = `
You are UnicornOS Learning Engine.

Analyze performance data and extract patterns.

DATA:
${JSON.stringify(dataset, null, 2)}

Return JSON ONLY:

{
  "winning_patterns": [
    {
      "pattern": "...",
      "reason": "..."
    }
  ],
  "losing_patterns": [
    {
      "pattern": "...",
      "fix": "..."
    }
  ],
  "optimal_structure": {
    "hook_style": "...",
    "length_range": "...",
    "tone": "...",
    "cta_type": "..."
  },
  "next_generation_prompt": "..."
}

Focus on:
- Virality signals
- Hook performance
- Engagement density
- Emotional triggers
`;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [{ role: "user", content: prompt }],
  });

  return new Response(result.textStream);
}
