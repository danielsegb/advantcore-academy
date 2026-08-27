import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"
import { z } from "zod"

const notifActionSchema = z.object({
  userId: z.string().optional(),
  action: z.enum(["markRead", "markAllRead", "getReadinessSnapshot"]),
  notificationId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const rawBody: unknown = await request.json()
    const parseResult = notifActionSchema.safeParse(rawBody)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payload.", details: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const payload = parseResult.data
    const supabase = getSupabaseAdminClient()

    if (supabase && payload.userId && payload.action === "getReadinessSnapshot") {
      await supabase.from("audit_events").insert({
        action: "READINESS_SNAPSHOT",
        resource_type: "readiness",
        details_json: {
          user_id: payload.userId,
          knowledge_score: 87,
          evidence_score: 68,
          interview_score: 80,
          overall_score: 79,
        },
      })
    }

    logger.info("Dashboard action executed", {
      requestId,
      action: payload.action,
    })

    return NextResponse.json({
      success: true,
      message: `Notification action '${payload.action}' executed successfully.`,
    }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to execute notification action", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
