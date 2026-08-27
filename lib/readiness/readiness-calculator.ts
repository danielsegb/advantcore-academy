import type { ReadinessBreakdown, InterviewScenario } from "./types"

export function calculateReadiness(
  knowledgeMastery = 87,
  mockExamScore = 82,
  workplaceEvidence = 68,
  interviewReadiness = 80
): ReadinessBreakdown {
  // Composite calculation: 35% Knowledge + 25% Mock Exam + 25% Workplace Evidence + 15% Interview Prep
  const overallScore = Math.round(
    knowledgeMastery * 0.35 +
      mockExamScore * 0.25 +
      workplaceEvidence * 0.25 +
      interviewReadiness * 0.15
  )

  return {
    overallScore,
    knowledgeMastery: {
      score: knowledgeMastery,
      detail: "14 lessons completed · 5 quizzes passed at >=90%",
      status: knowledgeMastery >= 90 ? "mastered" : "on_track",
    },
    mockExamScore: {
      score: mockExamScore,
      detail: "Passed official BCS 65% benchmark · Target 90% mastery",
      status: mockExamScore >= 90 ? "mastered" : "passed_official",
    },
    workplaceEvidence: {
      score: workplaceEvidence,
      detail: "4 deliverables approved · Stage 3 in progress",
      approvedDeliverables: 4,
      totalDeliverables: 10,
    },
    interviewReadiness: {
      score: interviewReadiness,
      detail: "4 technical & behavioral scenarios prepared",
      scenariosCompleted: 4,
    },
  }
}

export const interviewScenarios: InterviewScenario[] = [
  {
    id: "scen-1",
    title: "Handling Conflicting Stakeholder Priorities",
    category: "Stakeholder Management",
    question: "Tell me about a time when two senior stakeholders had conflicting priorities on project scope. How did you resolve the deadlock?",
    interviewerRole: "Lead Business Analyst Hiring Manager",
    modelAnswerFramework: "Use the STAR approach grounded in your Advantcore Power-Interest & RACI analysis. Explain how Sarah Mitchell prioritized commercial cycle times while Priya Shah focused on team operational load, and how you used objective evidence to align them on the Project Charter.",
    keyCriteria: [
      "Mentions objective evidence over personal opinions",
      "References Power-Interest positioning and RACI decision rights",
      "Demonstrates empathy for operational constraints without losing strategic outcomes",
    ],
  },
  {
    id: "scen-2",
    title: "Applying the POPIT Model in Practice",
    category: "Systems Modelling",
    question: "How do you ensure you don't jump straight to a software solution when investigating a business problem?",
    interviewerRole: "Principal Consultant",
    modelAnswerFramework: "Explain the four dimensions of the POPIT model (Processes, People, Organization, Information/Technology). Reference how Advantcore's lead delay was primarily process hand-off and spreadsheet re-entry rather than lacking expensive tooling.",
    keyCriteria: [
      "Defines all 4 POPIT dimensions accurately",
      "Distinguishes business root causes from software symptoms",
      "Explains how holistic analysis saved commercial capital expenditure",
    ],
  },
  {
    id: "scen-3",
    title: "MoSCoW Prioritization & Scope Creep",
    category: "Requirements Engineering",
    question: "How do you manage a stakeholder demanding all 20 of their requested features as 'Must Haves' for the next release?",
    interviewerRole: "Agile Delivery Lead",
    modelAnswerFramework: "Explain the strict BCS definition of 'Must Have' (critical for legal, operational or commercial viability). Explain how you use horizontal traceability and trade-off matrices to categorize features into Must, Should, Could, and Won't have.",
    keyCriteria: [
      "Articulates the strict viability definition of Must Have",
      "Shows collaborative negotiation rather than blunt refusal",
      "Demonstrates requirements traceability to business objectives",
    ],
  },
  {
    id: "scen-4",
    title: "Justifying a Business Case Options Appraisal",
    category: "Business Case",
    question: "Walk me through how you evaluated options and financial metrics for your business case recommendation.",
    interviewerRole: "Director of Transformation",
    modelAnswerFramework: "Explain evaluating 'Do Nothing' as baseline, comparing tangible cost savings against CapEx/OpEx, calculating 12-month payback period, and articulating intangible brand trust benefits.",
    keyCriteria: [
      "Mentions 'Do Nothing' baseline comparison",
      "Differentiates tangible financial savings from intangible strategic benefits",
      "Calculates payback period and identifies proactive risk mitigations",
    ],
  },
]

export function generateLinkedInCaseStudyBullets(learnerName = "Amanda Okafor"): string {
  return `### Advantcore Academy — Business Analyst Simulated Project Experience
**Candidate:** ${learnerName}  
**Project:** Enquiry-to-Delivery Process Transformation (ADV-BA-001) | Advantcore Ltd  
**Role:** Lead Business Analysis Trainee  
**Accreditation Alignment:** BCS Foundation Certificate in Business Analysis  

**Key Verified Achievements:**
- Led end-to-end business analysis for enquiry-to-delivery transformation, targeting cycle time reduction from 14 to 4 business days.
- Authored Executive Problem Statement and Project Charter approved by Project Sponsor [ADV-DOC-001].
- Mapped 4 core stakeholders across Power-Interest Matrix and established governance RACI matrix [ADV-RACI-003].
- Modelled As-Is and To-Be process swimlanes identifying 4 spreadsheet hand-off bottlenecks and eliminating manual data re-entry.
- Formulated 16 functional and non-functional requirements catalogue with MoSCoW prioritization and Given-When-Then user stories.
- Produced Business Case Options Appraisal achieving projected 12-month financial payback and independent assessment sign-off.

*(Assessed simulated project experience completed at Advantcore Academy)*`
}
