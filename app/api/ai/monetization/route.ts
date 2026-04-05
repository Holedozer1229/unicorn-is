import { createClient } from "@/lib/supabase/server"
import { generateText, Output } from "ai"
import { z } from "zod"
import { trackAIGeneration, getAIGenerationCount } from "@/lib/redis"
import { TIER_LIMITS } from "@/lib/types"

const suggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      type: z.string(),
      title: z.string(),
      description: z.string(),
      potentialRevenue: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
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
    
    if (tier === "free") {
      return Response.json(
        { error: "Monetization AI requires Creator or Pro plan" },
        { status: 403 }
      )
    }

    const limits = TIER_LIMITS[tier]
    const currentCount = await getAIGenerationCount(user.id)

    if (
      limits.aiGenerationsPerMonth !== -1 &&
      currentCount >= limits.aiGenerationsPerMonth
    ) {
      return Response.json(
        { error: "Monthly generation limit reached" },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { niche, platforms, audienceSize, currentRevenue } = body

    const systemPrompt = `You are a monetization strategist for digital creators and influencers.
Your role is to provide actionable, realistic monetization strategies based on the creator's situation.

Guidelines:
- Suggest strategies appropriate for the creator's audience size
- Include a mix of difficulty levels
- Provide realistic revenue estimates based on industry averages
- Focus on sustainable, long-term revenue streams
- Consider the specific platforms and niche`

    const userPrompt = `Analyze and suggest monetization strategies for a creator with:

Niche: ${niche || "General content creation"}
Platforms: ${platforms?.join(", ") || "Multiple platforms"}
Audience Size: ${audienceSize || "Growing"}
${currentRevenue ? `Current Monthly Revenue: $${currentRevenue}` : ""}

Provide 5 monetization strategies with:
1. Strategy type (e.g., "Sponsorships", "Digital Products", "Coaching")
2. Specific actionable title
3. Description of how to implement
4. Estimated monthly revenue potential in cents
5. Difficulty level (easy, medium, hard)`

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: userPrompt,
      output: Output.object({ schema: suggestionSchema }),
    })

    // Track usage
    await trackAIGeneration(user.id)

    // Save suggestions to database
    if (result.output?.suggestions) {
      const suggestionsToInsert = result.output.suggestions.map((s) => ({
        user_id: user.id,
        suggestion_type: s.type,
        title: s.title,
        description: s.description,
        potential_revenue: s.potentialRevenue,
        difficulty: s.difficulty,
        status: "new",
        ai_generated: true,
      }))

      await supabase.from("monetization_suggestions").insert(suggestionsToInsert)
    }

    // Log usage event
    await supabase.from("usage_events").insert({
      user_id: user.id,
      event_type: "ai_generation",
      metadata: {
        type: "monetization_suggestions",
        suggestions_count: result.output?.suggestions?.length || 0,
      },
    })

    return Response.json({ suggestions: result.output?.suggestions || [] })
  } catch (error) {
    console.error("Monetization AI error:", error)
    return Response.json(
      { error: "Failed to generate monetization suggestions" },
      { status: 500 }
    )
  }
}
