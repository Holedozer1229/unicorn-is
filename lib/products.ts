export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval: "month" | "year"
  tier: "creator" | "pro"
  features: string[]
}

export const PRODUCTS: Product[] = [
  {
    id: "creator-monthly",
    name: "Creator Plan - Monthly",
    description: "Perfect for growing creators ready to scale their content",
    priceInCents: 1900,
    interval: "month",
    tier: "creator",
    features: [
      "100 AI generations/month",
      "250 saved ideas",
      "50 scheduled posts",
      "30-day analytics",
      "Monetization suggestions",
      "Export content plans",
    ],
  },
  {
    id: "creator-yearly",
    name: "Creator Plan - Yearly",
    description: "Perfect for growing creators ready to scale their content",
    priceInCents: 19000,
    interval: "year",
    tier: "creator",
    features: [
      "100 AI generations/month",
      "250 saved ideas",
      "50 scheduled posts",
      "30-day analytics",
      "Monetization suggestions",
      "Export content plans",
      "2 months free!",
    ],
  },
  {
    id: "pro-monthly",
    name: "Pro Plan - Monthly",
    description: "For professional creators and agencies",
    priceInCents: 4900,
    interval: "month",
    tier: "pro",
    features: [
      "Unlimited AI generations",
      "Unlimited saved ideas",
      "Unlimited scheduled posts",
      "1-year analytics history",
      "Advanced monetization AI",
      "Priority support",
      "API access",
      "Team collaboration",
    ],
  },
  {
    id: "pro-yearly",
    name: "Pro Plan - Yearly",
    description: "For professional creators and agencies",
    priceInCents: 49000,
    interval: "year",
    tier: "pro",
    features: [
      "Unlimited AI generations",
      "Unlimited saved ideas",
      "Unlimited scheduled posts",
      "1-year analytics history",
      "Advanced monetization AI",
      "Priority support",
      "API access",
      "Team collaboration",
      "2 months free!",
    ],
  },
]

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getProductsByTier(tier: "creator" | "pro"): Product[] {
  return PRODUCTS.filter((p) => p.tier === tier)
}
