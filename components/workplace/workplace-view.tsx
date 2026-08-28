"use client"

import React, { useState, useEffect } from "react"
import {
  Activity, Video, CalendarDays, Users, FileText, Check,
  Sparkles, MessageSquareText, ShieldAlert,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SectionTitle } from "@/components/shared/section-title"
import { ReadinessRing } from "@/components/shared/readiness-ring"
import { defaultTeam } from "@/components/dashboard/dashboard-view"
import { EvidenceEditorDialog } from "./evidence-editor-dialog"
import { PortfolioExportDialog } from "./portfolio-export-dialog"
import { advantcoreProjectStages, initialEvidenceItems } from "@/lib/workplace/project-data"
import type { EvidenceItem } from "@/lib/workplace/types"
import type { View } from "@/components/shared/types"

import { useAuth } from "@/lib/auth/auth-context"
import { syncLearnerProgressFromServer } from "@/lib/progress/progress-sync"

interface WorkplaceViewProps {
  onSelectView: (view: View) => void
}

export function WorkplaceView({ onSelectView }: WorkplaceViewProps) {
  const { user } = useAuth()
  const storageKey = `advantcore_evidence_${user?.id || "guest"}`

  const [activeStageId, setActiveStageId] = useState<string>("stage-01")
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(() => {
    if (typeof window === "undefined") return initialEvidenceItems
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : initialEvidenceItems
    } catch {
      return initialEvidenceItems
    }
  })

  useEffect(() => {
    if (user?.id || user?.email) {
      syncLearnerProgressFromServer(user?.id, user?.email)
    }

    function handleEvidenceUpdate() {
      if (typeof window === "undefined") return
      const keys = Array.from(new Set([user?.id, user?.email, "guest"].filter(Boolean))) as string[]
      const evidenceMap = new Map<string, EvidenceItem>()
      for (const k of keys) {
        try {
          const stored: EvidenceItem[] = JSON.parse(localStorage.getItem(`advantcore_evidence_${k}`) || "[]")
          for (const item of stored) {
            if (!evidenceMap.has(item.id || item.taskId)) {
              evidenceMap.set(item.id || item.taskId, item)
            }
          }
        } catch {}
      }
      if (evidenceMap.size > 0) {
        setEvidenceList(Array.from(evidenceMap.values()))
      }
    }

    handleEvidenceUpdate()
    window.addEventListener("advantcore_progress_updated", handleEvidenceUpdate)
    window.addEventListener("storage", handleEvidenceUpdate)
    return () => {
      window.removeEventListener("advantcore_progress_updated", handleEvidenceUpdate)
      window.removeEventListener("storage", handleEvidenceUpdate)
    }
  }, [user?.id, user?.email])

  const currentStage = advantcoreProjectStages.find(s => s.id === activeStageId) || advantcoreProjectStages[0]

  const totalTasks = advantcoreProjectStages.reduce((acc, s) => acc + s.tasks.length, 0)
  const approvedCount = evidenceList.filter(e => e.status === "approved").length
  const projectScore = totalTasks > 0 ? Math.round((approvedCount / totalTasks) * 100) : 0

  function handleEvidenceSaved(saved: EvidenceItem) {
    setEvidenceList(prev => {
      const idx = prev.findIndex(e => e.id === saved.id || e.taskId === saved.taskId)
      const updated = idx >= 0
        ? prev.map((item, i) => i === idx ? saved : item)
        : [...prev, saved]
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent("advantcore_progress_updated", { detail: { evidenceId: saved.id } }))
      } catch {
        // storage fallback
      }
      return updated
    })
  }

  return (
    <div className="page-stack">
      <SectionTitle
        eyebrow="Virtual workplace"
        title="Advantcore delivery workspace"
        copy="Complete genuine analysis deliverables, receive supervisor feedback, pass independent review gates, and compile an exportable portfolio."
        actions={
          <>
            <PortfolioExportDialog evidenceItems={evidenceList} />
            <Button className="primary-action" onClick={() => onSelectView("meetings")}>
              <Video className="w-4 h-4 mr-1.5" /> Project team room
            </Button>
          </>
        }
      />

      {/* Non-Employment Simulation Notice */}
      <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5 flex items-center justify-between text-xs">
        <span className="flex items-center gap-2 text-blue-600 font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          Supervised simulated project experience, not employment. Certified for career acceleration.
        </span>
        <Badge variant="outline" className="text-[11px]">ADV-BA-001</Badge>
      </div>

      <section className="project-hero">
        <div className="project-mark">
          <Activity />
        </div>
        <div className="project-info">
          <div className="project-tags">
            <Badge>Active project</Badge>
            <span>ADV-BA-001</span>
          </div>
          <h2>Enquiry-to-delivery process transformation</h2>
          <p>
            Investigate friction across lead qualification, project hand-off and delivery mobilisation, then recommend a controlled future-state process.
          </p>
          <div className="project-facts">
            <span><CalendarDays /> 12 Aug to 30 Oct</span>
            <span><Users /> 4 stakeholders</span>
            <span><FileText /> {evidenceList.length} evidence items</span>
          </div>
        </div>
        <div className="project-score">
          <ReadinessRing value={projectScore} label="Project" tone="navy" />
          <span>Stage {currentStage.stageNumber} of 5</span>
        </div>
      </section>

      {/* Interactive Delivery Track */}
      <section className="stage-panel panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Delivery pathway</p>
            <h2>Stage {currentStage.stageNumber} of 5 · {currentStage.title}</h2>
          </div>
          <span className="date-pill">
            {projectScore > 0 ? `${approvedCount} of ${totalTasks} deliverables verified` : "Pathway In Progress"}
          </span>
        </div>
        <div className="stage-track">
          {advantcoreProjectStages.map(s => (
            <button
              key={s.id}
              className={`stage-step ${s.id === activeStageId ? "ring-2 ring-primary font-bold" : ""} ${s.status}`}
              onClick={() => setActiveStageId(s.id)}
            >
              <span>{s.status === "done" ? <Check className="w-3.5 h-3.5" /> : s.stageNumber}</span>
              <strong>{s.title}</strong>
            </button>
          ))}
        </div>
      </section>

      {/* Stage Tasks & Evidence Locker */}
      <section className="work-grid">
        <article className="panel sprint-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Stage deliverables</p>
              <h2>{currentStage.title} Tasks</h2>
            </div>
            <Badge variant="outline">Stage {currentStage.stageNumber}</Badge>
          </div>

          <div className="space-y-3">
            {currentStage.tasks.map(t => {
              const matchedEvidence = evidenceList.find(e => e.taskId === t.id)
              return (
                <div key={t.id} className="p-4 border rounded-xl bg-card space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-primary">Task {t.taskNumber}</span>
                      <h3 className="font-bold text-sm leading-tight">{t.title}</h3>
                      <small className="text-muted-foreground block mt-0.5">
                        Deliverable: {t.deliverable} · {t.assignedStakeholder}
                      </small>
                    </div>
                    {matchedEvidence && (
                      <Badge
                        className={
                          matchedEvidence.status === "approved"
                            ? "bg-emerald-500 text-white"
                            : matchedEvidence.status === "in_review"
                            ? "bg-amber-500 text-white"
                            : "bg-muted"
                        }
                      >
                        {matchedEvidence.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">{t.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t text-xs">
                    <span className="text-muted-foreground">{t.acceptanceCriteria.length} acceptance criteria</span>
                    <EvidenceEditorDialog
                      task={t}
                      existingEvidence={matchedEvidence}
                      onEvidenceSaved={handleEvidenceSaved}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        {/* Evidence Locker */}
        <article className="panel evidence-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Portfolio evidence</p>
              <h2>Evidence locker ({evidenceList.length})</h2>
            </div>
            <PortfolioExportDialog evidenceItems={evidenceList} />
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto">
            {evidenceList.map(ev => (
              <div key={ev.id} className="p-3 border rounded-xl bg-card space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="font-semibold">{ev.title}</strong>
                  <Badge
                    variant="outline"
                    className={
                      ev.status === "approved"
                        ? "text-emerald-600 border-emerald-500/30"
                        : "text-amber-600 border-amber-500/30"
                    }
                  >
                    {ev.status.replace("_", " ")}
                  </Badge>
                </div>
                <small className="text-muted-foreground block">
                  v{ev.version}.0 · Updated {new Date(ev.updatedAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Stakeholder Team */}
      <section className="panel people-board">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Project organisation</p>
            <h2>Your Advantcore team</h2>
          </div>
          <span className="ai-label">
            <Sparkles /> Context-aware project stakeholders
          </span>
        </div>
        <div className="people-grid">
          {defaultTeam.map(p => (
            <article className="person-card" key={p.name}>
              <span className={`avatar large ${p.colour}`}>
                {p.initials}
                <i />
              </span>
              <div>
                <strong>{p.name}</strong>
                <span>{p.role}</span>
                <small>
                  {p.role === "BA Supervisor"
                    ? "Coaches, challenges and reviews deliverables"
                    : p.role === "Independent Reviewer"
                    ? "Assesses evidence against BCS criteria"
                    : "Provides project decisions and operational context"}
                </small>
              </div>
              <Button size="sm" variant="ghost" onClick={() => onSelectView("meetings")}>
                <MessageSquareText /> Talk
              </Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
