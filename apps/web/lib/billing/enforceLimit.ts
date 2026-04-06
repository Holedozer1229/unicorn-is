import { getUsage, incrementUsage } from "@/lib/redis"
import { TIER_LIMITS } from "@/lib/billing/tiers"

export async function enforceAICap(
  userId: string,
  tier: keyof typeof TIER_LIMITS
) {
  const limit = TIER_LIMITS[tier].aiGenerationsPerMonth

  if (limit === -1) return { allowed: true }

  const usage = await getUsage(userId)

  if (usage >= limit) {
    return { allowed: false, usage, limit }
  }

  await incrementUsage(userId)

  return { allowed: true, usage: usage + 1, limit }
}
