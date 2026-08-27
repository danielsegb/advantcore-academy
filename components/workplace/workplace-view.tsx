"use client"

import React from "react"
import {
  Activity, Video, CalendarDays, Users, FileText, Check,
  CircleDot, UploadCloud, MoreHorizontal, Sparkles, MessageSquareText,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SectionTitle } from "@/components/shared/section-title"
import { ReadinessRing } from "@/components/shared/readiness-ring"
import { defaultTeam } from "@/components/dashboard/dashboard-view"
import { WorkTask } from "./work-task"
import type { View } from "@/components/shared/types"

interface WorkplaceViewProps {
  onSelectView: (view: View) => void
}

export function WorkplaceView({ onSelectView }: WorkplaceViewProps) {
  const evidenceItems = [
    ["Project charter", "Approved · 12 Aug"],
    ["Stakeholder register", "Draft · Today"],
    ["Discovery plan", "Reviewed · 24 Aug"],
    ["Meeting minutes", "2 files · 24 Aug"],
  ] as const

  const deliveryStages = [
    ["1", "Initiate", "done"],
    ["2", "Discover", "active"],
    ["3", "Analyse", ""],
    ["4", "Design", ""],
    ["5", "Validate", ""],
  ] as const

  return (
    <div className="page-stack">
      <SectionTitle
        eyebrow="Virtual workplace"
        title="Advantcore delivery workspace"
        copy="Complete genuine analysis activities, receive stakeholder feedback and build an employer-ready portfolio."
        actions={
          <>
            <Select defaultValue="enquiry">
              <SelectTrigger className="project-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enquiry">Enquiry-to-delivery transformation</SelectItem>
                <SelectItem value="client" disabled>
                  Client portal discovery · Locked
                </SelectItem>
              </SelectContent>
            </Select>
            <Button className="primary-action" onClick={() => onSelectView("meetings")}>
              <Video /> Join project room
            </Button>
          </>
        }
      />

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
            <span><FileText /> 8 evidence items</span>
          </div>
        </div>
        <div className="project-score">
          <ReadinessRing value={58} label="Project" tone="navy" />
          <span>Discovery stage</span>
        </div>
      </section>

      <section className="stage-panel panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Delivery pathway</p>
            <h2>Stage 2 of 5 · Discovery</h2>
          </div>
          <span className="date-pill">12 days ahead</span>
        </div>
        <div className="stage-track">
          {deliveryStages.map(s => (
            <div className={`stage-step ${s[2]}`} key={s[0]}>
              <span>{s[2] === "done" ? <Check /> : s[0]}</span>
              <strong>{s[1]}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="work-grid">
        <article className="panel sprint-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Current sprint</p>
              <h2>Understand people and process</h2>
            </div>
            <Badge variant="outline">Week 5</Badge>
          </div>
          <div className="work-task-list">
            <WorkTask
              icon={<Check />}
              title="Review current enquiry artefacts"
              copy="Evidence approved by BA Supervisor"
              action="Complete"
              state="done"
            />
            <WorkTask
              icon={<CircleDot />}
              title="Map and analyse stakeholders"
              copy="Power-interest grid · Due today"
              action="In progress"
              state="active"
            />
            <WorkTask
              icon="3"
              title="Run operations discovery interview"
              copy="Priya Shah · Tomorrow at 10:00"
              action="Prepare"
              onClick={() => onSelectView("meetings")}
            />
            <WorkTask
              icon="4"
              title="Produce as-is process model"
              copy="Unlocks after discovery interview"
              action="Next"
            />
          </div>
        </article>

        <article className="panel evidence-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Portfolio evidence</p>
              <h2>Evidence locker</h2>
            </div>
            <Button size="sm" variant="outline">
              <UploadCloud /> Upload
            </Button>
          </div>
          {evidenceItems.map(r => (
            <button className="evidence-row" key={r[0]}>
              <span className="file-icon"><FileText /></span>
              <span><strong>{r[0]}</strong><small>{r[1]}</small></span>
              <MoreHorizontal />
            </button>
          ))}
          <button className="text-link">
            View all evidence <ArrowRight />
          </button>
        </article>
      </section>

      <section className="panel people-board">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Project organisation</p>
            <h2>Your Advantcore team</h2>
          </div>
          <span className="ai-label">
            <Sparkles /> Context-aware AI characters
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
                    ? "Coaches, challenges and signs off"
                    : p.role === "Independent Reviewer"
                    ? "Assesses evidence independently"
                    : "Provides project-specific decisions"}
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
