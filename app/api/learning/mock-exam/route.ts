import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { fullMockQuestionBank } from "@/lib/mock-exam/question-bank"
import { evaluateMockExam } from "@/lib/mock-exam/engine"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"
import { z } from "zod"

const mockSubmissionSchema = z.object({
  userId: z.string().optional(),
  mode: z.enum(["full_mock", "topic_practice", "diagnostic"]).default("full_mock"),
  answers: z.record(z.string(), z.string()),
  timeSpentSeconds: z.number().int().min(0).default(0),
})

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const rawBody: unknown = await request.json()
    const parseResult = mockSubmissionSchema.safeParse(rawBody)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid mock exam payload.", details: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const { userId, answers, timeSpentSeconds } = parseResult.data

    // Evaluate answers against question bank
    const result = evaluateMockExam(fullMockQuestionBank, answers, timeSpentSeconds)

    const supabase = getSupabaseAdminClient()
    if (supabase && userId) {
      const { error: snapError } = await supabase.from("readiness_snapshots").insert({
        user_id: userId,
        exam_readiness: result.score,
        overall_score: Math.round((result.score + 67 + 58) / 3),
        course_progress: 67,
        work_experience: 58,
        evidence_count: 8,
        consistency_score: 82,
      })

      if (snapError) {
        logger.error("Failed to insert readiness snapshot", { requestId, error: snapError.message, userId })
      }
    }

    logger.info("Mock exam evaluated", {
      requestId,
      score: result.score,
      passedOfficial: result.passedOfficial,
      passedAcademy: result.passedAcademy,
      timeSpentSeconds,
    })

    return NextResponse.json(result, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to evaluate mock exam", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error evaluating mock exam." }, { status: 500 })
  }
}
