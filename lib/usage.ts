import { redis } from "./redis";

export async function getUsage(key: string) {
  return (await redis.get<number>(key)) || 0;
}

export async function incrementUsage(key: string) {
  await redis.incr(key);
}
