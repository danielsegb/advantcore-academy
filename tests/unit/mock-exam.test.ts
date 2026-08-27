import { describe, it, expect } from "vitest"
import { fullMockQuestionBank } from "@/lib/mock-exam/question-bank"
import { generateExamQuestions, evaluateMockExam } from "@/lib/mock-exam/engine"

describe("Mock Examination Engine & Question Bank", () => {
  it("contains exactly 40 accredited-style BCS Foundation questions", () => {
    expect(fullMockQuestionBank.length).toBe(40)
  })

  it("covers all 6 syllabus domains with correct question distributions", () => {
    const domains = fullMockQuestionBank.map(q => q.domain)
    expect(domains.filter(d => d === "Foundations").length).toBe(6)
    expect(domains.filter(d => d === "Strategy Analysis").length).toBe(6)
    expect(domains.filter(d => d === "Stakeholder Analysis").length).toBe(7)
    expect(domains.filter(d => d === "Systems Modelling").length).toBe(7)
    expect(domains.filter(d => d === "Requirements Engineering").length).toBe(8)
    expect(domains.filter(d => d === "Business Cases").length).toBe(6)
  })

  it("generates 10 questions in diagnostic mode", () => {
    const diagnostic = generateExamQuestions("diagnostic")
    expect(diagnostic.length).toBe(10)
  })

  it("evaluates official 65% pass mark vs 90% Academy mastery threshold", () => {
    const questions = fullMockQuestionBank.slice(0, 40)

    // Build answers for 26 correct answers (65%)
    const passAnswers: Record<string, string> = {}
    questions.forEach((q, idx) => {
      const correctOpt = q.options.find(o => o.isCorrect)
      if (idx < 26) {
        passAnswers[q.id] = correctOpt?.key || "a"
      } else {
        passAnswers[q.id] = "wrong_answer"
      }
    })

    const result = evaluateMockExam(questions, passAnswers, 1800)
    expect(result.score).toBe(65)
    expect(result.passedOfficial).toBe(true)
    expect(result.passedAcademy).toBe(false)
    expect(result.domainBreakdowns.length).toBeGreaterThan(0)
  })
})
