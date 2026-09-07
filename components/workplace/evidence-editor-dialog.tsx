"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  FileText, ShieldCheck, RefreshCw, Send, CheckCircle2,
  AlertCircle, Eye, Edit3, Columns, Bold, Italic, List,
  Table as TableIcon, CheckSquare, Sparkles, Printer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { RichMarkdownViewer } from "./rich-markdown-viewer"
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
      `# ${task.title}\n**Project:** Advantcore Enquiry-to-Delivery Process Transformation (ADV-BA-001)\n**Deliverable:** ${task.deliverable}\n\n## 1. Executive Summary\n[Enter your deliverable findings here...]\n\n## 2. Evidence & Analysis\n| Focus Area | Current State Issue | Impact | Priority |\n|---|---|---|---|\n| Lead Qualification | Unstructured triage | High drop-off | High |\n| Hand-off mobilisation | Missing SLA tracking | 4-day delays | Critical |\n\n## 3. Recommendations & Target Action Plan\n- [ ] Implement standardized inquiry intake checklist\n- [ ] Establish automated hand-off notifications across teams\n- [ ] Introduce weekly delivery velocity reviews`
  )
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>(existingEvidence?.status || "draft")
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit")
  const [saveStatus, setSaveStatus] = useState<"synced" | "saving" | "idle">("idle")
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const isAdmin = user?.role === "admin"
  const authorName = user?.fullName || user?.email?.split("@")[0] || "Learner"

  // Auto-save debounce effect
  useEffect(() => {
    if (!open) return

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)

    autoSaveTimerRef.current = setTimeout(() => {
      // Save locally
      const storageKey = `advantcore_evidence_${user?.id || "guest"}`
      try {
        const localList: EvidenceItem[] = JSON.parse(localStorage.getItem(storageKey) || "[]")
        const updatedItem: EvidenceItem = {
          id: existingEvidence?.id || `ev-${Date.now()}`,
          taskId: task.id,
          taskTitle: task.title,
          stageNumber: 1,
          title,
          content,
          version: existingEvidence?.version || 1,
          status: status as EvidenceItem["status"],
          updatedAt: new Date().toISOString(),
        }
        const idx = localList.findIndex(e => e.id === updatedItem.id || e.taskId === updatedItem.taskId)
        const updatedList = idx >= 0 ? localList.map((item, i) => i === idx ? updatedItem : item) : [...localList, updatedItem]
        localStorage.setItem(storageKey, JSON.stringify(updatedList))
      } catch {}

      setSaveStatus("synced")
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }, 1200)

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    }
  }, [content, title, open, task.id, task.title, user?.id, status, existingEvidence?.id, existingEvidence?.version])

  function insertFormatting(prefix: string, suffix = "") {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end) || "text"
    const replacement = `${prefix}${selected}${suffix}`

    const newContent = content.substring(0, start) + replacement + content.substring(end)
    setContent(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length)
    }, 50)
  }

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

  function handlePrintDeliverable() {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - Advantcore Academy Deliverable</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body {
              font-family: 'Inter', -apple-system, sans-serif;
              color: #0f172a;
              margin: 40px;
              line-height: 1.6;
              font-size: 13px;
            }
            .header {
              border-bottom: 2px solid #0f766e;
              padding-bottom: 16px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .logo {
              font-size: 18px;
              font-weight: 800;
              color: #0f766e;
              letter-spacing: -0.5px;
            }
            .sub {
              font-size: 11px;
              color: #64748b;
              margin-top: 2px;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 12px 16px;
              margin-bottom: 24px;
              font-size: 12px;
            }
            .meta-item strong {
              display: block;
              color: #475569;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            h1 { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 24px; }
            h2 { font-size: 15px; font-weight: 700; color: #0f766e; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 20px; }
            h3 { font-size: 13px; font-weight: 600; color: #1e293b; margin-top: 14px; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: 600; color: #334155; }
            .notice {
              border: 1px solid #cbd5e1;
              background: #f8fafc;
              border-radius: 6px;
              padding: 10px 14px;
              font-size: 11px;
              color: #64748b;
              margin-top: 30px;
            }
            .audit-stamp {
              margin-top: 30px;
              border: 1px dashed #0f766e;
              background: #f0fdfa;
              border-radius: 8px;
              padding: 12px 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
              color: #0f766e;
            }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">ADVANTCORE ACADEMY</div>
              <div class="sub">Executive Deliverable & Verified Case Study Portfolio</div>
            </div>
            <div style="text-align: right;">
              <span style="display: inline-block; padding: 4px 10px; background: #0f766e; color: white; border-radius: 4px; font-weight: 700; font-size: 11px;">
                ${status.toUpperCase()}
              </span>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <strong>Author</strong>
              ${authorName}
            </div>
            <div class="meta-item">
              <strong>Project Reference</strong>
              ADV-BA-001 (Enquiry-to-Delivery)
            </div>
            <div class="meta-item">
              <strong>Date & Version</strong>
              ${new Date().toISOString().split("T")[0]} · v${existingEvidence?.version || 1}.0
            </div>
          </div>

          <div>
            ${content
              .replace(/# (.*)/g, "<h1>$1</h1>")
              .replace(/## (.*)/g, "<h2>$1</h2>")
              .replace(/### (.*)/g, "<h3>$1</h3>")
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/- \[(x|X)\] (.*)/g, '<div style="color:#0f766e; margin: 4px 0;">✔ $2</div>')
              .replace(/- \[ \] (.*)/g, '<div style="color:#64748b; margin: 4px 0;">☐ $1</div>')
              .replace(/- (.*)/g, "<li>$1</li>")
              .replace(/\n/g, "<br />")}
          </div>

          <div class="audit-stamp">
            <div>
              <strong>Audit Sign-off & Quality Assurance</strong><br />
              Supervisor: Marcus Cole · Independent Reviewer: Helen Grant
            </div>
            <div style="font-weight: 700;">
              BCS Professional Quality Assured
            </div>
          </div>

          <div class="notice">
            <strong>Non-Employment Disclaimer:</strong> Assessed project deliverable compiled within the Advantcore Academy simulated client engagement, demonstrating professional competence in business analysis techniques.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={existingEvidence?.status === "approved" ? "outline" : "default"}>
          <FileText className="w-4 h-4 mr-1.5" />
          {existingEvidence ? (existingEvidence.status === "approved" ? "View evidence" : "Edit deliverable") : "Author deliverable"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Task {task.taskNumber} · Deliverable</Badge>
              {saveStatus === "synced" && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cloud synced {lastSavedTime ? `· ${lastSavedTime}` : ""}
                </span>
              )}
              {saveStatus === "saving" && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Saving...
                </span>
              )}
            </div>

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
          <DialogTitle className="text-base sm:text-lg">{task.title}</DialogTitle>
          <DialogDescription className="text-xs">
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
                onChange={e => {
                  setTitle(e.target.value)
                  setSaveStatus("saving")
                }}
                className="w-full mt-1 p-2.5 text-base sm:text-sm border rounded-lg bg-background font-medium"
              />
            </label>

            {/* Markdown Toolbar & View Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-muted/40 border rounded-t-lg text-xs">
              <div className="flex items-center gap-1 flex-wrap">
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs font-bold" onClick={() => insertFormatting("## ", "\n")}>
                  H2
                </Button>
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => insertFormatting("**", "**")}>
                  <Bold className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => insertFormatting("*", "*")}>
                  <Italic className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => insertFormatting("- ", "\n")}>
                  <List className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => insertFormatting("- [ ] ", "\n")}>
                  <CheckSquare className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-[11px]"
                  onClick={() =>
                    insertFormatting(
                      "\n| Item | Description | Owner | Status |\n|---|---|---|---|\n| 1.0 | Requirement statement | BA | Draft |\n"
                    )
                  }
                >
                  <TableIcon className="w-3.5 h-3.5 mr-1" /> Table
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-[11px]"
                  onClick={() =>
                    insertFormatting(
                      "\n```\n[Lead Inquiry] ──> (Qualification Filter) ──> [Delivery Mobilisation]\n```\n"
                    )
                  }
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Process Map
                </Button>
              </div>

              <div className="flex items-center gap-1 bg-background rounded-md p-0.5 border">
                <button
                  type="button"
                  onClick={() => setViewMode("edit")}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    viewMode === "edit" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={`hidden sm:inline-flex items-center px-2.5 py-1 text-xs rounded transition-colors ${
                    viewMode === "split" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Columns className="w-3.5 h-3.5 mr-1" /> Split
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    viewMode === "preview" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" /> Preview
                </button>
              </div>
            </div>

            {/* Editor Workspace (Edit / Split / Preview) */}
            <div className="border border-t-0 rounded-b-lg overflow-hidden bg-background">
              {viewMode === "edit" && (
                <textarea
                  ref={textareaRef}
                  rows={13}
                  value={content}
                  onChange={e => {
                    setContent(e.target.value)
                    setSaveStatus("saving")
                  }}
                  className="w-full p-3 text-base sm:text-xs font-mono bg-background leading-relaxed outline-none resize-y"
                  placeholder="Author deliverable findings against BCS business analysis standards..."
                />
              )}

              {viewMode === "preview" && (
                <div className="p-4 sm:p-5 min-h-[300px] max-h-[480px] overflow-y-auto bg-muted/10">
                  <RichMarkdownViewer content={content} />
                </div>
              )}

              {viewMode === "split" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border min-h-[320px]">
                  <textarea
                    ref={textareaRef}
                    rows={13}
                    value={content}
                    onChange={e => {
                      setContent(e.target.value)
                      setSaveStatus("saving")
                    }}
                    className="p-3 text-base sm:text-xs font-mono bg-background leading-relaxed outline-none resize-none"
                    placeholder="Author markdown content..."
                  />
                  <div className="p-4 max-h-[480px] overflow-y-auto bg-muted/10">
                    <RichMarkdownViewer content={content} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 pt-4 border-t border-border">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs" onClick={handlePrintDeliverable}>
              <Printer className="w-3.5 h-3.5 mr-1.5" /> Print / Export PDF
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {isAdmin ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive w-full sm:w-auto h-9"
                  onClick={() => handleReviewDecision("changes_requested")}
                >
                  <AlertCircle className="w-4 h-4 mr-1" /> Request changes
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto h-9 font-bold"
                  onClick={() => handleReviewDecision("approved")}
                >
                  <ShieldCheck className="w-4 h-4 mr-1" /> Approve deliverable
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" className="w-full sm:w-auto h-9" onClick={() => handleSave("saveDraft")}>
                  Save draft
                </Button>
                <Button
                  size="sm"
                  className="primary-action w-full sm:w-auto h-9 font-bold"
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
