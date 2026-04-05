"use client"

import { useState } from "react"
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
  Sparkles,
  Loader2,
  Lightbulb,
  MessageSquare,
  FileText,
  Hash,
  DollarSign,
  Copy,
  Check,
  Zap,
} from "lucide-react"

interface ContentStrategy {
  viralIdeas: Array<{
    title: string
    description: string
    viralPotential: "High" | "Medium" | "Low"
  }>
  hooks: Array<{
    text: string
    type: "Question" | "Statement" | "Controversial" | "Story"
  }>
  scripts: Array<{
    title: string
    intro: string
    body: string
    callToAction: string
  }>
  captions: Array<{
    text: string
    hashtags: string[]
  }>
  monetizationIdeas: Array<{
    strategy: string
    description: string
    potentialRevenue: string
    difficulty: "Easy" | "Medium" | "Hard"
  }>
}

const platforms = ["TikTok", "Instagram", "YouTube"] as const

export function DashboardClient() {
  const [niche, setNiche] = useState("")
  const [platform, setPlatform] = useState<string>("")
  const [generating, setGenerating] = useState(false)
  const [strategy, setStrategy] = useState<ContentStrategy | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function handleGenerate() {
    if (!niche.trim() || !platform) {
      setError("Please enter your niche and select a platform")
      return
    }

    setError(null)
    setGenerating(true)
    setStrategy(null)

    // Track generate click
    fetch('/api/events/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'generate_click', metadata: { niche, platform } }),
    }).catch(() => {})

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate strategy")
      }

      const data = await response.json()
      setStrategy(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setGenerating(false)
    }
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const potentialColors = {
    High: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Low: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  const difficultyColors = {
    Easy: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Hard: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  const hookTypeColors = {
    Question: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Statement: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Controversial: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Story: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Content Strategy Generator
        </h1>
        <p className="text-muted-foreground">
          Enter your niche and platform to generate viral content ideas, hooks,
          scripts, and monetization strategies.
        </p>
      </div>

      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Your Strategy
          </CardTitle>
          <CardDescription>
            AI-powered content strategy tailored to your niche
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
              <Label htmlFor="niche">Your Niche</Label>
              <Input
                id="niche"
                placeholder="e.g., fitness, tech reviews, cooking"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="bg-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-input">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-gradient w-full sm:w-auto"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Strategy...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Generate Content Strategy
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {strategy && (
        <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <Tabs defaultValue="ideas" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-muted/50">
              <TabsTrigger value="ideas" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Ideas</span>
              </TabsTrigger>
              <TabsTrigger value="hooks" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Hooks</span>
              </TabsTrigger>
              <TabsTrigger value="scripts" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Scripts</span>
              </TabsTrigger>
              <TabsTrigger value="captions" className="gap-2">
                <Hash className="h-4 w-4" />
                <span className="hidden sm:inline">Captions</span>
              </TabsTrigger>
              <TabsTrigger value="monetization" className="gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Monetize</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ideas" className="space-y-4">
              <h2 className="text-lg font-semibold">Viral Ideas</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {strategy.viralIdeas.map((idea, index) => (
                  <Card key={index} className="cosmic-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={potentialColors[idea.viralPotential]}
                        >
                          {idea.viralPotential} Potential
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            copyToClipboard(
                              `${idea.title}\n\n${idea.description}`,
                              `idea-${index}`
                            )
                          }
                        >
                          {copiedId === `idea-${index}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <CardTitle className="text-base">{idea.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {idea.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hooks" className="space-y-4">
              <h2 className="text-lg font-semibold">Attention-Grabbing Hooks</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {strategy.hooks.map((hook, index) => (
                  <Card key={index} className="cosmic-card">
                    <CardContent className="pt-6">
                      <div className="mb-3 flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={hookTypeColors[hook.type]}
                        >
                          {hook.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            copyToClipboard(hook.text, `hook-${index}`)
                          }
                        >
                          {copiedId === `hook-${index}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-lg font-medium leading-relaxed">
                        &ldquo;{hook.text}&rdquo;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scripts" className="space-y-4">
              <h2 className="text-lg font-semibold">Short-Form Scripts</h2>
              <div className="space-y-4">
                {strategy.scripts.map((script, index) => (
                  <Card key={index} className="cosmic-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {script.title}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            copyToClipboard(
                              `${script.intro}\n\n${script.body}\n\n${script.callToAction}`,
                              `script-${index}`
                            )
                          }
                        >
                          {copiedId === `script-${index}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                          Hook / Intro
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {script.intro}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
                          Body
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {script.body}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-400">
                          Call to Action
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {script.callToAction}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="captions" className="space-y-4">
              <h2 className="text-lg font-semibold">Captions & Hashtags</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {strategy.captions.map((caption, index) => (
                  <Card key={index} className="cosmic-card">
                    <CardContent className="pt-6">
                      <div className="mb-3 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            copyToClipboard(
                              `${caption.text}\n\n${caption.hashtags.map((h) => `#${h}`).join(" ")}`,
                              `caption-${index}`
                            )
                          }
                        >
                          {copiedId === `caption-${index}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="mb-4 text-sm leading-relaxed">
                        {caption.text}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {caption.hashtags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monetization" className="space-y-4">
              <h2 className="text-lg font-semibold">Monetization Strategies</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {strategy.monetizationIdeas.map((idea, index) => (
                  <Card key={index} className="cosmic-card">
                    <CardHeader className="pb-2">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={difficultyColors[idea.difficulty]}
                        >
                          {idea.difficulty}
                        </Badge>
                        <span className="text-sm font-semibold text-green-400">
                          {idea.potentialRevenue}
                        </span>
                      </div>
                      <CardTitle className="text-base">
                        {idea.strategy}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {idea.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
