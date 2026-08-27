import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"
import { z } from "zod"

const meetingLogSchema = z.object({
  userId: z.string().optional(),
  projectCode: z.string().default("ADV-BA-001"),
  title: z.string().min(3).max(200),
  brief: z.string().max(1000).optional(),
  durationMinutes: z.number().int().min(1).default(30),
  preparationScore: z.number().int().min(0).max(100).default(82),
  transcript: z.array(z.object({
    speaker: z.string(),
    role: z.string(),
    time: z.string(),
    text: z.string(),
  })).optional(),
  minutesMarkdown: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const rawBody: unknown = await request.json()
    const parseResult = meetingLogSchema.safeParse(rawBody)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid meeting payload.", details: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const payload = parseResult.data
    const supabase = getSupabaseAdminClient()
    const meetingId = `meet-${Date.now()}`

    if (supabase && payload.userId) {
      await supabase.from("meetings").insert({
        id: meetingId,
        project_id: payload.projectCode,
        user_id: payload.userId,
        title: payload.title,
        brief: payload.brief || "Project scoping and discovery meeting",
        scheduled_at: new Date().toISOString(),
        duration_minutes: payload.durationMinutes,
        status: "completed",
        preparation_score: payload.preparationScore,
      })
    }

    logger.info("Meeting logged successfully", {
      requestId,
      meetingId,
      title: payload.title,
      duration: payload.durationMinutes,
    })

    return NextResponse.json({
      success: true,
      meetingId,
      message: "Meeting logged successfully.",
    }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to log meeting", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
