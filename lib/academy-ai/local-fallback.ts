import type { AcademyAIRequest, AcademyAIResult } from "./types"

function meetingReply(input: AcademyAIRequest): string {
  const name = input.character?.name || "Marcus Cole"
  const role = input.character?.role || "BA Supervisor"
  const question = (input.message || "").toLowerCase()

  if (role.toLowerCase().includes("sponsor") || name.includes("Sarah")) {
    if (question.includes("scope") || question.includes("boundary")) {
      return `As Project Sponsor, my commercial mandate in the Project Charter [ADV-DOC-001] is reducing our delivery cycle time from 14 days down to 4 days. Proprietary billing systems are explicitly excluded. What decision do you need from the steering committee to keep us on track?`
    }
    return `Our priority is commercial payback within 12 months and removing operational friction in client intake [ADV-DOC-001]. What evidence have you gathered that supports this recommendation?`
  }

  if (role.toLowerCase().includes("operation") || name.includes("Priya")) {
    if (question.includes("pain") || question.includes("process") || question.includes("delay")) {
      return `Our biggest bottleneck is the manual transfer of web enquiries into separate spreadsheets [ADV-SOP-002], causing an average 4.8-day response lag. How does your proposed future-state workflow automate this intake?`
    }
    return `From an operational perspective, the team is overwhelmed by duplicate data entry across lead spreadsheets [ADV-SOP-002]. Have you mapped all the As-Is hand-offs between sales and mobilization?`
  }

  if (role.toLowerCase().includes("reviewer") || name.includes("Helen")) {
    return `As Independent Reviewer, I evaluate evidence against strict BCS Foundation assessment rubrics [BCS-BA-001]. Ensure all functional requirements maintain horizontal traceability to your project charter objectives.`
  }

  // Default: Marcus Cole (BA Supervisor)
  if (question.includes("success") || question.includes("measure")) {
    return `From a BA supervisory perspective, success must be grounded in verified baselines [ADV-DOC-001] and success needs to be measurable. What specific metrics from our current 14-day cycle time can you baseline first?`
  }
  if (question.includes("requirement") || question.includes("need")) {
    return `That may be a valid requirement, but ensure you classify it as Functional or Non-Functional in your Requirements Catalogue [BCS-BA-001]. What acceptance criteria define its completion?`
  }
  return `Good direction, but remember to separate confirmed business facts from assumptions [ADV-DOC-001]. Which stakeholder interview notes support this conclusion?`
}

export function runAcademyLocalFallback(input: AcademyAIRequest): AcademyAIResult {
  if (input.action === "meetingReply") {
    return { text: meetingReply(input), provider: "local", model: "academy-grounded-engine-v1", degraded: true }
  }
  if (input.action === "quizFeedback") {
    const answer = (input.answer || "").toLowerCase()
    const concepts = input.expectedConcepts || []
    const matched = concepts.filter(concept => answer.includes(concept.toLowerCase()))
    const score = concepts.length ? Math.round((matched.length / concepts.length) * 100) : Math.min(90, answer.split(/\s+/).filter(Boolean).length * 4)
    const data = {
      score,
      correct: score >= 90,
      feedback: score >= 90 ? "Your answer demonstrates the required concepts based on BCS syllabus [BCS-BA-001]." : "Your answer needs clearer coverage of the expected concepts.",
      missingConcepts: concepts.filter(c => !matched.includes(c)),
      nextStep: score >= 90 ? "Continue to the next lesson." : "Review the missing concepts and retake the quiz.",
    }
    return { text: JSON.stringify(data), provider: "local", model: "academy-mastery-engine-v1", degraded: true, data }
  }
  if (input.action === "pathwayRecommendation") {
    return {
      text: "Suggested structure: foundations, methods, supervised application, assessed evidence, full mock assessment and job-readiness preparation [BCS-BA-001]. Add a human approval gate / administrator approval gate after every project stage and verify syllabus before publication.",
      provider: "local",
      model: "academy-pathway-rules-v1",
      degraded: true,
    }
  }
  return {
    text: "The evidence cannot be approved automatically. Verify the deliverable against the BCS assessment rubric [BCS-BA-001] before independent human sign-off.",
    provider: "local",
    model: "academy-evidence-rules-v1",
    degraded: true,
  }
}
