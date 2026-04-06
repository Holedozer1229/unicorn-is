import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { TIERS } from '@/lib/tier';
import { z } from 'zod';
import { deriveIdeaGraph, runHolographicQAOA } from '@/lib/holographic';
import { callSphinxOSStream } from '@/lib/sphinxos';
import { generateShareText } from '@/lib/utils';

const ScoreRequestSchema = z.object({
  idea: z.string().min(10).max(2000),
  userId: z.string().optional().default('anon'),
});

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idea, userId = 'anon' } = ScoreRequestSchema.parse(body);

    const tier = 'free'; // TODO: Replace with real user tier lookup from DB/auth
    const tierConfig = TIERS[tier as keyof typeof TIERS];

    if (!tierConfig) {
      return NextResponse.json({ error: 'Invalid tier configuration' }, { status: 500 });
    }

    if (!rateLimit(userId, tierConfig.limit)) {
      return NextResponse.json(
        { error: 'Rate limit reached. Upgrade to Pro.', tier, limit: tierConfig.limit },
        { status: 429 }
      );
    }

    // Derive graph and run holographic QAOA + SphinxOS in parallel
    const ideaGraph = deriveIdeaGraph(idea);
    const [sphinxBody, holographicResult] = await Promise.all([
      callSphinxOSStream(idea),
      runHolographicQAOA(ideaGraph, { p: 4, lambdaHolo: 0.12 }),
    ]);

    const finalScore = holographicResult.optimalScore;

    // Stream fused response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = sphinxBody.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (e) {
          console.error('SphinxOS stream error:', e);
        }

        const holoSummary = `\n\n🔬 UnicornOS Holographic QAOA Core:\n` +
          `Optimized Score: ${finalScore}/100\n` +
          `Holographic Penalty: ${holographicResult.holographicPenalty}\n` +
          `Insight: ${holographicResult.insight || 'Enhanced structural coherence detected.'}`;

        controller.enqueue(encoder.encode(holoSummary));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('UnicornOS Score Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
