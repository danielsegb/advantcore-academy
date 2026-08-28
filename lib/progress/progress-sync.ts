"use client"

import type { EvidenceItem } from "@/lib/workplace/types"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/academy"

/**
 * Synchronizes learner progress (completed lessons, mock scores, evidence deliverables)
 * between the server database and local device storage.
 */
export async function syncLearnerProgressFromServer(userId?: string | null): Promise<void> {
  if (!userId || typeof window === "undefined") return

  try {
    // 1. Fetch Learning & Exam Progress
    const progressRes = await fetch(`${basePath}/api/learning/progress?userId=${encodeURIComponent(userId)}`)
    if (progressRes.ok) {
      const progressData = await progressRes.json()
      if (progressData.success) {
        // Merge completed lessons
        if (Array.isArray(progressData.completedLessonIds) && progressData.completedLessonIds.length > 0) {
          const localCompleted: string[] = JSON.parse(
            localStorage.getItem(`advantcore_completed_lessons_${userId}`) || "[]"
          )
          const merged = Array.from(new Set([...localCompleted, ...progressData.completedLessonIds]))
          localStorage.setItem(`advantcore_completed_lessons_${userId}`, JSON.stringify(merged))
        }

        // Merge mock scores
        if (Array.isArray(progressData.mockScores) && progressData.mockScores.length > 0) {
          const localScores: number[] = JSON.parse(
            localStorage.getItem(`advantcore_mock_scores_${userId}`) || "[]"
          )
          const mergedScores = Array.from(new Set([...localScores, ...progressData.mockScores]))
          localStorage.setItem(`advantcore_mock_scores_${userId}`, JSON.stringify(mergedScores))
        }
      }
    }

    // 2. Fetch Workplace Evidence Items
    const evidenceRes = await fetch(`${basePath}/api/workplace/evidence?userId=${encodeURIComponent(userId)}`)
    if (evidenceRes.ok) {
      const evidenceData = await evidenceRes.json()
      if (evidenceData.success && Array.isArray(evidenceData.evidenceItems) && evidenceData.evidenceItems.length > 0) {
        const localEvidence: EvidenceItem[] = JSON.parse(
          localStorage.getItem(`advantcore_evidence_${userId}`) || "[]"
        )
        // Combine or prefer server items
        const evidenceMap = new Map<string, EvidenceItem>()
        for (const item of localEvidence) {
          evidenceMap.set(item.id || item.taskId, item)
        }
        for (const item of evidenceData.evidenceItems) {
          evidenceMap.set(item.id || item.taskId, item)
        }
        const mergedEvidence = Array.from(evidenceMap.values())
        localStorage.setItem(`advantcore_evidence_${userId}`, JSON.stringify(mergedEvidence))
      }
    }

    // Notify all active views of the progress update
    window.dispatchEvent(new CustomEvent("advantcore_progress_updated", { detail: { userId } }))
  } catch {
    // Offline or network fallback
  }
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
