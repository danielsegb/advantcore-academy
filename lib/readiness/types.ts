export interface ReadinessBreakdown {
  overallScore: number // Composite weighted
  knowledgeMastery: { score: number; detail: string; status: "mastered" | "on_track" | "in_progress" }
  mockExamScore: { score: number; detail: string; status: "passed_official" | "mastered" | "not_met" }
  workplaceEvidence: { score: number; detail: string; approvedDeliverables: number; totalDeliverables: number }
  interviewReadiness: { score: number; detail: string; scenariosCompleted: number }
}

export interface InterviewScenario {
  id: string
  title: string
  category: "Stakeholder Management" | "Systems Modelling" | "Requirements Engineering" | "Business Case"
  question: string
  interviewerRole: string
  modelAnswerFramework: string
  keyCriteria: string[]
}
