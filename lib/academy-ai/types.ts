export type AcademyAIAction =
  | "meetingReply"
  | "quizFeedback"
  | "pathwayRecommendation"
  | "evidenceReview"

export type AcademyAIRequest = {
  action: AcademyAIAction
  character?: { name: string; role: string; behaviour?: string }
  project?: { name: string; company: string; objective?: string; stage?: string }
  context?: string
  message?: string
  question?: string
  answer?: string
  expectedConcepts?: string[]
  targetRole?: string
  certification?: string
  evidence?: string
}

export type AcademyAIResult = {
  text: string
  provider: "groq" | "gemini" | "local"
  model: string
  degraded: boolean
  data?: Record<string, unknown>
}

