import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (error) {
      throw error
    }

    return Response.json({ profile })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 })
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
    const { display_name, niche, platforms, audience_size } = body

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({
        display_name,
        niche,
        platforms,
        audience_size,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return Response.json({ profile })
  } catch (error) {
    console.error("Error updating profile:", error)
    return Response.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
