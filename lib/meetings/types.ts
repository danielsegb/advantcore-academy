export interface ActionItem {
  id: string
  task: string
  owner: string
  dueDate: string
  status: "pending" | "completed"
}

export interface MeetingMinutes {
  id: string
  meetingTitle: string
  projectCode: string
  projectName: string
  date: string
  attendees: string[]
  executiveSummary: string
  keyDiscussionPoints: string[]
  decisionsAgreed: string[]
  actionItems: ActionItem[]
  risksIdentified: string[]
  markdown: string
}
