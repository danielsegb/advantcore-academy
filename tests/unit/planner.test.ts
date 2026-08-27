import { describe, it, expect } from "vitest"
import { full12WeekSchedule } from "@/lib/planner/schedule-data"
import { calculateAdaptiveSchedule } from "@/lib/planner/adaptive-scheduler"
import { buildEventGoogleCalendarUrl } from "@/lib/planner/google-calendar"

describe("Adaptive Planner & Schedule Engine", () => {
  it("contains complete 12-week curriculum and delivery schedule", () => {
    expect(full12WeekSchedule.length).toBe(12)
    const weeks = full12WeekSchedule.map(w => w.weekNumber)
    expect(weeks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it("calculates accelerated timeline when learner is ahead of schedule", () => {
    const plan = calculateAdaptiveSchedule(full12WeekSchedule, 5, 14) // 2 weeks ahead
    expect(plan.daysSaved).toBe(14)
    expect(plan.acceleratedWeeks).toBe(10)
    expect(plan.currentPaceStatus).toBe("ahead")
    expect(plan.shifts.length).toBeGreaterThan(0)
  })

  it("encodes valid Google Calendar template URLs", () => {
    const sampleEvent = full12WeekSchedule[4].events[0]
    const gcalUrl = buildEventGoogleCalendarUrl(sampleEvent)

    expect(gcalUrl).toContain("https://calendar.google.com/calendar/render")
    expect(gcalUrl).toContain("action=TEMPLATE")
    expect(gcalUrl).toContain(encodeURIComponent("[Advantcore Academy]"))
    expect(gcalUrl).toContain("Advantcore%20Academy%20Virtual%20Workplace")
  })
})
