import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { fullCurriculum } from "@/lib/learning/curriculum-data"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"
import { z } from "zod"

const quizSubmissionSchema = z.object({
  lessonId: z.string(),
  userId: z.string().optional(),
  answers: z.record(z.string(), z.string()),
})

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const rawBody: unknown = await request.json()
    const parseResult = quizSubmissionSchema.safeParse(rawBody)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid quiz submission payload.", details: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const { lessonId, userId, answers } = parseResult.data

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

    let correctCount = 0
    const totalQuestions = targetLesson.questions.length

    const explanations = targetLesson.questions.map(q => {
      const selectedKey = answers[q.id]
      const correctOption = q.options.find(o => o.isCorrect)
      const isCorrect = selectedKey === correctOption?.key

      if (isCorrect) {
        correctCount++
      }

      return {
        questionId: q.id,
        prompt: q.prompt,
        selectedKey,
        isCorrect,
        explanation: q.explanation,
      }
    })

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
    const masteryAchieved = score >= 90

    const supabase = getSupabaseAdminClient()
    if (supabase && userId) {
      await supabase.from("quiz_attempts").insert({
        user_id: userId,
        lesson_id: lessonId,
        score,
        mastery_achieved: masteryAchieved,
        answers_json: answers,
      })
    }

    logger.info("Quiz attempt evaluated", {
      requestId,
      lessonId,
      score,
      masteryAchieved,
      correctCount,
      totalQuestions,
    })

    return NextResponse.json({
      score,
      totalQuestions,
      correctCount,
      masteryAchieved,
      explanations,
    }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to evaluate quiz", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error evaluating quiz." }, { status: 500 })
  }
}
