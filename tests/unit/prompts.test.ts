import { describe, it, expect } from "vitest"
import { buildAcademyPrompt } from "@/lib/academy-ai/prompts"

describe("Academy Prompt Builder", () => {
  it("injects British English and anti-hallucination guardrails", () => {
    const prompt = buildAcademyPrompt({
      action: "meetingReply",
      character: { name: "Priya Shah", role: "Operations Lead" },
      project: { name: "Enquiry-to-delivery transformation", company: "Advantcore Ltd" },
      message: "What are your main operational pain points?",
    })

    expect(prompt).toContain("British English")
    expect(prompt).toContain("Do not invent company facts")
    expect(prompt).toContain("Priya Shah")
    expect(prompt).toContain("Operations Lead")
  })

  it("formats quiz feedback prompt with strict JSON output requirement", () => {
    const prompt = buildAcademyPrompt({
      action: "quizFeedback",
      question: "What is a SWOT analysis?",
      answer: "Strengths, weaknesses, opportunities, threats.",
      expectedConcepts: ["Strengths", "Weaknesses"],
    })

    expect(prompt).toContain("Return JSON only")
    expect(prompt).toContain("90% mastery")
  })
})
