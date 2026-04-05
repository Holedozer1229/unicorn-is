import { trackEvent, recordCTAClick, recordCTAConversion } from '@/lib/growth-store'

export async function POST(req: Request) {
  try {
    const { type, userId, metadata, ctaId } = await req.json()

    if (!type) {
      return Response.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    const validTypes = ['page_view', 'signup', 'generate_click', 'upgrade', 'cta_click']
    if (!validTypes.includes(type)) {
      return Response.json(
        { error: 'Invalid event type' },
        { status: 400 }
      )
    }

    // Track CTA clicks separately for A/B testing
    if (type === 'cta_click' && ctaId) {
      recordCTAClick(ctaId)
    }

    // Track CTA conversions (signup after clicking CTA)
    if (type === 'signup' && ctaId) {
      recordCTAConversion(ctaId)
    }

    const event = trackEvent({
      type,
      userId,
      metadata: { ...metadata, ctaId },
    })

    return Response.json({
      success: true,
      event,
    })
  } catch (error) {
    console.error('Event tracking error:', error)
    return Response.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
