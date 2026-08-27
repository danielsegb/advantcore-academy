import { describe, it, expect } from "vitest"
import { generateMeetingMinutes } from "@/lib/meetings/minutes-generator"
import { initialTranscript } from "@/components/meetings/meeting-room-view"

describe("Live Meetings & Minutes Generator", () => {
  it("synthesizes meeting transcript into structured minutes", () => {
    const minutes = generateMeetingMinutes(
      initialTranscript,
      "Enquiry-to-delivery transformation",
      "ADV-BA-001",
      "Amanda Okafor"
    )

    expect(minutes.meetingTitle).toBeDefined()
    expect(minutes.projectCode).toBe("ADV-BA-001")
    expect(minutes.attendees.length).toBeGreaterThan(0)
    expect(minutes.decisionsAgreed.length).toBeGreaterThan(0)
    expect(minutes.actionItems.length).toBeGreaterThan(0)
    expect(minutes.markdown).toContain("PROJECT MEETING MINUTES")
    expect(minutes.markdown).toContain("ADV-BA-001")
  })

  it("extracts actionable follow-up items with assigned owners and due dates", () => {
    const minutes = generateMeetingMinutes(
      initialTranscript,
      "Enquiry-to-delivery transformation",
      "ADV-BA-001",
      "Amanda Okafor"
    )

    minutes.actionItems.forEach(item => {
      expect(item.task).toBeDefined()
      expect(item.owner).toBeDefined()
      expect(item.dueDate).toBeDefined()
      expect(item.status).toBe("pending")
    })
  })
})
