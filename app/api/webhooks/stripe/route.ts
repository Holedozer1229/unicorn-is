import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("Webhook signature error:", err.message)
    return new Response("Webhook error: " + err.message, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        const tier = session.metadata?.tier as "creator" | "pro" | undefined
        if (!userId) break
        const sub = session.subscription ? await stripe.subscriptions.retrieve(session.subscription as string) : null
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          stripe_price_id: sub?.items?.data?.[0]?.price?.id ?? null,
          status: sub?.status ?? "active",
          tier: tier ?? "creator",
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" })
        break
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) break
        const priceId = sub.items?.data?.[0]?.price?.id
        let tier: "free" | "creator" | "pro" = "free"
        if (sub.status === "active" || sub.status === "trialing") {
          if (priceId === process.env.STRIPE_PRICE_CREATOR) tier = "creator"
          if (priceId === process.env.STRIPE_PRICE_PRO) tier = "pro"
        }
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_subscription_id: sub.id,
          stripe_price_id: priceId ?? null,
          status: sub.status,
          tier,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" })
        break
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        console.error("Payment failed for customer:", invoice.customer)
        break
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err)
    return new Response("Handler error", { status: 500 })
  }

  return new Response("ok", { status: 200 })
}