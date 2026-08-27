import type { ScheduleEvent } from "./types"

export function buildGoogleCalendarUrl(
  title: string,
  details: string,
  location = "Advantcore Academy Virtual Workplace",
  startHour = 10,
  durationMinutes = 60
): string {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, startHour, 0, 0)
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000)

  function formatGCalDate(d: Date): string {
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  }

  const dates = `${formatGCalDate(start)}/${formatGCalDate(end)}`

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
    location
  )}&dates=${dates}`
}

export function buildEventGoogleCalendarUrl(event: ScheduleEvent): string {
  const details = `${event.detail}\n\nProject: Advantcore Enquiry-to-Delivery Transformation (ADV-BA-001)\nPathway: Business Analyst Career Accelerator\nAdvantcore Academy`
  const [hourStr] = event.time.split(":")
  const startHour = Number(hourStr) || 10

  return buildGoogleCalendarUrl(
    `[Advantcore Academy] ${event.title}`,
    details,
    "Advantcore Academy Virtual Workplace",
    startHour,
    event.durationMinutes
  )
}
