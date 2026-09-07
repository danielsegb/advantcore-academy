import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { sendLearnerWelcomeEmail } from "@/lib/email/send-welcome-email"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"
import { z } from "zod"

const adminUserActionSchema = z.object({
  action: z.enum(["invite", "updateStatus", "assignPathway"]),
  userId: z.string().optional(),
  email: z.string().email().optional(),
  fullName: z.string().min(2).max(100).optional(),
  pathwayId: z.string().optional(),
  status: z.enum(["pending", "active", "suspended", "archived"]).optional(),
  temporaryPassword: z.string().min(8).optional(),
})

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const rawBody: unknown = await request.json()
    const parseResult = adminUserActionSchema.safeParse(rawBody)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid admin request payload.", details: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const { action, userId, email, fullName, status, temporaryPassword } = parseResult.data
    const supabase = getSupabaseAdminClient()

    if (!supabase) {
      // In local mode without remote Supabase connected, return successful mock acknowledgment
      logger.info("Admin user action processed (local mode)", { requestId, action, email, status })
      return NextResponse.json(
        { success: true, message: `Action '${action}' executed successfully (local simulation).` },
        { headers: { "X-Request-ID": requestId } }
      )
    }

    if (action === "invite") {
      if (!email || !fullName) {
        return NextResponse.json({ error: "Email and Full Name are required." }, { status: 400 })
      }

      const tempPass = temporaryPassword || "Advantcore2026!"

      // Create Supabase Auth user with confirmed email and assigned password
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: tempPass,
        email_confirm: true,
        user_metadata: { full_name: fullName, role: "learner" },
      })

      if (authError || !authData.user) {
        logger.error("Failed to create auth user", { requestId, error: authError?.message })
        return NextResponse.json({ error: authError?.message || "Failed to create user." }, { status: 500 })
      }

      // Create Profile record
      const initials = fullName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
      await supabase.from("profiles").upsert({
        id: authData.user.id,
        email,
        full_name: fullName,
        avatar_initials: initials || "LN",
        role: "learner",
        status: "active",
        must_change_password: true,
      })

      // Send branded welcome email with credentials directly to the learner
      await sendLearnerWelcomeEmail({
        toEmail: email,
        fullName,
        temporaryPassword: tempPass,
      })

      // Log audit event
      await supabase.from("audit_events").insert({
        action: "USER_INVITED",
        resource_type: "profile",
        resource_id: authData.user.id,
        details_json: { email, fullName, method: "credentials_email" },
      })

      logger.info("Learner created and welcome email dispatched", { requestId, userId: authData.user.id, email })

      return NextResponse.json({
        success: true,
        userId: authData.user.id,
        email,
        temporaryPassword: tempPass,
      })
    }

    if (action === "updateStatus" && (userId || email) && status) {
      if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        await supabase.from("profiles").update({ status }).eq("id", userId)
        if (status === "suspended") {
          await supabase.auth.admin.updateUserById(userId, { ban_duration: "876000h" })
        } else if (status === "active") {
          await supabase.auth.admin.updateUserById(userId, { ban_duration: "none" })
        }
      } else if (email) {
        const { data: profile } = await supabase.from("profiles").select("id").eq("email", email.toLowerCase()).maybeSingle()
        await supabase.from("profiles").update({ status }).eq("email", email.toLowerCase())
        if (profile?.id) {
          if (status === "suspended") {
            await supabase.auth.admin.updateUserById(profile.id, { ban_duration: "876000h" })
          } else if (status === "active") {
            await supabase.auth.admin.updateUserById(profile.id, { ban_duration: "none" })
          }
        }
      } else if (userId) {
        await supabase.from("profiles").update({ status }).eq("id", userId)
      }

      await supabase.from("audit_events").insert({
        action: `USER_STATUS_${status.toUpperCase()}`,
        resource_type: "profile",
        resource_id: userId || email || "unknown",
        details_json: { newStatus: status },
      })

      return NextResponse.json({ success: true, status })
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 })
  } catch (error) {
    logger.error("Admin user action failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error processing admin action." }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID()
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ success: true, users: [] }, { headers: { "X-Request-ID": requestId } })
    }

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_initials, avatar_colour, role, status, must_change_password, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      logger.error("Failed to query profiles", { requestId, error: error.message })
      return NextResponse.json({ success: true, users: [] }, { headers: { "X-Request-ID": requestId } })
    }

    const users = (profiles || [])
      .filter(p => p.role !== "admin" && p.email !== "admin@advantcore.co")
      .map(p => ({
        id: p.id,
        fullName: p.full_name || p.email,
        email: p.email,
        pathway: "Business Analysis",
        status: p.status || "active",
        role: p.role,
        mustChangePassword: Boolean(p.must_change_password),
      }))

    return NextResponse.json({ success: true, users }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to fetch admin users", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ success: true, users: [] }, { headers: { "X-Request-ID": requestId } })
  }
}

export async function DELETE(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const email = searchParams.get("email")

  if (!userId && !email) {
    return NextResponse.json({ error: "userId or email is required." }, { status: 400 })
  }

  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ success: true, message: "User deleted (local mode)." })
    }

    const targetUserIds = new Set<string>()
    if (userId) targetUserIds.add(userId)
    if (email) {
      targetUserIds.add(email)
      targetUserIds.add(email.toLowerCase())
      const { data: profile } = await supabase.from("profiles").select("id").eq("email", email.toLowerCase()).maybeSingle()
      if (profile?.id) targetUserIds.add(profile.id)
    }

    const idList = Array.from(targetUserIds)

    // Clean up dependent tables
    await supabase.from("quiz_attempts").delete().in("user_id", idList)
    await supabase.from("readiness_snapshots").delete().in("user_id", idList)
    await supabase.from("evidence_items").delete().in("learner_id", idList)

    // Delete profile
    if (userId) {
      await supabase.from("profiles").delete().eq("id", userId)
    }
    if (email) {
      await supabase.from("profiles").delete().eq("email", email.toLowerCase())
    }

    // Delete auth user if valid UUID
    const authId = idList.find(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
    if (authId) {
      await supabase.auth.admin.deleteUser(authId)
    }

    return NextResponse.json({ success: true, deletedIds: idList }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to delete user", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 })
  }
}
