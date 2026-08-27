"use client"

import React, { useState } from "react"
import {
  FileText, ShieldCheck, RefreshCw, Send, CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import type { WorkplaceTask, EvidenceItem } from "@/lib/workplace/types"
import { useAuth } from "@/lib/auth/auth-context"

interface EvidenceEditorDialogProps {
  task: WorkplaceTask
  existingEvidence?: EvidenceItem
  onEvidenceSaved?: (evidence: EvidenceItem) => void
}

export function EvidenceEditorDialog({ task, existingEvidence, onEvidenceSaved }: EvidenceEditorDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(existingEvidence?.title || `${task.title} Deliverable`)
  const [content, setContent] = useState(
    existingEvidence?.content ||
      `# ${task.title}\n**Project:** Advantcore Enquiry-to-Delivery Process Transformation (ADV-BA-001)\n**Deliverable:** ${task.deliverable}\n\n## 1. Executive Summary\n[Enter your deliverable findings here...]\n\n## 2. Evidence & Analysis\n[Detail your analysis against BCS standards...]\n\n## 3. Recommendations\n[Outline target actions and next steps...]`
  )
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>(existingEvidence?.status || "draft")

  const isAdmin = user?.role === "admin"

  async function handleSave(action: "submit" | "saveDraft") {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/workplace/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          evidenceId: existingEvidence?.id,
          taskId: task.id,
          userId: user?.id,
          title,
          content,
          version: (existingEvidence?.version || 1) + (action === "submit" ? 1 : 0),
        }),
      })

      const data = (await res.json()) as { success?: boolean; status?: string }
      if (data.success && data.status) {
        setStatus(data.status)
        if (onEvidenceSaved) {
          onEvidenceSaved({
            id: existingEvidence?.id || `ev-${Date.now()}`,
            taskId: task.id,
            taskTitle: task.title,
            stageNumber: 1,
            title,
            content,
            version: (existingEvidence?.version || 1) + 1,
            status: data.status as EvidenceItem["status"],
            updatedAt: new Date().toISOString(),
          })
        }
      }
      setOpen(false)
    } catch {
      // Local fallback
      const newStat = action === "submit" ? "in_review" : "draft"
      setStatus(newStat)
      if (onEvidenceSaved) {
        onEvidenceSaved({
          id: existingEvidence?.id || `ev-${Date.now()}`,
          taskId: task.id,
          taskTitle: task.title,
          stageNumber: 1,
          title,
          content,
          version: (existingEvidence?.version || 1) + 1,
          status: newStat,
          updatedAt: new Date().toISOString(),
        })
      }
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleReviewDecision(decision: "approved" | "changes_requested") {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/workplace/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "review",
          evidenceId: existingEvidence?.id,
          taskId: task.id,
          userId: user?.id,
          title,
          content,
          reviewerDecision: {
            reviewerName: "Helen Grant (Independent Reviewer)",
            decision,
            comment: decision === "approved" ? "Deliverable verified against BCS assessment rubrics." : "Please expand on process exceptions.",
          },
        }),
      })

      const data = (await res.json()) as { success?: boolean; status?: string }
      if (data.success && data.status) {
        setStatus(data.status)
      }
      setOpen(false)
    } catch {
      setStatus(decision)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={existingEvidence?.status === "approved" ? "outline" : "default"}>
          <FileText className="w-4 h-4 mr-1.5" />
          {existingEvidence ? (existingEvidence.status === "approved" ? "View evidence" : "Edit deliverable") : "Author deliverable"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">Task {task.taskNumber} · Deliverable</Badge>
            <Badge
              className={
                status === "approved"
                  ? "bg-emerald-500 text-white"
                  : status === "in_review"
                  ? "bg-amber-500 text-white"
                  : "bg-muted text-muted-foreground"
              }
            >
              {status === "approved" ? <ShieldCheck className="w-3.5 h-3.5 mr-1" /> : null}
              {status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>
            Required Deliverable: <strong>{task.deliverable}</strong> ({task.requiredFormat})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Acceptance criteria reminders */}
          <div className="p-3 rounded-lg border bg-muted/30 text-xs space-y-1.5">
            <strong className="block text-foreground font-semibold">Deliverable Acceptance Criteria:</strong>
            <ul className="space-y-1 text-muted-foreground">
              {task.acceptanceCriteria.map(ac => (
                <li key={ac} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{ac}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supervisor / Reviewer Feedback if present */}
          {existingEvidence?.supervisorFeedback && (
            <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 text-xs space-y-1">
              <strong className="text-blue-600 block">Marcus Cole (BA Supervisor Guidance):</strong>
              <p className="text-muted-foreground">{existingEvidence.supervisorFeedback}</p>
            </div>
          )}

          {existingEvidence?.reviewerDecision && (
            <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-1">
              <strong className="text-emerald-600 block">Helen Grant (Independent Reviewer Decision):</strong>
              <p className="text-muted-foreground">{existingEvidence.reviewerDecision.comment}</p>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-xs font-semibold">
              Deliverable Title
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full mt-1 p-2 text-sm border rounded bg-background"
              />
            </label>

            <label className="block text-xs font-semibold">
              Deliverable Content (Markdown formatted)
              <textarea
                rows={12}
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full mt-1 p-3 text-xs font-mono border rounded bg-background leading-relaxed"
              />
            </label>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center w-full pt-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>

          <div className="flex gap-2">
            {isAdmin ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive"
                  onClick={() => handleReviewDecision("changes_requested")}
                >
                  <AlertCircle className="w-4 h-4 mr-1" /> Request changes
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleReviewDecision("approved")}
                >
                  <ShieldCheck className="w-4 h-4 mr-1" /> Approve deliverable
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => handleSave("saveDraft")}>
                  Save draft
                </Button>
                <Button
                  size="sm"
                  className="primary-action"
                  disabled={loading}
                  onClick={() => handleSave("submit")}
                >
                  {loading ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
                  Submit for review
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
