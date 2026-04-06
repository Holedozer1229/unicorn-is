export function enforceAICap(
  tier: string,
  usage: number,
  tokens: number
) {
  const limits = {
    free: 10,
    creator: 100,
    pro: 1000,
  };

  if (usage >= limits[tier as keyof typeof limits]) {
    return { allowed: false, reason: "Daily limit reached" };
  }

  return { allowed: true };
}
    allowed: true,
    remaining: remaining - 1,
  }
}
