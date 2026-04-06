import { redis } from "@/lib/redis"

export type RevenueProfile = {
  usageVelocity: number
  engagementScore: number
  upgradeIntent: number
  churnRisk: number
}

export async function buildUserProfile(userId: string): Promise<RevenueProfile> {
  const raw = await redis.lrange("revenue:events", 0, 500)

  const events = raw
    .map((e) => JSON.parse(e))
    .filter((e) => e.userId === userId)

  const aiUsage = events.filter((e) => e.event === "ai_used").length
  const logins = events.filter((e) => e.event === "login").length
  const limitHits = events.filter((e) => e.event === "limit_reached").length

  const usageVelocity = aiUsage / Math.max(logins, 1)

  const engagementScore = Math.min(logins * 10 + aiUsage * 2, 100)

  const upgradeIntent =
    events.filter((e) => e.event === "checkout_started").length * 20 +
    limitHits * 15

  const churnRisk = Math.max(0, 100 - engagementScore + limitHits * 10)

  return {
    usageVelocity,
    engagementScore,
    upgradeIntent,
    churnRisk,
  }
}
