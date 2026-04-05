import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"
import type Stripe from "stripe"

// Use service role for webhook handler
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return Response.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return Response.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.subscription
          ? (
              await stripe.subscriptions.retrieve(
                session.subscription as string
              )
            ).metadata.supabase_user_id
          : null

        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          await supabase
            .from("subscriptions")
            .update({
              tier: subscription.metadata.tier || "creator",
              stripe_subscription_id: subscription.id,
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq("user_id", userId)
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          const tier =
            subscription.status === "active"
              ? subscription.metadata.tier || "creator"
              : "free"

          await supabase
            .from("subscriptions")
            .update({
              tier,
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq("user_id", userId)
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          await supabase
            .from("subscriptions")
            .update({
              tier: "free",
              stripe_subscription_id: null,
              current_period_start: null,
              current_period_end: null,
            })
            .eq("user_id", userId)
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId)
          const userId = subscription.metadata.supabase_user_id

          if (userId) {
            // Log the failed payment event
            await supabase.from("usage_events").insert({
              user_id: userId,
              event_type: "payment_failed",
              metadata: {
                invoice_id: invoice.id,
                amount: invoice.amount_due,
              },
            })
          }
        }
        break
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return Response.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
