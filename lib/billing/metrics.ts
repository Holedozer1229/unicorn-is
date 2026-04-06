import { redis } from "@/lib/redis"

export async function logEvent(type: string, data: any) {
  await redis.lpush(
    "billing:events",
    JSON.stringify({
      type,
      data,
      timestamp: Date.now(),
    })
  )
}
