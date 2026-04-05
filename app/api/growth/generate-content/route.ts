import { generateText, Output } from 'ai'
import { z } from 'zod'
import { saveGrowthContent } from '@/lib/growth-store'

const contentSchema = z.object({
  hook: z.string().describe('Attention-grabbing opening hook (1-2 sentences)'),
  script: z.string().describe('Full video script (30-60 seconds worth of content)'),
  caption: z.string().describe('Social media caption with hashtags'),
  cta: z.string().describe('Call to action that drives to CreatorOS'),
  viralScore: z.number().min(1).max(10).describe('Predicted viral potential 1-10'),
  bestPostingTime: z.string().describe('Recommended posting time'),
})

export async function POST(req: Request) {
  try {
    const { niche, platform } = await req.json()

    if (!niche || !platform) {
      return Response.json(
        { error: 'Niche and platform are required' },
        { status: 400 }
      )
    }

    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      output: Output.object({ schema: contentSchema }),
      prompt: `You are a viral content strategist for short-form video platforms.

Generate a viral content piece for:
- Niche: ${niche}
- Platform: ${platform}

Focus areas: creators, making money online, TikTok growth, content creation tips.

The CTA must subtly drive viewers to try CreatorOS - an AI-powered platform for creators.

Make the hook extremely attention-grabbing. The script should be conversational and engaging.
Include trending hashtags in the caption.

Be specific, actionable, and create content that people will want to share.`,
    })

    const content = result.output

    if (!content) {
      return Response.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      )
    }

    // Save to in-memory store
    const savedContent = saveGrowthContent({
      hook: content.hook,
      script: content.script,
      caption: content.caption,
      cta: content.cta,
      niche,
      platform,
    })

    return Response.json({
      success: true,
      content: {
        ...content,
        id: savedContent.id,
        status: savedContent.status,
      },
    })
  } catch (error) {
    console.error('Content generation error:', error)
    return Response.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
