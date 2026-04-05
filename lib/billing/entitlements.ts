import { TIER_LIMITS, SubscriptionTier } from "@/lib/types"

export type Feature =
  | "ai_generate"
  | "analytics_advanced"
  | "monetization"
  | "export"

export function getEntitlements(tier: SubscriptionTier) {
  const limits = TIER_LIMITS[tier]

  const featureMatrix: Record<SubscriptionTier, Feature[]> = {
    free: ["ai_generate"],
    creator: ["ai_generate", "analytics_advanced", "export"],
    pro: ["ai_generate", "analytics_advanced", "monetization", "export"],
  }

  const features = featureMatrix[tier] ?? []

  return {
    tier,
    limits,
    features,

    has(feature: Feature) {
      return features.includes(feature)
    },

    canUseAI(used: number) {
      return limits.aiGenerationsPerMonth === -1
        ? true
        : used < limits.aiGenerationsPerMonth
    },

    assert(feature: Feature) {
      if (!features.includes(feature)) {
        throw new Error(`UPGRADE_REQUIRED:${feature}`)
      }
    },
  }
}
