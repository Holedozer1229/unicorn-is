import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PlannerClient } from "./planner-client"
import { TIER_LIMITS } from "@/lib/types"

export default async function PlannerPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const [{ data: subscription }, { data: plans }, { data: ideas }] =
    await Promise.all([
      supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
      supabase
        .from("content_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: true }),
      supabase
        .from("content_ideas")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["idea", "planned"]),
    ])

  const tier = subscription?.tier || "free"
  const limits = TIER_LIMITS[tier]

  return (
    <PlannerClient
      plans={plans || []}
      ideas={ideas || []}
      tier={tier}
      scheduledLimit={limits.scheduledPosts}
    />
  )
}
