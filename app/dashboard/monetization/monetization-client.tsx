"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Profile, MonetizationSuggestion, SubscriptionTier } from "@/lib/types"
import { PLATFORMS, NICHES } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  DollarSign,
  Sparkles,
  Loader2,
  TrendingUp,
  Lock,
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react"
import Link from "next/link"

interface MonetizationClientProps {
  profile: Profile | null
  suggestions: MonetizationSuggestion[]
  tier: SubscriptionTier
  remainingGenerations: number
}

export function MonetizationClient({
  profile,
  suggestions,
  tier,
  remainingGenerations,
}: MonetizationClientProps) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [niche, setNiche] = useState(profile?.niche || "")
  const [audienceSize, setAudienceSize] = useState(
    profile?.audience_size?.toString() || ""
  )
  const [platforms, setPlatforms] = useState<string[]>(profile?.platforms || [])

  const isPaidTier = tier !== "free"
  const canGenerate =
    isPaidTier && (remainingGenerations === -1 || remainingGenerations > 0)

  const newSuggestions = suggestions.filter((s) => s.status === "new")
  const consideringSuggestions = suggestions.filter(
    (s) => s.status === "considering"
  )
  const implementedSuggestions = suggestions.filter(
    (s) => s.status === "implemented"
  )

  async function handleGenerate() {
    setError(null)
    setGenerating(true)

    try {
      const response = await fetch("/api/ai/monetization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          platforms,
          audienceSize: parseInt(audienceSize) || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate suggestions")
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setGenerating(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const response = await fetch("/api/monetization/suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update suggestion")
      }

      router.refresh()
    } catch (err) {
      setError("Failed to update suggestion")
    }
  }

  function togglePlatform(platform: string) {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Monetization
          </h1>
          <p className="text-muted-foreground">
            AI-powered revenue strategies for your creator business.
          </p>
        </div>
        {!isPaidTier && (
          <Button asChild>
            <Link href="/dashboard/settings?tab=billing">
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to unlock
            </Link>
          </Button>
        )}
      </div>

      {!isPaidTier ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Unlock Monetization AI
            </h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              Get personalized revenue strategies, sponsorship opportunities,
              and product ideas tailored to your audience with the Creator or
              Pro plan.
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard/settings?tab=billing">
                <Zap className="mr-2 h-4 w-4" />
                Upgrade Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generate Monetization Strategies
              </CardTitle>
              <CardDescription>
                {canGenerate
                  ? `${remainingGenerations === -1 ? "Unlimited" : remainingGenerations} generations remaining this month`
                  : "You've reached your generation limit this month"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Your Niche</Label>
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
                    placeholder="e.g., 10000"
                    value={audienceSize}
                    onChange={(e) => setAudienceSize(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Your Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.slice(0, 8).map((platform) => (
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

              <Button
                onClick={handleGenerate}
                disabled={generating || !canGenerate}
                className="w-full sm:w-auto"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Strategies
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Tabs defaultValue="new" className="space-y-6">
            <TabsList>
              <TabsTrigger value="new">
                New ({newSuggestions.length})
              </TabsTrigger>
              <TabsTrigger value="considering">
                Considering ({consideringSuggestions.length})
              </TabsTrigger>
              <TabsTrigger value="implemented">
                Implemented ({implementedSuggestions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="space-y-4">
              {newSuggestions.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {newSuggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onUpdateStatus={updateStatus}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No new suggestions"
                  description="Generate monetization strategies to get personalized recommendations"
                />
              )}
            </TabsContent>

            <TabsContent value="considering" className="space-y-4">
              {consideringSuggestions.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {consideringSuggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onUpdateStatus={updateStatus}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No strategies under consideration"
                  description="Move strategies here that you're actively exploring"
                />
              )}
            </TabsContent>

            <TabsContent value="implemented" className="space-y-4">
              {implementedSuggestions.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {implementedSuggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onUpdateStatus={updateStatus}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No implemented strategies"
                  description="Mark strategies as implemented to track your progress"
                />
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

function SuggestionCard({
  suggestion,
  onUpdateStatus,
}: {
  suggestion: MonetizationSuggestion
  onUpdateStatus: (id: string, status: string) => void
}) {
  const difficultyColor = {
    easy: "text-emerald-500",
    medium: "text-amber-500",
    hard: "text-red-500",
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="secondary">{suggestion.suggestion_type}</Badge>
          <span className={`text-xs font-medium ${difficultyColor[suggestion.difficulty]}`}>
            {suggestion.difficulty.charAt(0).toUpperCase() +
              suggestion.difficulty.slice(1)}
          </span>
        </div>
        <CardTitle className="text-base">{suggestion.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {suggestion.description && (
          <p className="mb-4 text-sm text-muted-foreground">
            {suggestion.description}
          </p>
        )}

        {suggestion.potential_revenue && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">
              ${(suggestion.potential_revenue / 100).toLocaleString()}/mo
              potential
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {suggestion.status === "new" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(suggestion.id, "considering")}
              >
                <Eye className="mr-2 h-4 w-4" />
                Consider
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onUpdateStatus(suggestion.id, "dismissed")}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Dismiss
              </Button>
            </>
          )}
          {suggestion.status === "considering" && (
            <>
              <Button
                size="sm"
                onClick={() => onUpdateStatus(suggestion.id, "implemented")}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Implemented
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onUpdateStatus(suggestion.id, "dismissed")}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Dismiss
              </Button>
            </>
          )}
          {suggestion.status === "implemented" && (
            <Badge className="bg-emerald-500">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Active
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <DollarSign className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
