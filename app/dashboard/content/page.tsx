import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ContentEngineClient } from "./content-engine-client"
import { TIER_LIMITS } from "@/lib/types"
import { getAIGenerationCount } from "@/lib/redis"

export default async function ContentEnginePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const [{ data: profile }, { data: subscription }, { data: ideas }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
      supabase
        .from("content_ideas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ])

  const tier = subscription?.tier || "free"
  const limits = TIER_LIMITS[tier]
  const aiGenerations = await getAIGenerationCount(user.id)
  const remainingGenerations =
    limits.aiGenerationsPerMonth === -1
      ? -1
      : limits.aiGenerationsPerMonth - aiGenerations

  return (
    <ContentEngineClient
      userId={user.id}
      profile={profile}
      ideas={ideas || []}
      tier={tier}
      remainingGenerations={remainingGenerations}
    />
  )
}
