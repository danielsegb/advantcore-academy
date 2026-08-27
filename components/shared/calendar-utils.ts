export function formatGoogleDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

export function buildGoogleCalendarUrl(title: string, detail: string, hoursAhead = 24, durationMinutes = 45): string {
  const start = new Date(Date.now() + hoursAhead * 3600000)
  const end = new Date(start.getTime() + durationMinutes * 60000)
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: detail,
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
  }).toString()}`
}
