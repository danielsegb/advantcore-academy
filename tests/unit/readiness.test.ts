import { describe, it, expect } from "vitest"
import {
  calculateReadiness, interviewScenarios, generateLinkedInCaseStudyBullets,
} from "@/lib/readiness/readiness-calculator"

describe("Readiness Analytics & Career Accelerator", () => {
  it("calculates transparent multi-dimensional readiness metrics", () => {
    const readiness = calculateReadiness(87, 82, 68, 80)

    expect(readiness.overallScore).toBe(80)
    expect(readiness.knowledgeMastery.score).toBe(87)
    expect(readiness.mockExamScore.score).toBe(82)
    expect(readiness.workplaceEvidence.score).toBe(68)
    expect(readiness.interviewReadiness.score).toBe(80)
  })

  it("provides structured BA interview scenarios with model frameworks", () => {
    expect(interviewScenarios.length).toBe(4)
    interviewScenarios.forEach(scen => {
      expect(scen.title).toBeDefined()
      expect(scen.question).toBeDefined()
      expect(scen.modelAnswerFramework).toBeDefined()
      expect(scen.keyCriteria.length).toBeGreaterThan(0)
    })
  })

  it("generates verified LinkedIn bullets with non-employment disclosure", () => {
    const bullets = generateLinkedInCaseStudyBullets("Amanda Okafor")
    expect(bullets).toContain("Amanda Okafor")
    expect(bullets).toContain("ADV-BA-001")
    expect(bullets).toContain("Advantcore Academy")
    expect(bullets).toContain("simulated project experience")
  })
})
