import { createClient } from "@/lib/supabase/server"
import { NextRequest } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: plans, error } = await supabase
      .from("content_plans")
      .select("*, content_ideas(*)")
      .eq("user_id", user.id)
      .order("scheduled_date", { ascending: true })

    if (error) {
      throw error
    }

    return Response.json({ plans })
  } catch (error) {
    console.error("Error fetching plans:", error)
    return Response.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, scheduled_date, platforms, content_idea_id } =
      body

    if (!title || !platforms || platforms.length === 0) {
      return Response.json(
        { error: "Title and at least one platform are required" },
        { status: 400 }
      )
    }

    const { data: plan, error } = await supabase
      .from("content_plans")
      .insert({
        user_id: user.id,
        title,
        description,
        scheduled_date: scheduled_date || null,
        platforms,
        status: scheduled_date ? "scheduled" : "draft",
        content_idea_id: content_idea_id || null,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Update the content idea status if linked
    if (content_idea_id) {
      await supabase
        .from("content_ideas")
        .update({ status: "planned" })
        .eq("id", content_idea_id)
        .eq("user_id", user.id)
    }

    return Response.json({ plan })
  } catch (error) {
    console.error("Error creating plan:", error)
    return Response.json({ error: "Failed to create plan" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return Response.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const { data: plan, error } = await supabase
      .from("content_plans")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return Response.json({ plan })
  } catch (error) {
    console.error("Error updating plan:", error)
    return Response.json({ error: "Failed to update plan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = request.nextUrl.searchParams.get("id")

    if (!id) {
      return Response.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("content_plans")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      throw error
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting plan:", error)
    return Response.json({ error: "Failed to delete plan" }, { status: 500 })
  }
}
