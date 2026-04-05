"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { ContentPlan, ContentIdea, SubscriptionTier } from "@/lib/types"
import { PLATFORMS } from "@/lib/types"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Calendar,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  FileText,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { format, parseISO, isAfter, isBefore, startOfToday } from "date-fns"

interface PlannerClientProps {
  plans: ContentPlan[]
  ideas: ContentIdea[]
  tier: SubscriptionTier
  scheduledLimit: number
}

export function PlannerClient({
  plans,
  ideas,
  tier,
  scheduledLimit,
}: PlannerClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const linkedIdeaId = searchParams.get("idea")
  
  const [dialogOpen, setDialogOpen] = useState(!!linkedIdeaId)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedIdea, setSelectedIdea] = useState<string>(linkedIdeaId || "")

  const scheduledCount = plans.filter((p) => p.status === "scheduled").length
  const canScheduleMore = scheduledLimit === -1 || scheduledCount < scheduledLimit

  const today = startOfToday()
  const upcomingPlans = plans.filter(
    (p) => p.scheduled_date && isAfter(parseISO(p.scheduled_date), today)
  )
  const pastPlans = plans.filter(
    (p) => p.scheduled_date && isBefore(parseISO(p.scheduled_date), today)
  )
  const draftPlans = plans.filter((p) => p.status === "draft")

  async function handleCreatePlan() {
    if (!title.trim() || selectedPlatforms.length === 0) {
      setError("Please enter a title and select at least one platform")
      return
    }

    setError(null)
    setCreating(true)

    try {
      const response = await fetch("/api/content/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          scheduled_date: scheduledDate || null,
          platforms: selectedPlatforms,
          content_idea_id: selectedIdea || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create plan")
      }

      setDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      setError("Failed to create content plan")
    } finally {
      setCreating(false)
    }
  }

  async function updatePlanStatus(planId: string, status: string) {
    try {
      const response = await fetch("/api/content/plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: planId, status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update plan")
      }

      router.refresh()
    } catch (err) {
      setError("Failed to update plan")
    }
  }

  async function deletePlan(planId: string) {
    try {
      const response = await fetch(`/api/content/plans?id=${planId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete plan")
      }

      router.refresh()
    } catch (err) {
      setError("Failed to delete plan")
    }
  }

  function resetForm() {
    setTitle("")
    setDescription("")
    setScheduledDate("")
    setSelectedPlatforms([])
    setSelectedIdea("")
  }

  function togglePlatform(platform: string) {
    setSelectedPlatforms((prev) =>
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
            Content Planner
          </h1>
          <p className="text-muted-foreground">
            Schedule and manage your content calendar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!canScheduleMore && (
            <Button asChild variant="outline">
              <Link href="/dashboard/settings?tab=billing">
                <Zap className="mr-2 h-4 w-4" />
                Upgrade
              </Link>
            </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!canScheduleMore}>
                <Plus className="mr-2 h-4 w-4" />
                New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Content Plan</DialogTitle>
                <DialogDescription>
                  Plan and schedule your content for publishing.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {ideas.length > 0 && (
                  <div className="space-y-2">
                    <Label>From Saved Idea (optional)</Label>
                    <Select value={selectedIdea} onValueChange={setSelectedIdea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an idea" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No idea selected</SelectItem>
                        {ideas.map((idea) => (
                          <SelectItem key={idea.id} value={idea.id}>
                            {idea.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Content title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the content"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Schedule Date (optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={format(today, "yyyy-MM-dd")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Platforms</Label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((platform) => (
                      <Badge
                        key={platform}
                        variant={
                          selectedPlatforms.includes(platform)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => togglePlatform(platform)}
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreatePlan} disabled={creating}>
                  {creating ? "Creating..." : "Create Plan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-amber-500" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scheduledCount}
              {scheduledLimit !== -1 && (
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / {scheduledLimit}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-blue-500" />
              Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftPlans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.filter((p) => p.status === "published").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingPlans.length})
          </TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftPlans.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastPlans.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingPlans.length > 0 ? (
            <div className="space-y-4">
              {upcomingPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onStatusChange={updatePlanStatus}
                  onDelete={deletePlan}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No upcoming content"
              description="Schedule your next piece of content"
            />
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {draftPlans.length > 0 ? (
            <div className="space-y-4">
              {draftPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onStatusChange={updatePlanStatus}
                  onDelete={deletePlan}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No drafts"
              description="Create a draft to plan content without scheduling"
            />
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastPlans.length > 0 ? (
            <div className="space-y-4">
              {pastPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onStatusChange={updatePlanStatus}
                  onDelete={deletePlan}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="No past content"
              description="Your published content will appear here"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PlanCard({
  plan,
  onStatusChange,
  onDelete,
}: {
  plan: ContentPlan
  onStatusChange: (id: string, status: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium">{plan.title}</h3>
            <Badge variant={plan.status === "published" ? "default" : "secondary"}>
              {plan.status}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {plan.scheduled_date && (
              <span>{format(parseISO(plan.scheduled_date), "MMM d, yyyy")}</span>
            )}
            <span className="hidden sm:inline">-</span>
            <span className="hidden sm:inline">
              {plan.platforms.join(", ")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {plan.status !== "published" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(plan.id, "published")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Published
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onDelete(plan.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Icon className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
