import { fullMockQuestionBank } from "./question-bank"
import type {
  ExamMode,
  MockExamQuestion,
  MockExamResult,
  QuestionDomain,
  DomainBreakdown,
} from "./types"

export function generateExamQuestions(
  mode: ExamMode = "full_mock",
  targetDomain?: QuestionDomain
): MockExamQuestion[] {
  if (mode === "topic_practice" && targetDomain) {
    return fullMockQuestionBank.filter(q => q.domain === targetDomain)
  }

  if (mode === "diagnostic") {
    // Return 10 balanced questions across domains
    const shuffled = [...fullMockQuestionBank].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 10)
  }

  // Full mock returns all 40 questions in syllabus order
  return [...fullMockQuestionBank]
}

export function evaluateMockExam(
  questions: MockExamQuestion[],
  answers: Record<string, string>,
  timeSpentSeconds = 0
): MockExamResult {
  let correctCount = 0
  const domainTotals: Record<QuestionDomain, { total: number; correct: number }> = {
    Foundations: { total: 0, correct: 0 },
    "Strategy Analysis": { total: 0, correct: 0 },
    "Stakeholder Analysis": { total: 0, correct: 0 },
    "Systems Modelling": { total: 0, correct: 0 },
    "Requirements Engineering": { total: 0, correct: 0 },
    "Business Cases": { total: 0, correct: 0 },
  }

  const answerDetails = questions.map(q => {
    const selectedKey = answers[q.id] || ""
    const correctOption = q.options.find(o => o.isCorrect)
    const isCorrect = selectedKey === correctOption?.key

    // Track domain totals
    if (domainTotals[q.domain]) {
      domainTotals[q.domain].total++
      if (isCorrect) {
        domainTotals[q.domain].correct++
      }
    }

    if (isCorrect) {
      correctCount++
    }

    return {
      questionId: q.id,
      prompt: q.prompt,
      domain: q.domain,
      selectedKey,
      correctKey: correctOption?.key || "",
      isCorrect,
      explanation: q.explanation,
      syllabusReference: q.syllabusReference,
    }
  })

  const totalQuestions = questions.length
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const passedOfficial = score >= 65 // Official BCS pass mark
  const passedAcademy = score >= 90 // Academy mastery threshold

  const domainBreakdowns: DomainBreakdown[] = Object.entries(domainTotals)
    .filter(([, stats]) => stats.total > 0)
    .map(([domain, stats]) => ({
      domain: domain as QuestionDomain,
      totalQuestions: stats.total,
      correctCount: stats.correct,
      percentage: Math.round((stats.correct / stats.total) * 100),
    }))

  return {
    score,
    totalQuestions,
    correctCount,
    passedOfficial,
    passedAcademy,
    timeSpentSeconds,
    domainBreakdowns,
    answers: answerDetails,
  }
}
