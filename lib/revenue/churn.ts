export function calculateChurnProbability({
  engagementScore,
  usageVelocity,
  limitHits,
}: any) {
  let score = 0

  if (engagementScore < 30) score += 40
  if (usageVelocity < 0.2) score += 30
  if (limitHits > 3) score += 20

  return Math.min(score, 100)
}
