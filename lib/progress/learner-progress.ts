import { fullCurriculum } from "@/lib/learning/curriculum-data"
import { advantcoreProjectStages } from "@/lib/workplace/project-data"
import type { EvidenceItem } from "@/lib/workplace/types"
import type { View } from "@/components/shared/types"

export interface LearnerProgressSummary {
  overallScore: number
  knowledgeMastery: {
    score: number
    completedCount: number
    totalLessons: number
    detail: string
  }
  examReadiness: {
    score: number
    highestScore: number
    detail: string
  }
  workplaceEvidence: {
    score: number
    approvedCount: number
    totalDeliverables: number
    detail: string
  }
  interviewReadiness: {
    score: number
    completedScenarios: number
    totalScenarios: number
    detail: string
  }
  priorities: Array<{
    title: string
    subtitle: string
    duration: string
    view: View
  }>
}

export function getLearnerRealProgress(userId?: string | null, userEmail?: string | null): LearnerProgressSummary {
  if (typeof window === "undefined") {
    return getZeroStateProgress()
  }

  try {
    const hasAuth = Boolean((userId && userId !== "guest") || userEmail)
    const keysToCheck = hasAuth
      ? (Array.from(new Set([userId, userEmail].filter(Boolean))) as string[])
      : ["guest"]

    // 1. Knowledge Mastery from completed lessons / quizzes
    const completedSet = new Set<string>()
    for (const k of keysToCheck) {
      try {
        const stored: string[] = JSON.parse(localStorage.getItem(`advantcore_completed_lessons_${k}`) || "[]")
        for (const id of stored) completedSet.add(id)
      } catch {}
    }
    const completedLessonIds = Array.from(completedSet)
    const totalLessons = fullCurriculum.reduce((acc, m) => acc + m.lessons.length, 0) || 6
    const completedCount = completedLessonIds.length
    const knowledgeScore = Math.round((completedCount / totalLessons) * 100)

    // 2. Exam Readiness from mock exam scores
    const allMockScores: number[] = []
    for (const k of keysToCheck) {
      try {
        const stored: number[] = JSON.parse(localStorage.getItem(`advantcore_mock_scores_${k}`) || "[]")
        allMockScores.push(...stored)
      } catch {}
    }
    const highestMock = allMockScores.length > 0 ? Math.max(...allMockScores) : 0

    // 3. Workplace Evidence from stored deliverables
    const evidenceMap = new Map<string, EvidenceItem>()
    for (const k of keysToCheck) {
      try {
        const stored: EvidenceItem[] = JSON.parse(localStorage.getItem(`advantcore_evidence_${k}`) || "[]")
        for (const item of stored) {
          if (!evidenceMap.has(item.id || item.taskId)) {
            evidenceMap.set(item.id || item.taskId, item)
          }
        }
      } catch {}
    }
    const evidenceItems = Array.from(evidenceMap.values())
    const approvedCount = evidenceItems.filter(e => e.status === "approved").length
    const totalDeliverables = 10
    const evidenceScore = Math.round((approvedCount / totalDeliverables) * 100)

    // 4. Interview Readiness
    const scenarioSet = new Set<string>()
    for (const k of keysToCheck) {
      try {
        const stored: string[] = JSON.parse(localStorage.getItem(`advantcore_interview_scenarios_${k}`) || "[]")
        for (const id of stored) scenarioSet.add(id)
      } catch {}
    }
    const interviewCount = scenarioSet.size
    const interviewScore = Math.min(Math.round((interviewCount / 4) * 100), 100)

    // 5. Composite Readiness Score (35% Knowledge, 25% Exam, 25% Workplace, 15% Interview)
    const overallScore = Math.round(
      knowledgeScore * 0.35 +
      highestMock * 0.25 +
      evidenceScore * 0.25 +
      interviewScore * 0.15
    )

    // 6. Dynamic Priorities based on actual stage
    const priorities = calculateDynamicPriorities(completedLessonIds, evidenceItems)

    return {
      overallScore,
      knowledgeMastery: {
        score: knowledgeScore,
        completedCount,
        totalLessons,
        detail: completedCount > 0 ? `${completedCount} of ${totalLessons} lessons mastered` : "No lessons completed yet",
      },
      examReadiness: {
        score: highestMock,
        highestScore: highestMock,
        detail: highestMock > 0 ? `Highest score: ${highestMock}% · Target: 80%` : "No mock exams completed yet",
      },
      workplaceEvidence: {
        score: evidenceScore,
        approvedCount,
        totalDeliverables,
        detail: approvedCount > 0 ? `${approvedCount} of ${totalDeliverables} deliverables approved` : "No deliverables submitted yet",
      },
      interviewReadiness: {
        score: interviewScore,
        completedScenarios: interviewCount,
        totalScenarios: 4,
        detail: interviewCount > 0 ? `${interviewCount} of 4 scenarios practiced` : "No interview scenarios practiced yet",
      },
      priorities,
    }
  } catch {
    return getZeroStateProgress()
  }
}

function calculateDynamicPriorities(
  completedLessonIds: string[],
  evidenceItems: EvidenceItem[]
): Array<{ title: string; subtitle: string; duration: string; view: View }> {
  // Find first uncompleted lesson
  let nextLessonTitle = "Finish lesson 1.1: Role & competencies of a BA"
  let nextLessonDuration = "20 min"

  for (const mod of fullCurriculum) {
    for (const les of mod.lessons) {
      if (!completedLessonIds.includes(les.id)) {
        nextLessonTitle = `Finish lesson ${les.lessonNumber}: ${les.title}`
        nextLessonDuration = `${les.estimatedMinutes} min`
        break
      }
    }
    if (nextLessonTitle !== "Finish lesson 1.1: Role & competencies of a BA") break
  }

  // Find next pending workplace task
  const approvedTaskIds = evidenceItems.filter(e => e.status === "approved").map(e => e.taskId)
  let nextTaskTitle = "Draft Executive Problem Statement"
  let nextTaskSubtitle = "Workplace · Due today"
  let nextTaskDuration = "30 min"

  for (const stage of advantcoreProjectStages) {
    for (const task of stage.tasks) {
      if (!approvedTaskIds.includes(task.id)) {
        nextTaskTitle = `Complete: ${task.title}`
        nextTaskSubtitle = `Workplace · Stage ${stage.stageNumber}`
        nextTaskDuration = "30 min"
        break
      }
    }
    if (nextTaskTitle !== "Draft Executive Problem Statement") break
  }

  return [
    {
      title: nextLessonTitle,
      subtitle: "Learning · In progress",
      duration: nextLessonDuration,
      view: "learning",
    },
    {
      title: nextTaskTitle,
      subtitle: nextTaskSubtitle,
      duration: nextTaskDuration,
      view: "workplace",
    },
    {
      title: "Scoping & Stakeholder Briefing",
      subtitle: "Meeting prep · Advantcore Ltd",
      duration: "15 min",
      view: "meetings",
    },
  ]
}

function getZeroStateProgress(): LearnerProgressSummary {
  return {
    overallScore: 0,
    knowledgeMastery: {
      score: 0,
      completedCount: 0,
      totalLessons: 6,
      detail: "No lessons completed yet",
    },
    examReadiness: {
      score: 0,
      highestScore: 0,
      detail: "No mock exams completed yet",
    },
    workplaceEvidence: {
      score: 0,
      approvedCount: 0,
      totalDeliverables: 10,
      detail: "No deliverables submitted yet",
    },
    interviewReadiness: {
      score: 0,
      completedScenarios: 0,
      totalScenarios: 4,
      detail: "No interview scenarios practiced yet",
    },
    priorities: [
      {
        title: "Finish lesson 1.1: Role & competencies of a BA",
        subtitle: "Learning · Due today",
        duration: "20 min",
        view: "learning",
      },
      {
        title: "Draft Executive Problem Statement",
        subtitle: "Workplace · Stage 1",
        duration: "30 min",
        view: "workplace",
      },
      {
        title: "Scoping & Stakeholder Briefing",
        subtitle: "Meeting prep · Advantcore Ltd",
        duration: "15 min",
        view: "meetings",
      },
    ],
  }
}
