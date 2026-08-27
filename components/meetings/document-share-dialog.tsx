"use client"

import React, { useState } from "react"
import { FileText, Check, Share2, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { EvidenceItem } from "@/lib/workplace/types"
import { useAuth } from "@/lib/auth/auth-context"

export interface SharedDocumentData {
  title: string
  deliverable?: string
  author: string
  version: string
  status?: string
  content: string
}

const standardProjectTemplates: SharedDocumentData[] = [
  {
    title: "Executive Problem Statement",
    deliverable: "Executive Problem Statement (ADV-BA-001)",
    author: "Business Analyst",
    version: "v1.0",
    status: "Draft",
    content: `# Executive Problem Statement: Advantcore Enquiry Intake Friction
**Project Code:** ADV-BA-001  
**Author:** Business Analyst  
**Focus:** Client Lead Qualification & Delivery Mobilisation

## 1. Background & Context
Advantcore Ltd inbound client enquiries have expanded significantly, causing severe operational bottlenecks in the qualification and onboarding lifecycle.

## 2. Core Problem Statements
1. **Unstructured Inbound Channels:** Enquiries arrive via disparate email inboxes and web forms without standardized qualification data.
2. **Spreadsheet Hand-Off Delays:** Inbound leads are manually copied into disconnected spreadsheets, causing an average lead response lag of 4.8 business days [ADV-SOP-002].
3. **Delivery Misalignment:** Crucial scoping details collected during initial calls are omitted during hand-off to delivery teams.

## 3. Measurable Target
- Reduce delivery mobilization cycle time from 14 business days down to 4 business days [ADV-DOC-001].`,
  },
  {
    title: "Advantcore Project Charter",
    deliverable: "Formal Scope & Charter (ADV-DOC-001)",
    author: "Business Analyst",
    version: "v1.0",
    status: "Draft",
    content: `# Advantcore Enquiry-to-Delivery Project Charter
**Document Ref:** ADV-DOC-001  
**Project Sponsor:** Sarah Mitchell  

## 1. Project Objectives
- Standardise enquiry qualification into a single verifiable intake channel.
- Automate notification triggers and handover checklists between sales and mobilization.
- Establish measurable operational KPIs for cycle times.

## 2. In-Scope vs Out-of-Scope Boundaries
- **In-Scope:** Enquiry receipt, sales qualification, discovery synthesis, project handover.
- **Out-of-Scope:** Full ERP replacement, proprietary billing engine development, legal contract authoring.`,
  },
  {
    title: "Stakeholder RACI & Power-Interest Grid",
    deliverable: "Stakeholder Engagement Plan",
    author: "Business Analyst",
    version: "v1.0",
    status: "Draft",
    content: `# Stakeholder Power-Interest Matrix & RACI Governance
**Project Code:** ADV-BA-001  

## 1. Power-Interest Positions
- **Sarah Mitchell (Project Sponsor):** High Power / High Interest -> Manage Closely.
- **Marcus Cole (BA Supervisor):** High Power / High Interest -> Manage Closely.
- **Priya Shah (Operations Lead):** High Power / High Interest -> Manage Closely.
- **Helen Grant (Independent Reviewer):** High Power / Low Interest -> Keep Satisfied.

## 2. RACI Decision Rights
- **Problem Statement:** BA (Responsible), Sarah Mitchell (Accountable), Marcus Cole (Consulted).
- **Process Swimlanes:** BA (Responsible), Priya Shah (Accountable), Delivery Lead (Consulted).
- **Requirements Catalogue:** BA (Responsible), Marcus Cole (Accountable), All (Consulted).`,
  },
  {
    title: "As-Is Enquiry Intake Swimlane Process Map",
    deliverable: "As-Is Process Map & Friction Report",
    author: "Business Analyst",
    version: "v1.0",
    status: "Draft",
    content: `# As-Is Enquiry-to-Delivery Process Swimlane Map
**Standard Operating Procedure Ref:** ADV-SOP-002  

## 1. Current State Flow
1. **Intake:** Unstructured client enquiry received in info@advantcore inbox (Wait time: ~1.5 days).
2. **Sales Review:** Sales consultant manually re-types lead into 'Leads_2026.xlsx' spreadsheet (Wait time: ~3.3 days).
3. **Qualification:** Phone call made to prospect, notes kept in personal notepad.
4. **Delivery Hand-off:** Project manager emailed with partial details; delivery team missing technical requirements.

## 2. Key Pain Points & Failure Demand
- Manual spreadsheet re-entry across 3 separate teams.
- Average 14 business days from initial contact to delivery mobilization.`,
  },
]

interface DocumentShareDialogProps {
  currentSharedDoc: SharedDocumentData | null
  onShareDocument: (doc: SharedDocumentData) => void
  onUnshareDocument: () => void
}

export function DocumentShareDialog({
  currentSharedDoc,
  onShareDocument,
  onUnshareDocument,
}: DocumentShareDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"authored" | "templates" | "custom">("authored")

  // Custom doc state
  const [customTitle, setCustomTitle] = useState("")
  const [customContent, setCustomContent] = useState("")

  // Load user authored evidence from localStorage
  const userEvidence: EvidenceItem[] = (() => {
    if (typeof window === "undefined") return []
    try {
      const saved = localStorage.getItem(`advantcore_evidence_${user?.id || "guest"}`)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })()

  function handleSelectAuthored(ev: EvidenceItem) {
    onShareDocument({
      title: ev.title,
      deliverable: ev.taskTitle,
      author: user?.fullName || "Business Analyst",
      version: `v${ev.version || 1}.0`,
      status: ev.status,
      content: ev.content,
    })
    setOpen(false)
  }

  function handleSelectTemplate(tpl: SharedDocumentData) {
    onShareDocument({
      ...tpl,
      author: user?.fullName || "Business Analyst",
    })
    setOpen(false)
  }

  function handleShareCustom() {
    if (!customTitle.trim() || !customContent.trim()) return
    onShareDocument({
      title: customTitle.trim(),
      deliverable: "Custom Meeting Document",
      author: user?.fullName || "Business Analyst",
      version: "v1.0",
      status: "Custom",
      content: customContent.trim(),
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={currentSharedDoc ? "default" : "outline"}
          className={`gap-1.5 text-xs ${currentSharedDoc ? "bg-emerald-700 hover:bg-emerald-800 text-white" : ""}`}
        >
          <Share2 className="w-3.5 h-3.5" />
          {currentSharedDoc ? "Change Shared Document" : "Share Document in Meeting"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Present Document to Stakeholders
          </DialogTitle>
          <DialogDescription>
            Select a deliverable from your workspace or choose a project template. The meeting attendees will review and reference the presented document live.
          </DialogDescription>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex gap-2 border-b pb-2 text-xs">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${activeTab === "authored" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
            onClick={() => setActiveTab("authored")}
          >
            My Workspace Documents ({userEvidence.length})
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${activeTab === "templates" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
            onClick={() => setActiveTab("templates")}
          >
            Project Deliverable Templates ({standardProjectTemplates.length})
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${activeTab === "custom" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
            onClick={() => setActiveTab("custom")}
          >
            Upload / Write Document
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {/* Tab 1: User Authored Documents */}
          {activeTab === "authored" && (
            <>
              {userEvidence.length === 0 ? (
                <div className="text-center py-8 border rounded-xl bg-muted/20 space-y-2">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-semibold">No workspace documents prepared yet</p>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    You have not drafted any deliverables in the Virtual Workplace yet. You can pick one of the standard project templates below to present right away.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setActiveTab("templates")}>
                    Browse Project Templates
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2">
                  {userEvidence.map(ev => (
                    <div
                      key={ev.id}
                      className="p-3 border rounded-xl hover:border-primary/50 transition-all flex items-center justify-between cursor-pointer bg-card"
                      onClick={() => handleSelectAuthored(ev)}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{ev.title}</h4>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {ev.status.replace("_", " ")}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">v{ev.version || 1}.0</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{ev.taskTitle}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="gap-1 text-xs">
                        <Share2 className="w-3.5 h-3.5" /> Present
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Tab 2: Standard Project Templates */}
          {activeTab === "templates" && (
            <div className="grid gap-2.5">
              {standardProjectTemplates.map((tpl, i) => (
                <div
                  key={i}
                  className="p-3.5 border rounded-xl hover:border-primary/50 transition-all flex items-start justify-between cursor-pointer bg-card"
                  onClick={() => handleSelectTemplate(tpl)}
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{tpl.title}</h4>
                      <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                        {tpl.version}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{tpl.deliverable}</p>
                    <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-1">
                      {tpl.content.split("\n\n")[1]?.replace(/^##\s+/, "") || ""}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 gap-1 text-xs">
                    <Check className="w-3.5 h-3.5" /> Present This
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Custom Document */}
          {activeTab === "custom" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. As-Is Process Findings or Project Charter..."
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Document Content (Markdown or plain text)</label>
                <textarea
                  rows={8}
                  placeholder="# Enter document headings and notes to share with Sarah, Marcus and Priya..."
                  value={customContent}
                  onChange={e => setCustomContent(e.target.value)}
                  className="w-full p-3 text-xs rounded-lg border bg-background font-mono"
                />
              </div>
              <Button
                size="sm"
                className="w-full gap-1.5"
                disabled={!customTitle.trim() || !customContent.trim()}
                onClick={handleShareCustom}
              >
                <Upload className="w-3.5 h-3.5" /> Present Custom Document
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between border-t pt-3">
          {currentSharedDoc ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onUnshareDocument()
                setOpen(false)
              }}
            >
              Stop Presenting Document
            </Button>
          ) : (
            <div />
          )}
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
