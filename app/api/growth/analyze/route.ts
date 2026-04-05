import { generateText, Output } from 'ai'
import { z } from 'zod'
import { getEventStats, getCTAVariants, getGrowthContent } from '@/lib/growth-store'

const analysisSchema = z.object({
  summary: z.string().describe('Executive summary of current growth performance'),
  contentSuggestions: z.array(z.object({
    angle: z.string().describe('Content angle or topic'),
    reason: z.string().describe('Why this will perform well'),
    priority: z.enum(['high', 'medium', 'low']),
  })).describe('New content angles to explore'),
  landingPageTweaks: z.array(z.object({
    element: z.string().describe('Page element to modify'),
    suggestion: z.string().describe('Specific improvement'),
    expectedImpact: z.string().describe('Expected impact on conversion'),
  })).describe('Landing page improvements'),
  ctaRecommendations: z.array(z.object({
    current: z.string().describe('Current CTA text'),
    suggested: z.string().describe('Improved CTA text'),
    rationale: z.string().describe('Why this will convert better'),
  })).describe('CTA improvements'),
  urgentActions: z.array(z.string()).describe('Immediate actions to take'),
  growthScore: z.number().min(1).max(100).describe('Overall growth health score'),
})

export async function POST() {
  try {
    const stats = getEventStats()
    const ctaVariants = getCTAVariants()
    const recentContent = getGrowthContent(10)

    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      output: Output.object({ schema: analysisSchema }),
      prompt: `You are a growth hacking AI analyst. Your job is to maximize traffic, increase conversion rate, and increase revenue per user.

Analyze this growth data and provide actionable recommendations:

## Funnel Metrics (Last 7 Days)
- Page Views: ${stats.week.pageViews}
- Signups: ${stats.week.signups}
- Generate Clicks: ${stats.week.generateClicks}
- Upgrades: ${stats.week.upgrades}

## Overall Stats
- Total Page Views: ${stats.total.pageViews}
- Conversion Rate (Views → Signups): ${stats.total.conversionRate}%
- Upgrade Rate (Signups → Paid): ${stats.total.upgradeRate}%

## CTA Performance
${ctaVariants.map(v => `- "${v.text}": ${v.clicks} clicks, ${v.conversions} conversions (${v.clicks > 0 ? ((v.conversions / v.clicks) * 100).toFixed(1) : 0}% CVR)`).join('\n')}

## Recent Content Generated
${recentContent.slice(0, 5).map(c => `- ${c.niche} (${c.platform}): "${c.hook.slice(0, 50)}..."`).join('\n') || 'No content generated yet'}

## Daily Trend
${stats.dailyData.map(d => `${d.date}: ${d.pageViews} views, ${d.signups} signups`).join('\n')}

Provide specific, actionable growth recommendations. Focus on:
1. Quick wins that can be implemented immediately
2. Content angles that will drive viral traffic
3. Landing page optimizations for higher conversion
4. CTA improvements based on A/B test data
5. Overall growth strategy adjustments

Be specific and data-driven. Avoid generic advice.`,
    })

    const analysis = result.output

    if (!analysis) {
      return Response.json(
        { error: 'Failed to generate analysis' },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      analysis,
      stats,
      ctaPerformance: ctaVariants,
    })
  } catch (error) {
    console.error('Growth analysis error:', error)
    return Response.json(
      { error: 'Failed to analyze growth data' },
      { status: 500 }
    )
  }
}
