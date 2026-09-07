"use client"

import type { EvidenceItem } from "@/lib/workplace/types"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/academy"

/**
 * Synchronizes learner progress (completed lessons, mock scores, evidence deliverables)
 * between the server database and local device storage.
 */
export async function syncLearnerProgressFromServer(userId?: string | null, email?: string | null): Promise<void> {
  if ((!userId && !email) || typeof window === "undefined") return

  try {
    const params = new URLSearchParams()
    if (userId) params.set("userId", userId)
    if (email) params.set("email", email)

    const targetKey = userId || email
    if (!targetKey) return
    const keysToSync = Array.from(new Set([userId, email].filter(Boolean))) as string[]

    // Collect local completed lessons ONLY for this authenticated user
    const localCompletedSet = new Set<string>()
    for (const k of keysToSync) {
      try {
        const arr: string[] = JSON.parse(localStorage.getItem(`advantcore_completed_lessons_${k}`) || "[]")
        for (const id of arr) localCompletedSet.add(id)
      } catch {}
    }

    // Direct Supabase Client Query
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      try {
        const idList = Array.from(new Set([userId, email, email?.toLowerCase()].filter(Boolean))) as string[]
        const { data: directAttempts } = await supabase
          .from("quiz_attempts")
          .select("lesson_id")
          .in("user_id", idList)
        if (directAttempts) {
          for (const row of directAttempts) {
            if (row.lesson_id) localCompletedSet.add(row.lesson_id)
          }
        }
      } catch {}
    }

    // 1. Fetch Learning & Exam Progress from Server Route
    const progressRes = await fetch(`${basePath}/api/learning/progress?${params.toString()}`)
    if (progressRes.ok) {
      const progressData = await progressRes.json()
      if (progressData.success) {
        const serverLessons: string[] = Array.isArray(progressData.completedLessonIds) ? progressData.completedLessonIds : []
        const mergedCompleted = Array.from(new Set([...Array.from(localCompletedSet), ...serverLessons]))

        for (const k of keysToSync) {
          localStorage.setItem(`advantcore_completed_lessons_${k}`, JSON.stringify(mergedCompleted))
        }

        // Upload any lessons that were completed by this user on this browser to the server
        const missingOnServer = Array.from(localCompletedSet).filter(id => !serverLessons.includes(id))
        for (const id of missingOnServer) {
          await fetch(`${basePath}/api/learning/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "complete", lessonId: id, userId: targetKey, score: 100 }),
          }).catch(() => {})
        }

        // Merge mock scores strictly for this user
        const localMockSet = new Set<number>()
        for (const k of keysToSync) {
          try {
            const arr: number[] = JSON.parse(localStorage.getItem(`advantcore_mock_scores_${k}`) || "[]")
            for (const s of arr) localMockSet.add(s)
          } catch {}
        }
        const serverScores: number[] = Array.isArray(progressData.mockScores) ? progressData.mockScores : []
        const mergedScores = Array.from(new Set([...Array.from(localMockSet), ...serverScores]))
        for (const k of keysToSync) {
          localStorage.setItem(`advantcore_mock_scores_${k}`, JSON.stringify(mergedScores))
        }
      }
    }

    // 2. Fetch Workplace Evidence Items
    const evidenceRes = await fetch(`${basePath}/api/workplace/evidence?${params.toString()}`)
    if (evidenceRes.ok) {
      const evidenceData = await evidenceRes.json()
      if (evidenceData.success && Array.isArray(evidenceData.evidenceItems)) {
        const evidenceMap = new Map<string, EvidenceItem>()
        for (const k of keysToSync) {
          try {
            const localEvidence: EvidenceItem[] = JSON.parse(localStorage.getItem(`advantcore_evidence_${k}`) || "[]")
            for (const item of localEvidence) {
              evidenceMap.set(item.id || item.taskId, item)
            }
          } catch {}
        }
        for (const item of evidenceData.evidenceItems) {
          evidenceMap.set(item.id || item.taskId, item)
        }
        const mergedEvidence = Array.from(evidenceMap.values())
        for (const k of keysToSync) {
          localStorage.setItem(`advantcore_evidence_${k}`, JSON.stringify(mergedEvidence))
        }

        // Upload any local evidence items missing on the server
        for (const item of mergedEvidence) {
          if (!evidenceData.evidenceItems.some((e: EvidenceItem) => (e.id || e.taskId) === (item.id || item.taskId))) {
            fetch(`${basePath}/api/workplace/evidence`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "saveDraft",
                taskId: item.taskId,
                evidenceId: item.id,
                userId: targetKey,
                title: item.title || item.taskTitle,
                content: item.content || "",
                version: item.version || 1,
              }),
            }).catch(() => {})
          }
        }
      }
    }

    // Notify all active views of the progress update
    window.dispatchEvent(new CustomEvent("advantcore_progress_updated", { detail: { userId: targetKey } }))
  } catch {
    // Offline or network fallback
  }
}

/**
 * Cleanly removes all local progress, exam scores, and workplace evidence for a specific user.
 */
export function resetLearnerStorage(userId: string, email?: string | null): void {
  if (typeof window === "undefined") return
  const keysToClean = Array.from(new Set([userId, email].filter(Boolean))) as string[]
  for (const k of keysToClean) {
    localStorage.removeItem(`advantcore_completed_lessons_${k}`)
    localStorage.removeItem(`advantcore_mock_scores_${k}`)
    localStorage.removeItem(`advantcore_evidence_${k}`)
    localStorage.removeItem(`advantcore_interview_scenarios_${k}`)
    localStorage.removeItem(`advantcore_flashcards_mastered_${k}`)
  }
  window.dispatchEvent(new CustomEvent("advantcore_progress_updated", { detail: { userId } }))
}

/**
 * Persists a lesson completion to both the server and local storage.
 */
export async function recordLessonCompletionCrossDevice(
  userId: string | undefined,
  lessonId: string,
  score = 100
): Promise<void> {
  const uId = userId || "guest"

  if (typeof window !== "undefined") {
    try {
      const currentCompleted: string[] = JSON.parse(
        localStorage.getItem(`advantcore_completed_lessons_${uId}`) || "[]"
      )
      if (!currentCompleted.includes(lessonId)) {
        currentCompleted.push(lessonId)
        localStorage.setItem(`advantcore_completed_lessons_${uId}`, JSON.stringify(currentCompleted))
      }
      window.dispatchEvent(new CustomEvent("advantcore_progress_updated", { detail: { lessonId, userId: uId } }))
    } catch {
      // Storage fallback
    }
  }

  if (userId) {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      void supabase.from("quiz_attempts").insert({
        user_id: userId,
        lesson_id: lessonId,
        score,
        mastery_achieved: score >= 80,
        answers_json: {},
      })
    }

    try {
      await fetch(`${basePath}/api/learning/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          lessonId,
          userId,
          score,
        }),
      })
    } catch {
      // Network fallback
    }
  }
}
