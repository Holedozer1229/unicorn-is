import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Lightbulb,
  Calendar,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { TIER_LIMITS } from "@/lib/types"
import { getAIGenerationCount } from "@/lib/redis"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user data
  const [
    { data: profile },
    { data: subscription },
    { data: ideas },
    { data: plans },
    { data: suggestions },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
    supabase
      .from("content_ideas")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("content_plans")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_date", { ascending: true })
      .limit(5),
    supabase
      .from("monetization_suggestions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "new")
      .limit(3),
  ])

  const tier = subscription?.tier || "free"
  const limits = TIER_LIMITS[tier]
  const aiGenerations = await getAIGenerationCount(user.id)

  const stats = [
    {
      title: "Content Ideas",
      value: ideas?.length || 0,
      icon: Lightbulb,
      href: "/dashboard/content",
      color: "text-blue-500",
    },
    {
      title: "Scheduled Posts",
      value: plans?.filter((p) => p.status === "scheduled").length || 0,
      icon: Calendar,
      href: "/dashboard/planner",
      color: "text-emerald-500",
    },
    {
      title: "Monetization Tips",
      value: suggestions?.length || 0,
      icon: DollarSign,
      href: "/dashboard/monetization",
      color: "text-amber-500",
    },
    {
      title: "AI Generations",
      value:
        limits.aiGenerationsPerMonth === -1
          ? "Unlimited"
          : `${aiGenerations}/${limits.aiGenerationsPerMonth}`,
      icon: Sparkles,
      href: "/dashboard/settings?tab=billing",
      color: "text-primary",
    },
  ]

  const displayName =
    profile?.display_name || user.user_metadata?.display_name || "Creator"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground">
          {"Here's what's happening with your content today."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Ideas</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/content">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {ideas && ideas.length > 0 ? (
              <div className="space-y-4">
                {ideas.slice(0, 3).map((idea) => (
                  <div
                    key={idea.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{idea.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {idea.platform} - {idea.format}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {idea.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Lightbulb className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No content ideas yet
                </p>
                <Button asChild variant="link" size="sm" className="mt-2">
                  <Link href="/dashboard/content">Generate your first idea</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Content</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/planner">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {plans && plans.filter((p) => p.status === "scheduled").length > 0 ? (
              <div className="space-y-4">
                {plans
                  .filter((p) => p.status === "scheduled")
                  .slice(0, 3)
                  .map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{plan.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {plan.scheduled_date
                            ? new Date(plan.scheduled_date).toLocaleDateString()
                            : "No date set"}
                        </p>
                      </div>
                      <Badge className="shrink-0">{plan.platforms[0]}</Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No scheduled content
                </p>
                <Button asChild variant="link" size="sm" className="mt-2">
                  <Link href="/dashboard/planner">Schedule your first post</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {suggestions && suggestions.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Monetization Suggestions</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/monetization">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="rounded-lg border bg-muted/30 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    <Badge variant="outline" className="text-xs">
                      {suggestion.difficulty}
                    </Badge>
                  </div>
                  <p className="font-medium">{suggestion.title}</p>
                  {suggestion.potential_revenue && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Potential: ${(suggestion.potential_revenue / 100).toFixed(0)}/mo
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
