export type EvidenceStatus = "draft" | "submitted" | "in_review" | "changes_requested" | "approved" | "rejected"

export interface WorkplaceTask {
  id: string
  stageId: string
  taskNumber: string
  title: string
  description: string
  deliverable: string
  requiredFormat: string
  acceptanceCriteria: string[]
  assignedStakeholder: string
  status: "todo" | "in_progress" | "review" | "done"
  evidenceId?: string
}

export interface ProjectStage {
  id: string
  stageNumber: number
  title: string
  code: string
  status: "done" | "active" | "locked"
  progressPercentage: number
  description: string
  tasks: WorkplaceTask[]
}

export interface EvidenceItem {
  id: string
  taskId: string
  taskTitle: string
  stageNumber: number
  title: string
  content: string
  version: number
  status: EvidenceStatus
  supervisorFeedback?: string
  reviewerDecision?: {
    reviewerName: string
    decision: "approved" | "changes_requested" | "rejected"
    comment: string
    timestamp: string
  }
  updatedAt: string
}
