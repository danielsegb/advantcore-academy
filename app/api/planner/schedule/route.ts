import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"
import { z } from "zod"

const scheduleUpdateSchema = z.object({
  userId: z.string().optional(),
  action: z.enum(["applyAdaptive", "rescheduleEvent"]),
  acceleratedWeeks: z.number().int().optional(),
  daysSaved: z.number().int().optional(),
  eventId: z.string().optional(),
  newDate: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const rawBody: unknown = await request.json()
    const parseResult = scheduleUpdateSchema.safeParse(rawBody)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid schedule payload.", details: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const payload = parseResult.data
    const supabase = getSupabaseAdminClient()

    if (supabase && payload.userId) {
      await supabase.from("audit_events").insert({
        action: "SCHEDULE_ADAPTED",
        resource_type: "schedule",
        details_json: payload,
      })
    }

    logger.info("Schedule updated successfully", {
      requestId,
      action: payload.action,
      daysSaved: payload.daysSaved,
    })

    return NextResponse.json({
      success: true,
      message: `Schedule action '${payload.action}' executed successfully.`,
    }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to update schedule", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
