"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import type { Profile, Subscription, SubscriptionTier, TierLimits } from "@/lib/types"
import { PLATFORMS, NICHES, SUBSCRIPTION_PRICES } from "@/lib/types"
import { createCheckoutSession, createBillingPortalSession } from "@/app/actions/stripe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  User as UserIcon,
  CreditCard,
  Check,
  Crown,
  Zap,
  Loader2,
  ExternalLink,
} from "lucide-react"

interface SettingsClientProps {
  user: User
  profile: Profile | null
  subscription: Subscription | null
  tier: SubscriptionTier
  limits: TierLimits
  aiGenerations: number
}

export function SettingsClient({
  user,
  profile,
  subscription,
  tier,
  limits,
  aiGenerations,
}: SettingsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "profile"
  const success = searchParams.get("success")
  const canceled = searchParams.get("canceled")

  const [saving, setSaving] = useState(false)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(
    success ? "Your subscription has been updated!" : null
  )

  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [niche, setNiche] = useState(profile?.niche || "")
  const [platforms, setPlatforms] = useState<string[]>(profile?.platforms || [])
  const [audienceSize, setAudienceSize] = useState(
    profile?.audience_size?.toString() || ""
  )

  async function handleSaveProfile() {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          niche,
          platforms,
          audience_size: parseInt(audienceSize) || 0,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save profile")
      }

      setSuccessMessage("Profile saved successfully!")
      router.refresh()
    } catch (err) {
      setError("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  async function handleUpgrade(productId: string) {
    setUpgrading(productId)
    setError(null)

    try {
      const result = await createCheckoutSession(productId)
      if (result.url) {
        window.location.href = result.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout")
      setUpgrading(null)
    }
  }

  async function handleManageBilling() {
    setError(null)

    try {
      const result = await createBillingPortalSession()
      if (result.url) {
        window.location.href = result.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open billing portal")
    }
  }

  function togglePlatform(platform: string) {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  const usagePercentage =
    limits.aiGenerationsPerMonth === -1
      ? 0
      : (aiGenerations / limits.aiGenerationsPerMonth) * 100

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and subscription.
        </p>
      </div>

      {(error || successMessage) && (
        <div
          className={`rounded-md p-3 text-sm ${
            error
              ? "bg-destructive/10 text-destructive"
              : "bg-emerald-500/10 text-emerald-600"
          }`}
        >
          {error || successMessage}
        </div>
      )}

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your creator profile to get personalized recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email || ""} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your creator name"
                />
              </div>

              <div className="space-y-2">
                <Label>Niche</Label>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {NICHES.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Audience Size</Label>
                <Input
                  id="audience"
                  type="number"
                  value={audienceSize}
                  onChange={(e) => setAudienceSize(e.target.value)}
                  placeholder="e.g., 10000"
                />
              </div>

              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((platform) => (
                    <Badge
                      key={platform}
                      variant={
                        platforms.includes(platform) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => togglePlatform(platform)}
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Current Plan
                <Badge
                  variant={tier === "pro" ? "default" : "secondary"}
                  className="ml-2"
                >
                  {tier === "pro" && <Crown className="mr-1 h-3 w-3" />}
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </Badge>
              </CardTitle>
              <CardDescription>
                {tier === "free"
                  ? "You're on the free plan. Upgrade to unlock more features."
                  : tier === "creator"
                    ? "You're on the Creator plan."
                    : "You're on the Pro plan with unlimited access."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>AI Generations</span>
                  <span>
                    {aiGenerations} /{" "}
                    {limits.aiGenerationsPerMonth === -1
                      ? "Unlimited"
                      : limits.aiGenerationsPerMonth}
                  </span>
                </div>
                {limits.aiGenerationsPerMonth !== -1 && (
                  <Progress value={usagePercentage} className="h-2" />
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Your Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {limits.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            {tier !== "free" && (
              <CardFooter>
                <Button variant="outline" onClick={handleManageBilling}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Manage Billing
                </Button>
              </CardFooter>
            )}
          </Card>

          {tier !== "pro" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {tier === "free" && (
                <Card className="border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Creator
                    </CardTitle>
                    <CardDescription>
                      Perfect for growing creators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">$19</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500" />
                        100 AI generations/month
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500" />
                        Monetization suggestions
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500" />
                        30-day analytics
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleUpgrade("creator-monthly")}
                      disabled={upgrading === "creator-monthly"}
                    >
                      {upgrading === "creator-monthly" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="mr-2 h-4 w-4" />
                      )}
                      Upgrade to Creator
                    </Button>
                  </CardFooter>
                </Card>
              )}

              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-500" />
                      Pro
                    </CardTitle>
                    <Badge>Most Popular</Badge>
                  </div>
                  <CardDescription>For professional creators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$49</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      Unlimited AI generations
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      Advanced monetization AI
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      1-year analytics history
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      Priority support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade("pro-monthly")}
                    disabled={upgrading === "pro-monthly"}
                  >
                    {upgrading === "pro-monthly" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Crown className="mr-2 h-4 w-4" />
                    )}
                    Upgrade to Pro
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
