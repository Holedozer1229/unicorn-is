"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Profile, ContentIdea, SubscriptionTier } from "@/lib/types"
import { PLATFORMS, CONTENT_FORMATS } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Sparkles,
  Loader2,
  Lightbulb,
  Plus,
  Trash2,
  Calendar,
  Zap,
} from "lucide-react"
import Link from "next/link"

interface ContentEngineClientProps {
  userId: string
  profile: Profile | null
  ideas: ContentIdea[]
  tier: SubscriptionTier
  remainingGenerations: number
}

export function ContentEngineClient({
  userId,
  profile,
  ideas,
  tier,
  remainingGenerations,
}: ContentEngineClientProps) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [generatedIdeas, setGeneratedIdeas] = useState<
    Array<{ title: string; description: string; format: string }>
  >([])
  const [topic, setTopic] = useState("")
  const [platform, setPlatform] = useState<string>("")
  const [format, setFormat] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const canGenerate = remainingGenerations === -1 || remainingGenerations > 0

  async function handleGenerate() {
    if (!topic.trim() || !platform) {
      setError("Please enter a topic and select a platform")
      return
    }

    setError(null)
    setGenerating(true)
    setGeneratedIdeas([])

    try {
      const response = await fetch("/api/ai/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platform,
          format: format || undefined,
          niche: profile?.niche,
          audienceSize: profile?.audience_size,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate ideas")
      }

      const data = await response.json()
      setGeneratedIdeas(data.ideas)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setGenerating(false)
    }
  }

  async function saveIdea(idea: {
    title: string
    description: string
    format: string
  }) {
    try {
      const response = await fetch("/api/content/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          format: idea.format,
          platform,
          ai_generated: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save idea")
      }

      setGeneratedIdeas((prev) =>
        prev.filter((i) => i.title !== idea.title)
      )
      router.refresh()
    } catch (err) {
      setError("Failed to save idea")
    }
  }

  async function deleteIdea(ideaId: string) {
    try {
      const response = await fetch(`/api/content/ideas?id=${ideaId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete idea")
      }

      router.refresh()
    } catch (err) {
      setError("Failed to delete idea")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Content Engine
          </h1>
          <p className="text-muted-foreground">
            Generate AI-powered content ideas tailored to your audience.
          </p>
        </div>
        {!canGenerate && (
          <Button asChild>
            <Link href="/dashboard/settings?tab=billing">
              <Zap className="mr-2 h-4 w-4" />
              Upgrade for more generations
            </Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Ideas</TabsTrigger>
          <TabsTrigger value="saved">
            Saved Ideas ({ideas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Content Generator
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
                  <Label htmlFor="topic">Topic or Theme</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., productivity tips for remote workers"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={!canGenerate}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={platform}
                    onValueChange={setPlatform}
                    disabled={!canGenerate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Content Format (optional)</Label>
                <Select
                  value={format}
                  onValueChange={setFormat}
                  disabled={!canGenerate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any format</SelectItem>
                    {CONTENT_FORMATS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !canGenerate}
                className="w-full sm:w-auto"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Ideas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedIdeas.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Generated Ideas</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {generatedIdeas.map((idea, index) => (
                  <Card key={index} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <Badge variant="secondary" className="mb-2 w-fit">
                        {idea.format}
                      </Badge>
                      <CardTitle className="text-base">{idea.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col">
                      <p className="mb-4 flex-1 text-sm text-muted-foreground">
                        {idea.description}
                      </p>
                      <Button
                        onClick={() => saveIdea(idea)}
                        size="sm"
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Save Idea
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          {ideas.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea) => (
                <Card key={idea.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="secondary">{idea.format}</Badge>
                      <Badge variant="outline">{idea.status}</Badge>
                    </div>
                    <CardTitle className="text-base">{idea.title}</CardTitle>
                    <CardDescription>{idea.platform}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    {idea.description && (
                      <p className="mb-4 flex-1 text-sm text-muted-foreground">
                        {idea.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Link
                          href={`/dashboard/planner?idea=${idea.id}`}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteIdea(idea.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Lightbulb className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-semibold">No saved ideas yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Generate your first content ideas using AI
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
