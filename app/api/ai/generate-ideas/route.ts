import { createClient } from "@/lib/supabase/server"
import { generateText, Output } from "ai"
import { z } from "zod"
import { trackAIGeneration, getAIGenerationCount } from "@/lib/redis"
import { TIER_LIMITS } from "@/lib/types"

const ideaSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      format: z.string(),
    })
  ),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check subscription limits
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("tier")
      .eq("user_id", user.id)
      .single()

    const tier = subscription?.tier || "free"
    const limits = TIER_LIMITS[tier]
    const currentCount = await getAIGenerationCount(user.id)

    if (
      limits.aiGenerationsPerMonth !== -1 &&
      currentCount >= limits.aiGenerationsPerMonth
    ) {
      return Response.json(
        { error: "Monthly generation limit reached. Upgrade for more." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { topic, platform, format, niche, audienceSize } = body

    if (!topic || !platform) {
      return Response.json(
        { error: "Topic and platform are required" },
        { status: 400 }
      )
    }

    const systemPrompt = `You are a creative content strategist specializing in social media and digital content creation. 
Your role is to generate engaging, actionable content ideas that will resonate with audiences.

Guidelines:
- Create unique, specific ideas (not generic suggestions)
- Consider the platform's best practices and content formats
- Make titles catchy and scroll-stopping
- Include actionable descriptions that explain the content angle
- Consider trends and timely topics when relevant`

    const userPrompt = `Generate 5 content ideas for the following:

Topic/Theme: ${topic}
Platform: ${platform}
${format ? `Preferred Format: ${format}` : ""}
${niche ? `Creator Niche: ${niche}` : ""}
${audienceSize ? `Audience Size: ${audienceSize}` : ""}

For each idea, provide:
1. A compelling title
2. A brief description of the content angle and key points
3. The recommended content format for that idea`

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: userPrompt,
      output: Output.object({ schema: ideaSchema }),
    })

    // Track usage
    await trackAIGeneration(user.id)

    // Log usage event
    await supabase.from("usage_events").insert({
      user_id: user.id,
      event_type: "ai_generation",
      metadata: {
        type: "content_ideas",
        topic,
        platform,
        ideas_count: result.output?.ideas?.length || 0,
      },
    })

    return Response.json({ ideas: result.output?.ideas || [] })
  } catch (error) {
    console.error("AI generation error:", error)
    return Response.json(
      { error: "Failed to generate ideas" },
      { status: 500 }
    )
  }
}
