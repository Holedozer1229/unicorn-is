import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Cache keys
export const CACHE_KEYS = {
  userUsage: (userId: string) => `usage:${userId}`,
  userProfile: (userId: string) => `profile:${userId}`,
  userSubscription: (userId: string) => `subscription:${userId}`,
  aiGenerationCount: (userId: string, month: string) =>
    `ai_gen:${userId}:${month}`,
}

// Get current month key
export function getCurrentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

// Track AI generation usage
export async function trackAIGeneration(userId: string): Promise<number> {
  const key = CACHE_KEYS.aiGenerationCount(userId, getCurrentMonthKey())
  const count = await redis.incr(key)
  // Set expiry to 40 days to ensure we cover the entire month plus buffer
  await redis.expire(key, 60 * 60 * 24 * 40)
  return count
}

// Get AI generation count for current month
export async function getAIGenerationCount(userId: string): Promise<number> {
  const key = CACHE_KEYS.aiGenerationCount(userId, getCurrentMonthKey())
  const count = await redis.get<number>(key)
  return count || 0
}

// Rate limiting helper
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = `ratelimit:${identifier}`
  const now = Math.floor(Date.now() / 1000)

  const pipeline = redis.pipeline()
  pipeline.incr(key)
  pipeline.ttl(key)

  const results = await pipeline.exec()
  const count = results[0] as number
  let ttl = results[1] as number

  if (ttl === -1) {
    await redis.expire(key, windowSeconds)
    ttl = windowSeconds
  }

  const allowed = count <= limit
  const remaining = Math.max(0, limit - count)
  const resetAt = now + ttl

  return { allowed, remaining, resetAt }
}
