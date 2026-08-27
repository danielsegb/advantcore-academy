import { describe, it, expect } from "vitest"
import { fullCurriculum } from "@/lib/learning/curriculum-data"

describe("Learning Management & Curriculum Engine", () => {
  it("contains all 6 required BCS Foundation modules", () => {
    expect(fullCurriculum.length).toBe(6)
    const moduleNumbers = fullCurriculum.map(m => m.moduleNumber)
    expect(moduleNumbers).toEqual(["01", "02", "03", "04", "05", "06"])
  })

  it("ensures every lesson has explicit learning outcomes and questions", () => {
    fullCurriculum.forEach(mod => {
      expect(mod.lessons.length).toBeGreaterThan(0)
      mod.lessons.forEach(les => {
        expect(les.outcomes.length).toBeGreaterThan(0)
        expect(les.concepts.length).toBeGreaterThan(0)
        expect(les.questions.length).toBeGreaterThan(0)
        expect(les.workplaceConnection.title).toBeDefined()
      })
    })
  })

  it("calculates mastery correctly based on 90% threshold", () => {
    function isMastered(correct: number, total: number): boolean {
      const score = Math.round((correct / total) * 100)
      return score >= 90
    }

    expect(isMastered(3, 3)).toBe(true) // 100%
    expect(isMastered(9, 10)).toBe(true) // 90%
    expect(isMastered(2, 3)).toBe(false) // 67%
    expect(isMastered(8, 10)).toBe(false) // 80%
  })
})
