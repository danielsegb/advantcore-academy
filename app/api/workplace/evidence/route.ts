import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"
import { z } from "zod"

const evidenceActionSchema = z.object({
  action: z.enum(["submit", "review", "saveDraft"]),
  evidenceId: z.string().optional(),
  taskId: z.string(),
  userId: z.string().optional(),
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  version: z.number().int().min(1).default(1),
  reviewerDecision: z.object({
    reviewerName: z.string(),
    decision: z.enum(["approved", "changes_requested", "rejected"]),
    comment: z.string().max(1000),
  }).optional(),
})

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const email = searchParams.get("email")

  if (!userId && !email) {
    return NextResponse.json({ error: "userId or email parameter is required." }, { status: 400 })
  }

  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ success: true, evidenceItems: [] })
    }

    // Resolve user IDs to match
    const targetUserIds: string[] = []
    if (userId) targetUserIds.push(userId)

    if (email) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.toLowerCase())
        .maybeSingle()
      if (profile?.id && !targetUserIds.includes(profile.id)) {
        targetUserIds.push(profile.id)
      }
    }

    const query = supabase
      .from("evidence_items")
      .select("*")
      .order("updated_at", { ascending: false })

    const { data: evidenceRows, error } = targetUserIds.length === 1
      ? await query.eq("user_id", targetUserIds[0])
      : await query.in("user_id", targetUserIds)

    if (error) {
      logger.error("Failed to query evidence items", { requestId, error: error.message })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const evidenceItems = (evidenceRows || []).map(row => ({
      id: row.id,
      taskId: row.task_id || "tsk-01",
      taskTitle: row.title,
      stageNumber: 1,
      title: row.title,
      content: row.content || "",
      version: row.version,
      status: row.status,
      reviewerDecision: row.reviewer_decision_json,
      updatedAt: row.updated_at,
    }))

    return NextResponse.json({
      success: true,
      evidenceItems,
    }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to fetch evidence items", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error fetching evidence." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const rawBody: unknown = await request.json()
    const parseResult = evidenceActionSchema.safeParse(rawBody)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid evidence payload.", details: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const payload = parseResult.data
    const supabase = getSupabaseAdminClient()

    let newStatus: string = "draft"
    if (payload.action === "submit") {
      newStatus = "in_review"
    } else if (payload.action === "review" && payload.reviewerDecision) {
      newStatus = payload.reviewerDecision.decision
    }

    const evidenceId = payload.evidenceId || `ev-${Date.now()}`
    const targetUserId = payload.userId

    if (supabase && targetUserId) {
      // 1. Upsert evidence item
      const { error: evidenceError } = await supabase.from("evidence_items").upsert({
        id: evidenceId,
        user_id: targetUserId,
        task_id: payload.taskId,
        title: payload.title,
        content: payload.content,
        version: payload.version,
        status: newStatus as "draft" | "submitted" | "in_review" | "changes_requested" | "approved" | "rejected",
        reviewer_decision_json: payload.reviewerDecision || null,
        updated_at: new Date().toISOString(),
      })

      if (evidenceError) {
        logger.error("Failed to upsert evidence item", { requestId, error: evidenceError.message, userId: targetUserId })
      }

      // 2. Log audit event
      await supabase.from("audit_events").insert({
        action: payload.action === "review" ? "EVIDENCE_REVIEWED" : "EVIDENCE_SUBMITTED",
        resource_type: "evidence_items",
        resource_id: evidenceId,
        details_json: { title: payload.title, status: newStatus, decision: payload.reviewerDecision },
      })
    }

    logger.info("Evidence action processed", {
      requestId,
      action: payload.action,
      evidenceId,
      status: newStatus,
    })

    return NextResponse.json({
      success: true,
      evidenceId,
      status: newStatus,
      version: payload.version,
      updatedAt: new Date().toISOString(),
    }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to process evidence action", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
