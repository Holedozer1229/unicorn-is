import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { TIERS } from '@/lib/tier';
import { z } from 'zod';
import { runHolographicQAOA, deriveIdeaGraph } from '@/lib/holographic';
import { callSphinxOSStream } from '@/lib/sphinxos'; // New helper for SphinxOS

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

    const tier = 'free'; // TODO: Replace with authenticated user tier lookup
    const tierConfig = TIERS[tier];

    if (!tierConfig || !rateLimit(userId, tierConfig.limit)) {
      return NextResponse.json(
        { error: 'Rate limit reached. Upgrade to Pro.', tier, limit: tierConfig.limit },
        { status: 429 }
      );
    }

    // Derive graph representation of the idea (core holographic input)
    const ideaGraph = deriveIdeaGraph(idea);

    // Parallel: SphinxOS for narrative + Holographic QAOA for structural optimization
    const [sphinxStream, holographicResult] = await Promise.all([
      callSphinxOSStream(idea),
      runHolographicQAOA(ideaGraph, { p: 3, lambdaHolo: 0.15 }),
    ]);

    const finalScore = Math.round(holographicResult.optimalScore);

    // Stream fused response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = sphinxStream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (e) {
          console.error('SphinxOS stream error:', e);
        }

        // Append holographic optimization summary
        const holoSummary = `\n\n🔬 Holographic QAOA Analysis (UnicornOS Core):\n` +
          `Optimized Viral Score: ${finalScore}/100\n` +
          `Holographic Penalty Applied: Minimal surface regularization for structural coherence.\n` +
          `Key Insight: ${holographicResult.insight || 'Enhanced convergence on innovation landscape.'}`;

        controller.enqueue(encoder.encode(holoSummary));
        controller.close();
      },
    });

    return new Response(readableStream, {
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
    console.error('UnicornOS Core Error:', error);
    return NextResponse.json({ error: 'Holographic scoring unavailable' }, { status: 500 });
  }
}

export function generateShareText(score: number): string {
  return `My idea achieved a holographic-optimized score on UnicornOS (SphinxOS + Holographic QAOA):

🔥 Viral Score: ${score}/100

Powered by tensor-network holographic regularization.
Test yours at unicorn-saas.vercel.app`;
}
