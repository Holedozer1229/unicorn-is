import { trackEvent } from "./events"

export async function triggerRetentionFlow(userId: string) {
  await trackEvent(userId, "limit_reached", {
    reason: "churn_risk_detected",
  })

  // Hook point:
  // - email drip (Resend / Postmark)
  // - in-app modal
  // - discount offer
}
