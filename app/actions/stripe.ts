"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getProduct } from "@/lib/products"

export async function createCheckoutSession(productId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to subscribe")
  }

  const product = getProduct(productId)
  if (!product) {
    throw new Error("Invalid product")
  }

  // Get or create Stripe customer
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single()

  let customerId = subscription?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    })
    customerId = customer.id

    await supabase
      .from("subscriptions")
      .update({ stripe_customer_id: customerId })
      .eq("user_id", user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: {
            interval: product.interval,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?tab=billing&success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?tab=billing&canceled=true`,
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        tier: product.tier,
      },
    },
  })

  return { sessionId: session.id, url: session.url }
}

export async function createBillingPortalSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in")
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single()

  if (!subscription?.stripe_customer_id) {
    throw new Error("No subscription found")
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?tab=billing`,
  })

  return { url: session.url }
}
