import type { ScheduleEvent } from "./types"

export function formatGCalDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

export function buildGoogleCalendarUrl(
  title: string,
  details: string,
  location = "Advantcore Academy Virtual Workplace",
  startDate?: Date,
  durationMinutes = 60
): string {
  const start = startDate || new Date(Date.now() + 24 * 60 * 60 * 1000)
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000)
  const dates = `${formatGCalDate(start)}/${formatGCalDate(end)}`

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
    location
  )}&dates=${dates}`
}

export function buildEventGoogleCalendarUrl(event: ScheduleEvent, activeWeek = 1): string {
  const details = `${event.detail}\n\nProject: Advantcore Enquiry-to-Delivery Transformation (ADV-BA-001)\nPathway: Business Analyst Career Accelerator\nAdvantcore Academy`

  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const mondayThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday)

  const dayMap: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
  }
  const dayOffset = dayMap[event.day] ?? 0
  const weekDiff = event.weekNumber - activeWeek
  const weekOffset = Math.max(0, weekDiff) * 7

  const startDate = new Date(mondayThisWeek.getTime() + (weekOffset + dayOffset) * 24 * 60 * 60 * 1000)
  const [hourStr, minuteStr] = event.time.split(":")
  startDate.setHours(Number(hourStr) || 10, Number(minuteStr) || 0, 0, 0)

  // If the calculated date/time is in the past for current week, advance to upcoming
  if (startDate.getTime() < now.getTime() && weekDiff <= 0) {
    startDate.setDate(startDate.getDate() + 7)
  }

  return buildGoogleCalendarUrl(
    `[Advantcore Academy] ${event.title}`,
    details,
    "Advantcore Academy Virtual Workplace",
    startDate,
    event.durationMinutes
  )
}
