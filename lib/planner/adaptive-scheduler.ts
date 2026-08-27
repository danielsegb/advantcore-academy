import type { WeekSchedule, AdaptiveSchedulePlan } from "./types"

export function calculateAdaptiveSchedule(
  baseSchedule: WeekSchedule[],
  currentWeek = 5,
  daysAhead = 12
): AdaptiveSchedulePlan {
  const weeksAhead = Math.floor(daysAhead / 7)
  const daysSaved = daysAhead

  // Calculate accelerated duration
  const originalWeeks = baseSchedule.length // 12
  const acceleratedWeeks = Math.max(currentWeek + 1, originalWeeks - weeksAhead)

  // Calculate target graduation date
  const now = new Date()
  const remainingWeeks = acceleratedWeeks - currentWeek
  const targetDate = new Date(now.getTime() + remainingWeeks * 7 * 24 * 60 * 60 * 1000)

  const shifts: { eventId: string; title: string; originalWeek: number; newWeek: number }[] = []

  baseSchedule.forEach(ws => {
    if (ws.weekNumber > currentWeek) {
      ws.events.forEach(ev => {
        // Shift flexible events earlier, preserve fixed review gates
        if (!ev.isFixedDeadline && weeksAhead > 0) {
          const newWeek = Math.max(currentWeek + 1, ws.weekNumber - weeksAhead)
          if (newWeek !== ws.weekNumber) {
            shifts.push({
              eventId: ev.id,
              title: ev.title,
              originalWeek: ws.weekNumber,
              newWeek,
            })
          }
        }
      })
    }
  })

  return {
    originalWeeks,
    acceleratedWeeks,
    daysSaved,
    currentPaceStatus: daysAhead > 0 ? "ahead" : daysAhead === 0 ? "on_track" : "behind",
    estimatedCompletionDate: targetDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    shifts,
  }
}
