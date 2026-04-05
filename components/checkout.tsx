"use client"

import { useState, useCallback, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js"
import { createCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface CheckoutProps {
  productId: string
}

export function Checkout({ productId }: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initCheckout() {
      try {
        const result = await createCheckoutSession(productId)
        if (result.url) {
          // Redirect to Stripe Checkout
          window.location.href = result.url
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to start checkout")
      }
    }
    initCheckout()
  }, [productId])

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
