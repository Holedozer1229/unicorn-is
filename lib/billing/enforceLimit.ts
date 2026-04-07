export function enforceLimit(
  tier: string,
  usage: number,
  tokens: number
) {
  const limits = {
    free: 10,
    creator: 100,
    pro: 1000,
  };

  const limit = limits[tier as keyof typeof limits] ?? limits.free;
  const remaining = Math.max(limit - usage, 0);

  if (usage >= limit) {
    return { allowed: false, reason: "Daily limit reached", remaining: 0 };
  }

  return { allowed: true, remaining: remaining - 1, tokens };
}
