export type ExamMode = "full_mock" | "topic_practice" | "diagnostic"

export type QuestionDomain =
  | "Foundations"
  | "Strategy Analysis"
  | "Stakeholder Analysis"
  | "Systems Modelling"
  | "Requirements Engineering"
  | "Business Cases"

export interface MockExamOption {
  key: string
  text: string
  isCorrect: boolean
}

export interface MockExamQuestion {
  id: string
  domain: QuestionDomain
  moduleNumber: string
  prompt: string
  options: MockExamOption[]
  explanation: string
  syllabusReference: string
}

export interface DomainBreakdown {
  domain: QuestionDomain
  totalQuestions: number
  correctCount: number
  percentage: number
}

export interface MockExamResult {
  score: number
  totalQuestions: number
  correctCount: number
  passedOfficial: boolean // >= 65%
  passedAcademy: boolean // >= 90%
  timeSpentSeconds: number
  domainBreakdowns: DomainBreakdown[]
  answers: {
    questionId: string
    prompt: string
    domain: QuestionDomain
    selectedKey: string
    correctKey: string
    isCorrect: boolean
    explanation: string
    syllabusReference: string
  }[]
}
