// In-memory storage for growth engine (MVP without database)
// In production, replace with actual database integration

export interface Event {
  id: string
  type: 'page_view' | 'signup' | 'generate_click' | 'upgrade' | 'cta_click'
  userId?: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

export interface GrowthContent {
  id: string
  hook: string
  script: string
  caption: string
  cta: string
  niche: string
  platform: string
  status: 'ready' | 'posted' | 'scheduled'
  createdAt: Date
}

export interface CTAVariant {
  id: string
  text: string
  clicks: number
  conversions: number
}

// In-memory stores
const events: Event[] = []
const growthContent: GrowthContent[] = []
const ctaVariants: CTAVariant[] = [
  { id: '1', text: 'Start Free', clicks: 0, conversions: 0 },
  { id: '2', text: 'Go Viral Today', clicks: 0, conversions: 0 },
  { id: '3', text: 'Get Your First Viral Post', clicks: 0, conversions: 0 },
  { id: '4', text: 'Turn Content into Income', clicks: 0, conversions: 0 },
]

// Event functions
export function trackEvent(event: Omit<Event, 'id' | 'createdAt'>): Event {
  const newEvent: Event = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  }
  events.push(newEvent)
  return newEvent
}

export function getEvents(limit = 100): Event[] {
  return events.slice(-limit).reverse()
}

export function getEventStats() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const todayEvents = events.filter(e => new Date(e.createdAt) >= today)
  const weekEvents = events.filter(e => new Date(e.createdAt) >= weekAgo)
  
  const pageViews = events.filter(e => e.type === 'page_view').length
  const signups = events.filter(e => e.type === 'signup').length
  const generateClicks = events.filter(e => e.type === 'generate_click').length
  const upgrades = events.filter(e => e.type === 'upgrade').length
  
  const conversionRate = pageViews > 0 ? (signups / pageViews * 100) : 0
  const upgradeRate = signups > 0 ? (upgrades / signups * 100) : 0
  
  return {
    total: {
      pageViews,
      signups,
      generateClicks,
      upgrades,
      conversionRate: conversionRate.toFixed(2),
      upgradeRate: upgradeRate.toFixed(2),
    },
    today: {
      pageViews: todayEvents.filter(e => e.type === 'page_view').length,
      signups: todayEvents.filter(e => e.type === 'signup').length,
      generateClicks: todayEvents.filter(e => e.type === 'generate_click').length,
      upgrades: todayEvents.filter(e => e.type === 'upgrade').length,
    },
    week: {
      pageViews: weekEvents.filter(e => e.type === 'page_view').length,
      signups: weekEvents.filter(e => e.type === 'signup').length,
      generateClicks: weekEvents.filter(e => e.type === 'generate_click').length,
      upgrades: weekEvents.filter(e => e.type === 'upgrade').length,
    },
    dailyData: getDailyData(weekEvents),
  }
}

function getDailyData(events: Event[]) {
  const days: Record<string, { pageViews: number; signups: number; upgrades: number }> = {}
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const key = date.toISOString().split('T')[0]
    days[key] = { pageViews: 0, signups: 0, upgrades: 0 }
  }
  
  events.forEach(event => {
    const key = new Date(event.createdAt).toISOString().split('T')[0]
    if (days[key]) {
      if (event.type === 'page_view') days[key].pageViews++
      if (event.type === 'signup') days[key].signups++
      if (event.type === 'upgrade') days[key].upgrades++
    }
  })
  
  return Object.entries(days).map(([date, data]) => ({
    date,
    ...data,
  }))
}

// Content functions
export function saveGrowthContent(content: Omit<GrowthContent, 'id' | 'createdAt' | 'status'>): GrowthContent {
  const newContent: GrowthContent = {
    ...content,
    id: crypto.randomUUID(),
    status: 'ready',
    createdAt: new Date(),
  }
  growthContent.push(newContent)
  return newContent
}

export function getGrowthContent(limit = 50): GrowthContent[] {
  return growthContent.slice(-limit).reverse()
}

export function updateContentStatus(id: string, status: GrowthContent['status']): GrowthContent | null {
  const content = growthContent.find(c => c.id === id)
  if (content) {
    content.status = status
    return content
  }
  return null
}

// CTA functions
export function getCTAVariants(): CTAVariant[] {
  return ctaVariants
}

export function recordCTAClick(ctaId: string): void {
  const variant = ctaVariants.find(v => v.id === ctaId)
  if (variant) {
    variant.clicks++
  }
}

export function recordCTAConversion(ctaId: string): void {
  const variant = ctaVariants.find(v => v.id === ctaId)
  if (variant) {
    variant.conversions++
  }
}

export function getBestCTA(): CTAVariant {
  // Return the CTA with the best conversion rate (or random if no data)
  const withData = ctaVariants.filter(v => v.clicks > 0)
  if (withData.length === 0) {
    return ctaVariants[Math.floor(Math.random() * ctaVariants.length)]
  }
  return withData.reduce((best, current) => {
    const bestRate = best.conversions / best.clicks
    const currentRate = current.conversions / current.clicks
    return currentRate > bestRate ? current : best
  })
}

// Seed some demo data
export function seedDemoData() {
  const types: Event['type'][] = ['page_view', 'signup', 'generate_click', 'upgrade']
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Generate random events for each day
    const dailyViews = Math.floor(Math.random() * 50) + 20
    const dailySignups = Math.floor(dailyViews * (Math.random() * 0.15 + 0.05))
    const dailyClicks = Math.floor(dailySignups * (Math.random() * 2 + 1))
    const dailyUpgrades = Math.floor(dailySignups * (Math.random() * 0.1 + 0.02))
    
    for (let j = 0; j < dailyViews; j++) {
      events.push({
        id: crypto.randomUUID(),
        type: 'page_view',
        createdAt: new Date(date.getTime() + Math.random() * 86400000),
      })
    }
    
    for (let j = 0; j < dailySignups; j++) {
      events.push({
        id: crypto.randomUUID(),
        type: 'signup',
        userId: `user_${crypto.randomUUID().slice(0, 8)}`,
        createdAt: new Date(date.getTime() + Math.random() * 86400000),
      })
    }
    
    for (let j = 0; j < dailyClicks; j++) {
      events.push({
        id: crypto.randomUUID(),
        type: 'generate_click',
        createdAt: new Date(date.getTime() + Math.random() * 86400000),
      })
    }
    
    for (let j = 0; j < dailyUpgrades; j++) {
      events.push({
        id: crypto.randomUUID(),
        type: 'upgrade',
        userId: `user_${crypto.randomUUID().slice(0, 8)}`,
        createdAt: new Date(date.getTime() + Math.random() * 86400000),
      })
    }
  }
  
  // Seed CTA data
  ctaVariants.forEach(v => {
    v.clicks = Math.floor(Math.random() * 100) + 10
    v.conversions = Math.floor(v.clicks * (Math.random() * 0.2 + 0.05))
  })
}

// Initialize with demo data
seedDemoData()
