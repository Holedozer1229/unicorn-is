"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  Zap,
  DollarSign,
  Users,
  Check,
  Play,
  BarChart3,
  Rocket,
  Star,
} from "lucide-react"

const ctaVariants = [
  { id: '1', text: 'Start Free' },
  { id: '2', text: 'Go Viral Today' },
  { id: '3', text: 'Get Your First Viral Post' },
  { id: '4', text: 'Turn Content into Income' },
]

export default function HomePage() {
  const [activeCTA, setActiveCTA] = useState(ctaVariants[0])
  const [isTracked, setIsTracked] = useState(false)

  useEffect(() => {
    fetch('/api/growth/stats')
      .then(res => res.json())
      .then(data => {
        if (data.bestCTA) {
          const variant = ctaVariants.find(v => v.id === data.bestCTA.id)
          if (variant) setActiveCTA(variant)
        }
      })
      .catch(() => {})

    if (!isTracked) {
      fetch('/api/events/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'page_view' }),
      }).catch(() => {})
      setIsTracked(true)
    }
  }, [isTracked])

  const handleCTAClick = () => {
    fetch('/api/events/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'cta_click', ctaId: activeCTA.id }),
    }).catch(() => {})
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient">CreatorOS</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/analytics" className="text-sm text-muted-foreground hover:text-foreground">
              Analytics
            </Link>
            <Link href="/billing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Button asChild className="btn-gradient" onClick={handleCTAClick}>
              <Link href="/dashboard">
                {activeCTA.text}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 starfield opacity-30" />
          <div className="container relative mx-auto px-4 py-20 text-center md:py-32">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              AI-Powered Growth Engine
            </Badge>
            <h1 className="mx-auto mb-6 max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Go Viral Every Day{" "}
              <span className="text-gradient">with AI</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              Your personal AI growth engine. Generate viral content, track performance, 
              and turn your audience into income - automatically.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="btn-gradient glow-primary text-lg px-8" onClick={handleCTAClick}>
                <Link href="/dashboard">
                  <Zap className="mr-2 h-5 w-5" />
                  {activeCTA.text}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link href="#features">
                  <Play className="mr-2 h-5 w-5" />
                  See Features
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. Start creating in 30 seconds.
            </p>
          </div>
        </section>

        <section className="border-y border-border/50 bg-muted/5 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient">10,000+</p>
                <p className="text-sm text-muted-foreground">Active Creators</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient">2.5M+</p>
                <p className="text-sm text-muted-foreground">Posts Generated</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient">500M+</p>
                <p className="text-sm text-muted-foreground">Views Driven</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient">4.9/5</p>
                <p className="text-sm text-muted-foreground">Creator Rating</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Your Complete Growth Stack
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Everything you need to go viral, grow your audience, and monetize your content.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="cosmic-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI Content Factory</h3>
                <p className="text-muted-foreground">
                  Generate viral hooks, scripts, captions, and CTAs daily. 
                  Our AI learns what works in your niche.
                </p>
              </Card>

              <Card className="cosmic-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Growth Analytics</h3>
                <p className="text-muted-foreground">
                  Track views, signups, and conversions. See exactly what content 
                  drives the most growth.
                </p>
              </Card>

              <Card className="cosmic-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Monetization Engine</h3>
                <p className="text-muted-foreground">
                  Turn followers into revenue with AI-optimized CTAs, 
                  pricing strategies, and conversion funnels.
                </p>
              </Card>

              <Card className="cosmic-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Rocket className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Auto Optimization</h3>
                <p className="text-muted-foreground">
                  AI continuously tests and improves your content, CTAs, 
                  and funnels for maximum conversion.
                </p>
              </Card>

              <Card className="cosmic-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Creator Market</h3>
                <p className="text-muted-foreground">
                  Discover top creators, analyze their strategies, 
                  and find collaboration opportunities.
                </p>
              </Card>

              <Card className="cosmic-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Content Scheduler</h3>
                <p className="text-muted-foreground">
                  Schedule your content at optimal times. 
                  Never miss a posting window again.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-muted/10 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Start free and upgrade as you grow. No hidden fees.
              </p>
            </div>

            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
              <Card className="cosmic-card p-6">
                <h3 className="mb-2 text-xl font-semibold">Free</h3>
                <p className="mb-4 text-3xl font-bold">$0<span className="text-sm text-muted-foreground">/mo</span></p>
                <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> 5 AI generations/day
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Basic analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> 1 platform
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </Card>

              <Card className="cosmic-card relative p-6 border-primary/50">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Most Popular</Badge>
                <h3 className="mb-2 text-xl font-semibold">Pro</h3>
                <p className="mb-4 text-3xl font-bold">$29<span className="text-sm text-muted-foreground">/mo</span></p>
                <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Unlimited generations
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Full analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> All platforms
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Content scheduler
                  </li>
                </ul>
                <Button asChild className="w-full btn-gradient">
                  <Link href="/billing">Upgrade to Pro</Link>
                </Button>
              </Card>

              <Card className="cosmic-card p-6">
                <h3 className="mb-2 text-xl font-semibold">Enterprise</h3>
                <p className="mb-4 text-3xl font-bold">Custom</p>
                <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> API access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Dedicated support
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/billing">Contact Sales</Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Creators Love Us
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Sarah M.",
                  handle: "@sarahcreates",
                  text: "Went from 1K to 100K followers in 3 months using CreatorOS. The AI hooks are insane.",
                  avatar: "S",
                },
                {
                  name: "Marcus J.",
                  handle: "@marcusmoney",
                  text: "Finally hit $10K/month from my content. The monetization strategies actually work.",
                  avatar: "M",
                },
                {
                  name: "Emma T.",
                  handle: "@emmatech",
                  text: "I post 3x more content now with 10x less effort. This is the future of content creation.",
                  avatar: "E",
                },
              ].map((testimonial, i) => (
                <Card key={i} className="cosmic-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.handle}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.text}</p>
                  <div className="mt-4 flex text-yellow-500">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Go Viral?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              Join 10,000+ creators who are growing faster with AI.
              Get your first viral post in under 30 seconds.
            </p>
            <Button asChild size="lg" className="btn-gradient glow-primary text-lg px-8" onClick={handleCTAClick}>
              <Link href="/dashboard">
                <Zap className="mr-2 h-5 w-5" />
                {activeCTA.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">CreatorOS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with CreatorOS - Your AI Growth Engine
          </p>
        </div>
      </footer>
    </div>
  )
}
