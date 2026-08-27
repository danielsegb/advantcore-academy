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
    title: "Academy Workspace Ready",
    message: "Welcome to Advantcore Academy. Your BCS Business Analysis syllabus and ADV-BA-001 simulated project workspace are fully initialized.",
    type: "milestone",
    timestamp: "Just now",
    read: false,
    actionView: "dashboard",
  },
  {
    id: "notif-2",
    title: "Week 1 Orientation & Foundations",
    message: "Begin with Module 1 (Role & Competencies of a BA) and draft your Stage 1 Executive Problem Statement.",
    type: "quiz",
    timestamp: "10 mins ago",
    read: false,
    actionView: "learning",
  },
  {
    id: "notif-3",
    title: "Live Stakeholder Simulation Room",
    message: "Project Sponsor Sarah Mitchell and BA Supervisor Marcus Cole are available for simulated briefings and document presentations.",
    type: "meeting",
    timestamp: "Today",
    read: false,
    actionView: "meetings",
  },
]
