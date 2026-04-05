import { createClient } from "@/lib/supabase/server"

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
    const { id, status } = body

    if (!id || !status) {
      return Response.json(
        { error: "ID and status are required" },
        { status: 400 }
      )
    }

    const validStatuses = ["new", "considering", "implemented", "dismissed"]
    if (!validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 })
    }

    const { data: suggestion, error } = await supabase
      .from("monetization_suggestions")
      .update({ status })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return Response.json({ suggestion })
  } catch (error) {
    console.error("Error updating suggestion:", error)
    return Response.json(
      { error: "Failed to update suggestion" },
      { status: 500 }
    )
  }
}
