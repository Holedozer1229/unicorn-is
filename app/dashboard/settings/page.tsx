import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsClient } from "./settings-client"
import { TIER_LIMITS } from "@/lib/types"
import { getAIGenerationCount } from "@/lib/redis"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
  ])

  const tier = subscription?.tier || "free"
  const limits = TIER_LIMITS[tier]
  const aiGenerations = await getAIGenerationCount(user.id)

  return (
    <SettingsClient
      user={user}
      profile={profile}
      subscription={subscription}
      tier={tier}
      limits={limits}
      aiGenerations={aiGenerations}
    />
  )
}
