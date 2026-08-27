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

    if (supabase) {
      // 1. Upsert evidence item
      await supabase.from("evidence_items").upsert({
        id: evidenceId,
        user_id: payload.userId || crypto.randomUUID(),
        task_id: payload.taskId,
        title: payload.title,
        content: payload.content,
        version: payload.version,
        status: newStatus as "draft" | "submitted" | "in_review" | "changes_requested" | "approved" | "rejected",
        reviewer_decision_json: payload.reviewerDecision || null,
        updated_at: new Date().toISOString(),
      })

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
