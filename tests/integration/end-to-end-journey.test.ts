import { describe, it, expect } from "vitest"
import { fullCurriculum } from "@/lib/learning/curriculum-data"
import { evaluateMockExam } from "@/lib/mock-exam/engine"
import { fullMockQuestionBank } from "@/lib/mock-exam/question-bank"
import type { MockExamQuestion } from "@/lib/mock-exam/types"
import { initialEvidenceItems, advantcoreProjectStages } from "@/lib/workplace/project-data"
import { buildAcademyPrompt } from "@/lib/academy-ai/prompts"
import { runAcademyLocalFallback } from "@/lib/academy-ai/local-fallback"
import { generateMeetingMinutes } from "@/lib/meetings/minutes-generator"
import { initialTranscript } from "@/components/meetings/meeting-room-view"
import { full12WeekSchedule } from "@/lib/planner/schedule-data"
import { calculateAdaptiveSchedule } from "@/lib/planner/adaptive-scheduler"
import { buildEventGoogleCalendarUrl } from "@/lib/planner/google-calendar"
import { calculateReadiness, generateLinkedInCaseStudyBullets } from "@/lib/readiness/readiness-calculator"
import { validateUploadBuffer } from "@/lib/security/upload-validator"
import { buildDsarExportPackage } from "@/lib/compliance/gdpr-policy"
import { checkSystemHealth } from "@/lib/observability/health"

describe("Advantcore Academy End-to-End Learner Pathway Journey", () => {
  it("executes the complete 8-stage accredited learner lifecycle without errors", async () => {
    // Stage 1: Health & Runtime Observability
    const health = await checkSystemHealth()
    expect(health.status).toBe("healthy")
    expect(health.subsystems.aiEngine.fallbackReady).toBe(true)

    // Stage 2: Learning Studio & Mastery Quiz Structure
    expect(fullCurriculum.length).toBe(6)
    const module1 = fullCurriculum[0]
    expect(module1.lessons.length).toBeGreaterThan(0)
    expect(module1.lessons[0].questions.length).toBeGreaterThan(0)

    // Stage 3: Mock Examination Simulation (40 Questions)
    const answers: Record<string, string> = {}
    fullMockQuestionBank.forEach((q: MockExamQuestion) => {
      const correctOpt = q.options.find(o => o.isCorrect)
      if (correctOpt) {
        answers[q.id] = correctOpt.key
      }
    })
    const examResult = evaluateMockExam(fullMockQuestionBank, answers, 3600)
    expect(examResult.score).toBe(100)
    expect(examResult.passedOfficial).toBe(true)
    expect(examResult.passedAcademy).toBe(true)

    // Stage 4: Workplace Project Delivery & Evidence Gates
    expect(advantcoreProjectStages.length).toBe(5)
    const totalTasks = advantcoreProjectStages.reduce((acc, s) => acc + s.tasks.length, 0)
    expect(totalTasks).toBe(10)
    // Verify initial clean state
    expect(initialEvidenceItems.length).toBe(0)

    // Stage 5: Grounded AI Consultation & Executive Meeting Minutes
    const aiPrompt = buildAcademyPrompt({
      action: "meetingReply",
      character: { name: "Marcus Cole", role: "BA Supervisor" },
      project: { name: "Enquiry-to-delivery transformation", company: "Advantcore Ltd" },
      message: "How do we handle scope boundaries?",
    })
    expect(aiPrompt).toContain("<approved_project_sources")
    const aiReply = runAcademyLocalFallback({
      action: "meetingReply",
      character: { name: "Marcus Cole", role: "BA Supervisor" },
      message: "What is the requirement for this project?",
    })
    expect(aiReply.text).toContain("BCS-BA-001")

    const minutes = generateMeetingMinutes(
      initialTranscript,
      "Enquiry-to-delivery transformation",
      "ADV-BA-001",
      "Amanda Okafor"
    )
    expect(minutes.actionItems.length).toBeGreaterThan(0)
    expect(minutes.markdown).toContain("PROJECT MEETING MINUTES")

    // Stage 6: 12-Week Adaptive Scheduling & Google Calendar Integration
    expect(full12WeekSchedule.length).toBe(12)
    const adaptivePlan = calculateAdaptiveSchedule(full12WeekSchedule, 5, 14)
    expect(adaptivePlan.daysSaved).toBe(14)
    expect(adaptivePlan.acceleratedWeeks).toBe(10)
    const gcalUrl = buildEventGoogleCalendarUrl(full12WeekSchedule[0].events[0])
    expect(gcalUrl).toContain("calendar.google.com")

    // Stage 7: Readiness Analytics & Career Transition Accelerator
    const readiness = calculateReadiness(87, 82, 68, 80)
    expect(readiness.overallScore).toBe(80)
    const linkedInBullets = generateLinkedInCaseStudyBullets("Amanda Okafor")
    expect(linkedInBullets).toContain("simulated project experience")
    expect(linkedInBullets).toContain("Amanda Okafor")

    // Stage 8: Upload Security & UK GDPR DSAR Package Export
    const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35])
    const uploadValidation = validateUploadBuffer(pdfBuffer, "evidence.pdf")
    expect(uploadValidation.isValid).toBe(true)
    expect(uploadValidation.quarantineStatus).toBe("quarantined")

    const dsar = buildDsarExportPackage("usr-demo", "Amanda Okafor", "amanda@advantcore.co")
    expect(dsar.controller.legalEntity).toBe("Advantcore Ltd")
    expect(dsar.complianceNotice).toContain("UK GDPR Article 15")
  })
})
