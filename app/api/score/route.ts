import { NextRequest, NextResponse } from 'next/server';
import { scoreIdea } from '@/lib/ai';
import { rateLimit } from '@/lib/rate-limit';
import { TIERS } from '@/lib/tier';
import { z } from 'zod'; // Recommended: add via npm install zod

// Input validation schema
const ScoreRequestSchema = z.object({
  idea: z.string()
    .min(10, 'Idea must be at least 10 characters long')
    .max(2000, 'Idea must not exceed 2000 characters'),
  userId: z.string().optional().default('anon'),
});

// Optional: Configure dynamic behavior if needed
export const dynamic = 'force-dynamic'; // Ensures fresh execution per request

/**
 * POST /api/score
 * Scores a user-submitted idea with AI and enforces tier-based rate limits.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate incoming JSON body
    const body = await request.json();
    const { idea, userId = 'anon' } = ScoreRequestSchema.parse(body);

    // TODO: Replace hardcoded tier with real user lookup (e.g., from database or auth session)
    const tier = 'free'; // Fetch dynamically in production, e.g., via Supabase or Clerk
    const tierConfig = TIERS[tier];

    if (!tierConfig) {
      return NextResponse.json(
        { error: 'Invalid tier configuration' },
        { status: 500 }
      );
    }

    // Enforce rate limit
    const isAllowed = rateLimit(userId, tierConfig.limit);
    if (!isAllowed) {
      return NextResponse.json(
        {
          error: 'Rate limit reached. Please upgrade to Pro for higher limits.',
          tier: tier,
          limit: tierConfig.limit,
        },
        { status: 429 }
      );
    }

    // Perform AI scoring (assumes scoreIdea returns { score: number, feedback?: string, ... })
    const result = await scoreIdea(idea);

    // Optional: Log successful scoring for analytics (add your logging service here)
    // console.log(`Idea scored for user ${userId}: ${result.score}`);

    return NextResponse.json({
      success: true,
      ...result,
      shareText: generateShareText(result.score), // Include shareable text in response
    });

  } catch (error) {
    // Differentiate validation errors from unexpected issues
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Scoring route error:', error);
    return NextResponse.json(
      { error: 'Internal server error while scoring idea' },
      { status: 500 }
    );
  }
}

/**
 * Generates a shareable text for social media or viral promotion.
 * Moved to a pure utility function for easier testing and reuse.
 */
export function generateShareText(score: number): string {
  return `I just tested my idea on Unicorn OS.

🔥 Viral Score: ${score}/100

Think it will blow up? 👇
https://unicorn-saas.vercel.app`;
}
