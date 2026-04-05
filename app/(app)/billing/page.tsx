"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Check,
  X,
  Zap,
  Crown,
  Sparkles,
  TrendingUp,
  BarChart3,
  Calendar,
  Users,
  Rocket,
  CreditCard,
  Lock,
} from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      { text: "5 AI generations per day", included: true },
      { text: "Basic analytics", included: true },
      { text: "1 platform (TikTok, IG, or YT)", included: true },
      { text: "Standard content templates", included: true },
      { text: "Email support", included: true },
      { text: "Unlimited generations", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Content scheduler", included: false },
      { text: "AI growth analysis", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Current Plan",
    popular: false,
    current: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious creators ready to grow",
    features: [
      { text: "Unlimited AI generations", included: true },
      { text: "Full analytics dashboard", included: true },
      { text: "All platforms supported", included: true },
      { text: "Premium content templates", included: true },
      { text: "Priority email support", included: true },
      { text: "Content scheduler", included: true },
      { text: "AI growth analysis", included: true },
      { text: "CTA A/B testing", included: true },
      { text: "Export to all formats", included: true },
      { text: "API access", included: false },
    ],
    cta: "Upgrade to Pro",
    popular: true,
    current: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and agencies",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited team members", included: true },
      { text: "API access", included: true },
      { text: "Custom integrations", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom AI training", included: true },
      { text: "White-label options", included: true },
      { text: "SLA guarantee", included: true },
      { text: "Onboarding & training", included: true },
      { text: "24/7 phone support", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
    current: false,
  },
]

const usageStats = {
  generationsUsed: 4,
  generationsLimit: 5,
  daysUntilReset: 1,
}

export default function BillingPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("")

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName)
    setShowUpgradeModal(true)
    
    // Track upgrade intent
    fetch('/api/events/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'upgrade', metadata: { plan: planName } }),
    }).catch(() => {})
  }

  const usagePercent = (usageStats.generationsUsed / usageStats.generationsLimit) * 100

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and usage</p>
      </div>

      {/* Usage Warning Banner */}
      {usagePercent >= 80 && (
        <Card className="mb-8 border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="font-semibold">Running low on generations!</p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ve used {usageStats.generationsUsed} of {usageStats.generationsLimit} daily generations. 
                  Resets in {usageStats.daysUntilReset} day.
                </p>
              </div>
            </div>
            <Button className="btn-gradient" onClick={() => handleUpgrade("Pro")}>
              <Rocket className="mr-2 h-4 w-4" />
              Upgrade for Unlimited
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Usage */}
      <Card className="cosmic-card mb-8">
        <CardHeader>
          <CardTitle>Current Usage</CardTitle>
          <CardDescription>Your usage for the current billing period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>AI Generations</span>
                <span className="text-muted-foreground">
                  {usageStats.generationsUsed}/{usageStats.generationsLimit} today
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted/30">
                <div
                  className={`h-full rounded-full transition-all ${
                    usagePercent >= 80 
                      ? 'bg-gradient-to-r from-yellow-500 to-red-500' 
                      : 'bg-gradient-to-r from-primary to-accent'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/30">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Free Plan</p>
                <p className="text-sm text-muted-foreground">Resets daily at midnight</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground">Get unlimited generations</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold">Choose Your Plan</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`cosmic-card relative ${
                plan.popular ? 'border-primary/50 ring-2 ring-primary/20' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  {plan.name === "Pro" && <Crown className="h-5 w-5 text-primary" />}
                  {plan.name === "Enterprise" && <Sparkles className="h-5 w-5 text-accent" />}
                  {plan.name}
                </CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/50" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground/50'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.popular ? 'btn-gradient' : ''}`}
                  variant={plan.current ? "secondary" : plan.popular ? "default" : "outline"}
                  disabled={plan.current}
                  onClick={() => !plan.current && handleUpgrade(plan.name)}
                >
                  {plan.current && <Check className="mr-2 h-4 w-4" />}
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <Card className="cosmic-card mb-8">
        <CardHeader>
          <CardTitle>Why Upgrade to Pro?</CardTitle>
          <CardDescription>Unlock powerful features to supercharge your growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-1 font-semibold">Unlimited Generations</h3>
              <p className="text-sm text-muted-foreground">
                Create as much content as you need, whenever you need it
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-1 font-semibold">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Deep insights into your content performance and growth
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mb-1 font-semibold">AI Growth Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Get AI-powered recommendations to optimize your strategy
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                <Users className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="mb-1 font-semibold">All Platforms</h3>
              <p className="text-sm text-muted-foreground">
                Optimize content for TikTok, Instagram, YouTube, and more
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-1 font-semibold">Can I cancel anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">What payment methods do you accept?</h4>
            <p className="text-sm text-muted-foreground">
              We accept all major credit cards, debit cards, and PayPal.
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Is there a free trial for Pro?</h4>
            <p className="text-sm text-muted-foreground">
              You can use the Free plan to try CreatorOS. When you&apos;re ready to unlock unlimited features, upgrade to Pro.
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">What happens to my content if I downgrade?</h4>
            <p className="text-sm text-muted-foreground">
              All your generated content remains accessible. You&apos;ll just be limited to Free plan generation limits.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Upgrade to {selectedPlan}
            </DialogTitle>
            <DialogDescription>
              Unlock unlimited growth potential with CreatorOS {selectedPlan}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium">{selectedPlan} Plan</span>
                <span className="text-xl font-bold">
                  {selectedPlan === "Pro" ? "$29/mo" : "Custom"}
                </span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Unlimited AI generations
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Full analytics & AI insights
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  All platforms supported
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Secure checkout powered by Stripe</span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowUpgradeModal(false)}>
                Cancel
              </Button>
              <Button className="btn-gradient flex-1">
                <CreditCard className="mr-2 h-4 w-4" />
                {selectedPlan === "Enterprise" ? "Contact Sales" : "Checkout"}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By upgrading, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
