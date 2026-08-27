import { describe, it, expect } from "vitest"
import { runAcademyLocalFallback } from "@/lib/academy-ai/local-fallback"

describe("Academy AI Local Fallback Engine", () => {
  it("generates context-aware meeting reply with supervisor guidance", () => {
    const result = runAcademyLocalFallback({
      action: "meetingReply",
      character: { name: "Marcus Cole", role: "BA Supervisor" },
      message: "How should I measure project success?",
    })

    expect(result.provider).toBe("local")
    expect(result.degraded).toBe(true)
    expect(result.text).toContain("success needs to be measurable")
  })

  it("scores quiz answers and evaluates mastery threshold (>=90%)", () => {
    const passed = runAcademyLocalFallback({
      action: "quizFeedback",
      question: "Explain stakeholder power-interest grid",
      answer: "The power-interest grid categorises influence and interest to determine appropriate communication.",
      expectedConcepts: ["influence", "interest", "communication"],
    })

    expect(passed.data).toBeDefined()
    expect(passed.data?.score).toBe(100)
    expect(passed.data?.correct).toBe(true)

    const failed = runAcademyLocalFallback({
      action: "quizFeedback",
      question: "Explain stakeholder power-interest grid",
      answer: "It is a chart.",
      expectedConcepts: ["influence", "interest", "communication"],
    })

    expect(failed.data?.correct).toBe(false)
    expect(failed.data?.missingConcepts).toEqual(["influence", "interest", "communication"])
  })

  it("recommends pathway structure requiring human verification", () => {
    const result = runAcademyLocalFallback({
      action: "pathwayRecommendation",
      targetRole: "Business Analyst",
      certification: "BCS Foundation",
    })

    expect(result.text).toContain("human approval gate")
  })

  it("withholds automated evidence approval", () => {
    const result = runAcademyLocalFallback({
      action: "evidenceReview",
      evidence: "Draft project charter",
    })

    expect(result.text).toContain("cannot be approved automatically")
  })
})
