import type { AcademyAIRequest, AcademyAIResult } from "./types"

function meetingReply(input: AcademyAIRequest): string {
  const role = input.character?.role || "BA Supervisor"
  const question = (input.message || "").toLowerCase()
  if (question.includes("success") || question.includes("measure")) {
    return `From my perspective as ${role}, success needs to be measurable. Define the current baseline, the target improvement, who owns the measure and when it will be reviewed. Which outcome can you evidence first without assuming the solution?`
  }
  if (question.includes("requirement") || question.includes("need")) {
    return `That may be a valid requirement, but it is not yet sufficiently evidenced. Trace it to a stakeholder need, clarify the business rule and define an acceptance measure. What source or observation supports it?`
  }
  if (question.includes("scope")) {
    return `Keep the first scope centred on enquiry qualification, ownership and the delivery hand-off. Record anything beyond that as an explicit exclusion or later phase. What decision do you need from this meeting to make that boundary workable?`
  }
  return `Your direction is reasonable, but I need you to separate confirmed facts from assumptions. Identify the evidence you have, the gap that remains and the stakeholder best placed to validate it. What would you ask them next?`
}

export function runAcademyLocalFallback(input: AcademyAIRequest): AcademyAIResult {
  if (input.action === "meetingReply") {
    return { text: meetingReply(input), provider: "local", model: "academy-rule-engine-v1", degraded: true }
  }
  if (input.action === "quizFeedback") {
    const answer = (input.answer || "").toLowerCase()
    const concepts = input.expectedConcepts || []
    const matched = concepts.filter(concept => answer.includes(concept.toLowerCase()))
    const score = concepts.length ? Math.round((matched.length / concepts.length) * 100) : Math.min(90, answer.split(/\s+/).filter(Boolean).length * 4)
    const data = { score, correct: score >= 90, feedback: score >= 90 ? "Your answer demonstrates the required concepts." : "Your answer needs clearer coverage of the expected concepts.", missingConcepts: concepts.filter(c => !matched.includes(c)), nextStep: score >= 90 ? "Continue to the next lesson." : "Review the missing concepts and retake the quiz." }
    return { text: JSON.stringify(data), provider: "local", model: "academy-mastery-engine-v1", degraded: true, data }
  }
  if (input.action === "pathwayRecommendation") {
    return { text: "Suggested structure: foundations, methods, supervised application, assessed evidence, full mock assessment and job-readiness preparation. Add a human approval gate after every project stage and verify the current certification syllabus before publication.", provider: "local", model: "academy-pathway-rules-v1", degraded: true }
  }
  return { text: "The evidence cannot be approved automatically. Confirm the assessment rubric, source, owner and required standard, then review accuracy, traceability and completeness before human sign-off.", provider: "local", model: "academy-evidence-rules-v1", degraded: true }
}

