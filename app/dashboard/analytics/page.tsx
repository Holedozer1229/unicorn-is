import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BarChart3,
  TrendingUp,
  Lightbulb,
  Calendar,
  DollarSign,
  Sparkles,
  Zap,
} from "lucide-react"
import { TIER_LIMITS } from "@/lib/types"
import { getAIGenerationCount } from "@/lib/redis"
import { subDays, format, startOfDay, eachDayOfInterval } from "date-fns"
import { AnalyticsChart } from "./analytics-chart"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const [
    { data: subscription },
    { data: ideas },
    { data: plans },
    { data: suggestions },
    { data: usageEvents },
  ] = await Promise.all([
    supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
    supabase.from("content_ideas").select("*").eq("user_id", user.id),
    supabase.from("content_plans").select("*").eq("user_id", user.id),
    supabase.from("monetization_suggestions").select("*").eq("user_id", user.id),
    supabase
      .from("usage_events")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", subDays(new Date(), 30).toISOString())
      .order("created_at", { ascending: true }),
  ])

  const tier = subscription?.tier || "free"
  const limits = TIER_LIMITS[tier]
  const aiGenerations = await getAIGenerationCount(user.id)

  // Calculate stats
  const totalIdeas = ideas?.length || 0
  const publishedContent = plans?.filter((p) => p.status === "published").length || 0
  const implementedStrategies =
    suggestions?.filter((s) => s.status === "implemented").length || 0

  // Build chart data for last 7 days
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  })

  const chartData = last7Days.map((date) => {
    const dayStart = startOfDay(date)
    const dayIdeas = ideas?.filter((i) => {
      const created = new Date(i.created_at)
      return startOfDay(created).getTime() === dayStart.getTime()
    }).length || 0

    const dayPlans = plans?.filter((p) => {
      const created = new Date(p.created_at)
      return startOfDay(created).getTime() === dayStart.getTime()
    }).length || 0

    return {
      date: format(date, "EEE"),
      ideas: dayIdeas,
      plans: dayPlans,
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your content creation and growth metrics.
          </p>
        </div>
        <Badge variant="secondary">
          {limits.analyticsRetentionDays} day retention
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ideas
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIdeas}</div>
            <p className="text-xs text-muted-foreground">Content ideas saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
            <Calendar className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedContent}</div>
            <p className="text-xs text-muted-foreground">
              Content pieces published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Generations
            </CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aiGenerations}
              {limits.aiGenerationsPerMonth !== -1 && (
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / {limits.aiGenerationsPerMonth}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monetization
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{implementedStrategies}</div>
            <p className="text-xs text-muted-foreground">
              Strategies implemented
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={chartData} />
        </CardContent>
      </Card>

      {tier === "free" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="mb-1 text-lg font-semibold">
                Unlock Advanced Analytics
              </h3>
              <p className="text-sm text-muted-foreground">
                Upgrade to get 30-day or 1-year analytics history and more
                insights.
              </p>
            </div>
            <Button asChild className="mt-4 sm:mt-0">
              <Link href="/dashboard/settings?tab=billing">
                <Zap className="mr-2 h-4 w-4" />
                Upgrade
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
