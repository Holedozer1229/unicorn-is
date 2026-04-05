export type SubscriptionTier = "free" | "creator" | "pro"

export interface Profile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  niche: string | null
  platforms: string[]
  audience_size: number
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  tier: SubscriptionTier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface UsageEvent {
  id: string
  user_id: string
  event_type: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface ContentIdea {
  id: string
  user_id: string
  title: string
  description: string | null
  format: string
  platform: string
  status: "idea" | "planned" | "in_progress" | "published"
  ai_generated: boolean
  created_at: string
  updated_at: string
}

export interface ContentPlan {
  id: string
  user_id: string
  title: string
  description: string | null
  scheduled_date: string | null
  platforms: string[]
  status: "draft" | "scheduled" | "published"
  content_idea_id: string | null
  created_at: string
  updated_at: string
}

export interface MonetizationSuggestion {
  id: string
  user_id: string
  suggestion_type: string
  title: string
  description: string | null
  potential_revenue: number | null
  difficulty: "easy" | "medium" | "hard"
  status: "new" | "considering" | "implemented" | "dismissed"
  ai_generated: boolean
  created_at: string
  updated_at: string
}

export interface TierLimits {
  aiGenerationsPerMonth: number
  savedIdeas: number
  scheduledPosts: number
  analyticsRetentionDays: number
  features: string[]
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    aiGenerationsPerMonth: 10,
    savedIdeas: 25,
    scheduledPosts: 5,
    analyticsRetentionDays: 7,
    features: [
      "Basic content ideas",
      "Manual scheduling",
      "7-day analytics",
    ],
  },
  creator: {
    aiGenerationsPerMonth: 100,
    savedIdeas: 250,
    scheduledPosts: 50,
    analyticsRetentionDays: 30,
    features: [
      "AI-powered content engine",
      "Smart scheduling",
      "30-day analytics",
      "Monetization suggestions",
      "Export content plans",
    ],
  },
  pro: {
    aiGenerationsPerMonth: -1, // Unlimited
    savedIdeas: -1,
    scheduledPosts: -1,
    analyticsRetentionDays: 365,
    features: [
      "Unlimited AI generations",
      "Priority support",
      "1-year analytics history",
      "Advanced monetization AI",
      "API access",
      "Team collaboration",
    ],
  },
}

export const SUBSCRIPTION_PRICES = {
  creator: {
    monthly: 1900, // $19.00
    yearly: 19000, // $190.00 (2 months free)
  },
  pro: {
    monthly: 4900, // $49.00
    yearly: 49000, // $490.00 (2 months free)
  },
}

export const PLATFORMS = [
  "YouTube",
  "Instagram",
  "TikTok",
  "Twitter/X",
  "LinkedIn",
  "Facebook",
  "Threads",
  "Pinterest",
  "Twitch",
  "Substack",
  "Medium",
  "Podcast",
] as const

export const CONTENT_FORMATS = [
  "Short-form video",
  "Long-form video",
  "Carousel post",
  "Single image",
  "Story/Reel",
  "Thread",
  "Article/Blog",
  "Newsletter",
  "Podcast episode",
  "Live stream",
] as const

export const NICHES = [
  "Tech & Software",
  "Business & Entrepreneurship",
  "Lifestyle & Wellness",
  "Gaming",
  "Education",
  "Entertainment",
  "Finance & Investing",
  "Food & Cooking",
  "Travel",
  "Fashion & Beauty",
  "Fitness & Health",
  "Art & Design",
  "Music",
  "Sports",
  "Parenting",
  "DIY & Crafts",
] as const
