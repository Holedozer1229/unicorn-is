import { getEventStats, getCTAVariants, getGrowthContent, getBestCTA } from '@/lib/growth-store'

export async function GET() {
  try {
    const stats = getEventStats()
    const ctaVariants = getCTAVariants()
    const recentContent = getGrowthContent(20)
    const bestCTA = getBestCTA()

    return Response.json({
      success: true,
      stats,
      ctaVariants,
      bestCTA,
      recentContent: recentContent.map(c => ({
        id: c.id,
        hook: c.hook,
        niche: c.niche,
        platform: c.platform,
        status: c.status,
        createdAt: c.createdAt,
      })),
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return Response.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
