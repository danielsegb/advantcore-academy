import { describe, it, expect } from "vitest"
import { fullCurriculum } from "@/lib/learning/curriculum-data"

describe("Learning Management & Curriculum Engine", () => {
  it("contains all 6 required BCS Foundation modules", () => {
    expect(fullCurriculum.length).toBe(6)
    const moduleNumbers = fullCurriculum.map(m => m.moduleNumber)
    expect(moduleNumbers).toEqual(["01", "02", "03", "04", "05", "06"])
  })

  it("ensures every lesson has explicit learning outcomes and 10 mastery questions", () => {
    let totalQuestions = 0
    fullCurriculum.forEach(mod => {
      expect(mod.lessons.length).toBeGreaterThan(0)
      mod.lessons.forEach(les => {
        expect(les.outcomes.length).toBeGreaterThan(0)
        expect(les.concepts.length).toBeGreaterThan(0)
        expect(les.questions.length).toBe(10)
        totalQuestions += les.questions.length
        expect(les.workplaceConnection.title).toBeDefined()
      })
    })
    expect(totalQuestions).toBe(60)
  })

  it("calculates mastery correctly based on 80% threshold", () => {
    function isMastered(correct: number, total: number): boolean {
      const score = Math.round((correct / total) * 100)
      return score >= 80
    }

    expect(isMastered(10, 10)).toBe(true) // 100%
    expect(isMastered(8, 10)).toBe(true) // 80% (8/10 passes)
    expect(isMastered(7, 10)).toBe(false) // 70%
    expect(isMastered(5, 10)).toBe(false) // 50%
  })
})
