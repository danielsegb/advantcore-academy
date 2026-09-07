import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { fullCurriculum } from "@/lib/learning/curriculum-data"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"
import { z } from "zod"

const progressActionSchema = z.object({
  action: z.enum(["quiz", "complete"]).optional().default("quiz"),
  lessonId: z.string(),
  userId: z.string().optional(),
  answers: z.record(z.string(), z.string()).optional(),
  score: z.number().optional(),
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
      return NextResponse.json({
        success: true,
        completedLessonIds: [],
        mockScores: [],
        snapshots: [],
      })
    }

    // Resolve user IDs to match
    const targetUserIds = new Set<string>()
    if (userId) targetUserIds.add(userId)
    if (email) {
      targetUserIds.add(email)
      targetUserIds.add(email.toLowerCase())
    }

    if (email) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.toLowerCase())
        .maybeSingle()
      if (profile?.id) {
        targetUserIds.add(profile.id)
      }
    }

    const idList = Array.from(targetUserIds)

    // 1. Fetch completed lessons from quiz_attempts
    const { data: quizAttempts, error: quizError } = await supabase
      .from("quiz_attempts")
      .select("lesson_id, score, mastery_achieved")
      .in("user_id", idList)

    if (quizError) {
      logger.error("Failed to query quiz attempts", { requestId, error: quizError.message })
    }

    const completedLessonIds = Array.from(
      new Set(
        (quizAttempts || [])
          .filter(a => a.mastery_achieved || a.score >= 80)
          .map(a => a.lesson_id)
      )
    )

    // 2. Fetch mock exam snapshots
    const { data: snapshots, error: snapError } = await supabase
      .from("readiness_snapshots")
      .select("overall_score, course_progress, work_experience, exam_readiness, evidence_count, consistency_score, snapshot_date")
      .in("user_id", idList)
      .order("created_at", { ascending: false })

    if (snapError) {
      logger.error("Failed to query readiness snapshots", { requestId, error: snapError.message })
    }

    const mockScores = (snapshots || []).map(s => s.exam_readiness).filter(Boolean)

    return NextResponse.json({
      success: true,
      completedLessonIds,
      mockScores,
      snapshots: snapshots || [],
    }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to fetch learner progress", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Failed to retrieve learner progress." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const rawBody: unknown = await request.json()
    const parseResult = progressActionSchema.safeParse(rawBody)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid progress payload.", details: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const { action, lessonId, userId, answers, score: customScore } = parseResult.data

    // Find lesson in curriculum
    let targetLesson = null
    for (const mod of fullCurriculum) {
      for (const les of mod.lessons) {
        if (les.id === lessonId) {
          targetLesson = les
          break
        }
      }
    }

    if (!targetLesson) {
      return NextResponse.json({ error: "Lesson not found in curriculum." }, { status: 404 })
    }

    let finalScore = customScore ?? 100
    let masteryAchieved = true
    let explanations: Array<{ questionId: string; prompt: string; selectedKey: string; isCorrect: boolean; explanation: string }> = []
    let correctCount = targetLesson.questions.length
    const totalQuestions = targetLesson.questions.length

    if (action === "quiz" && answers) {
      correctCount = 0
      explanations = targetLesson.questions.map(q => {
        const selectedKey = answers[q.id]
        const correctOption = q.options.find(o => o.isCorrect)
        const isCorrect = selectedKey === correctOption?.key

        if (isCorrect) {
          correctCount++
        }

        return {
          questionId: q.id,
          prompt: q.prompt,
          selectedKey: selectedKey || "",
          isCorrect,
          explanation: q.explanation,
        }
      })

      finalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100
      masteryAchieved = finalScore >= 80
    }

    const supabase = getSupabaseAdminClient()
    if (supabase && userId) {
      const { error: insertError } = await supabase.from("quiz_attempts").insert({
        user_id: userId,
        lesson_id: lessonId,
        score: finalScore,
        mastery_achieved: masteryAchieved,
        answers_json: answers || {},
      })

      if (insertError) {
        logger.error("Failed to insert quiz attempt", { requestId, error: insertError.message, userId, lessonId })
      }
    }

    logger.info("Lesson progress updated", {
      requestId,
      lessonId,
      score: finalScore,
      masteryAchieved,
      correctCount,
      totalQuestions,
    })

    return NextResponse.json({
      success: true,
      score: finalScore,
      totalQuestions,
      correctCount,
      masteryAchieved,
      explanations,
    }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to update progress", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error updating progress." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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
      return NextResponse.json({ success: true, message: "Progress reset (local mode)." })
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

    const { error: quizError } = await supabase.from("quiz_attempts").delete().in("user_id", idList)
    if (quizError) {
      logger.error("Failed to delete quiz attempts", { requestId, error: quizError.message })
    }

    const { error: snapError } = await supabase.from("readiness_snapshots").delete().in("user_id", idList)
    if (snapError) {
      logger.error("Failed to delete readiness snapshots", { requestId, error: snapError.message })
    }

    logger.info("User progress reset successfully", { requestId, idList })
    return NextResponse.json({ success: true, resetUserIds: idList }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to reset progress", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Failed to reset progress." }, { status: 500 })
  }
}
