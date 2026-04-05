import { NextResponse } from "next/server"
import { resolveTier } from "./resolve-tier"
import { getEntitlements, Feature } from "./entitlements"

export function requireFeature(subscription: any, feature: Feature) {
  const tier = resolveTier(subscription?.tier)
  const entitlements = getEntitlements(tier)

  if (!entitlements.has(feature)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "UPGRADE_REQUIRED",
          feature,
        },
        { status: 403 }
      ),
    }
  }

  return { ok: true, tier, entitlements }
}
