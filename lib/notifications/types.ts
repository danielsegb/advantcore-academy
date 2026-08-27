import type { View } from "@/components/shared/types"

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: "review" | "milestone" | "meeting" | "quiz"
  timestamp: string
  read: boolean
  actionView?: View
}

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Deliverable Approved",
    message: "Helen Grant approved your Stakeholder Engagement Matrix & RACI deliverable.",
    type: "review",
    timestamp: "10 mins ago",
    read: false,
    actionView: "workplace",
  },
  {
    id: "notif-2",
    title: "Supervisory Coaching Feedback",
    message: "Marcus Cole left comments on your As-Is process swimlane draft.",
    type: "review",
    timestamp: "1 hour ago",
    read: false,
    actionView: "workplace",
  },
  {
    id: "notif-3",
    title: "Upcoming Project Scoping Session",
    message: "Discovery consultation with Priya Shah scheduled in the Team Room.",
    type: "meeting",
    timestamp: "Today at 10:00",
    read: false,
    actionView: "meetings",
  },
  {
    id: "notif-4",
    title: "Pace Milestone Achieved",
    message: "You are currently 12 days ahead of schedule. Review the Adaptive Planner to see your updated graduation forecast.",
    type: "milestone",
    timestamp: "Yesterday",
    read: true,
    actionView: "calendar",
  },
]
