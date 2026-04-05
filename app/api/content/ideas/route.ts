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

    const { data: ideas, error } = await supabase
      .from("content_ideas")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return Response.json({ ideas })
  } catch (error) {
    console.error("Error fetching ideas:", error)
    return Response.json({ error: "Failed to fetch ideas" }, { status: 500 })
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
    const { title, description, format, platform, ai_generated } = body

    if (!title || !format || !platform) {
      return Response.json(
        { error: "Title, format, and platform are required" },
        { status: 400 }
      )
    }

    const { data: idea, error } = await supabase
      .from("content_ideas")
      .insert({
        user_id: user.id,
        title,
        description,
        format,
        platform,
        status: "idea",
        ai_generated: ai_generated || false,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return Response.json({ idea })
  } catch (error) {
    console.error("Error creating idea:", error)
    return Response.json({ error: "Failed to create idea" }, { status: 500 })
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
      return Response.json({ error: "Idea ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("content_ideas")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      throw error
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting idea:", error)
    return Response.json({ error: "Failed to delete idea" }, { status: 500 })
  }
}
