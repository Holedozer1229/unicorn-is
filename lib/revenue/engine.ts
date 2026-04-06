import { buildUserProfile } from "./profile"

export type RevenueInsight = {
  shouldUpsell: boolean
  recommendedTier?: "pro" | "enterprise"
  churnRisk: number
  message: string
}

export async function generateRevenueInsight(userId: string): Promise<RevenueInsight> {
  const profile = await buildUserProfile(userId)

  const shouldUpsell =
    profile.engagementScore > 60 &&
    profile.usageVelocity > 0.5 &&
    profile.churnRisk < 40

  const recommendedTier =
    profile.churnRisk > 60
      ? undefined
      : profile.usageVelocity > 1
      ? "enterprise"
      : "pro"

  const message =
    profile.churnRisk > 70
      ? "User is at high churn risk — trigger retention flow"
      : shouldUpsell
      ? "User is primed for upgrade — show Pro upsell"
      : "User is stable — no action needed"

  return {
    shouldUpsell,
    recommendedTier,
    churnRisk: profile.churnRisk,
    message,
  }
}
