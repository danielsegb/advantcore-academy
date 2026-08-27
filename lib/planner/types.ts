export type EventType = "lesson" | "task" | "meeting" | "mock_exam" | "review_gate"

export interface ScheduleEvent {
  id: string
  weekNumber: number
  day: string // e.g. "Mon", "Tue", "Wed", "Thu", "Fri"
  time: string
  title: string
  detail: string
  type: EventType
  durationMinutes: number
  isFixedDeadline?: boolean
  status: "done" | "upcoming" | "in_progress"
  actionUrl?: string
}

export interface WeekSchedule {
  weekNumber: number
  title: string
  moduleTitle: string
  projectStageTitle: string
  hoursEstimated: number
  status: "done" | "active" | "upcoming"
  events: ScheduleEvent[]
}

export interface AdaptiveSchedulePlan {
  originalWeeks: number
  acceleratedWeeks: number
  daysSaved: number
  currentPaceStatus: "ahead" | "on_track" | "behind"
  estimatedCompletionDate: string
  shifts: { eventId: string; title: string; originalWeek: number; newWeek: number }[]
}
