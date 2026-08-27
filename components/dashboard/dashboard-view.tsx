"use client"

import React, { useMemo } from "react"
import {
  CircleDot, Play, BriefcaseBusiness, Sparkles, GraduationCap,
  Gauge, ClipboardCheck, Clock3, ChevronRight, ArrowRight,
  Radio, Video, CalendarDays, MoreHorizontal, BookOpen,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ReadinessRing } from "@/components/shared/readiness-ring"
import { StatCard } from "@/components/shared/stat-card"
import { buildGoogleCalendarUrl } from "@/components/shared/calendar-utils"
import { NotificationCenter } from "./notification-center"
import { CareerAcceleratorDialog } from "./career-accelerator-dialog"
import { getLearnerRealProgress } from "@/lib/progress/learner-progress"
import { useAuth } from "@/lib/auth/auth-context"
import type { View, PathwayStaff } from "@/components/shared/types"

export const defaultTeam: PathwayStaff[] = [
  { name: "Sarah Mitchell", role: "Project Sponsor", initials: "SM", colour: "coral" },
  { name: "Marcus Cole", role: "BA Supervisor", initials: "MC", colour: "blue" },
  { name: "Priya Shah", role: "Operations Lead", initials: "PS", colour: "violet" },
  { name: "Helen Grant", role: "Independent Reviewer", initials: "HG", colour: "gold" },
]

interface DashboardViewProps {
  onSelectView: (view: View) => void
  onOpenTour: () => void
}

export function DashboardView({ onSelectView, onOpenTour }: DashboardViewProps) {
  const { user } = useAuth()
  const progress = useMemo(() => getLearnerRealProgress(user?.id), [user?.id])

  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "Amanda"

  return (
    <div className="page-stack">
      <section className="welcome-panel">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="status-badge">
              <CircleDot /> On track
            </Badge>
            <NotificationCenter onNavigate={onSelectView} />
          </div>

          <h1>Welcome, {firstName}.</h1>
          <p>
            {progress.overallScore > 0
              ? "You are actively advancing your certification curriculum and workplace project delivery."
              : "Your Academy workspace is ready. Start with Lesson 1.1 and your Executive Problem Statement to begin your pathway."}
          </p>

          <div className="welcome-actions flex-wrap gap-2">
            <Button className="primary-action" onClick={() => onSelectView("learning")}>
              <Play className="w-4 h-4 mr-1.5" /> Continue learning
            </Button>
            <Button variant="outline" onClick={() => onSelectView("workplace")}>
              <BriefcaseBusiness className="w-4 h-4 mr-1.5" /> Resume work
            </Button>
            <CareerAcceleratorDialog />
            <Button variant="ghost" onClick={onOpenTour}>
              <Sparkles className="w-4 h-4 mr-1.5" /> Guided tour
            </Button>
          </div>
        </div>

        <div className="hero-progress">
          <ReadinessRing value={progress.overallScore} label="Overall" tone="mint" />
          <div className="hero-meta">
            <span>Overall pathway readiness</span>
            <strong>{progress.overallScore}% Ready</strong>
            <small>{progress.overallScore > 0 ? `${progress.overallScore}% of pathway milestones achieved` : "Begin Module 1 to start tracking your progress"}</small>
          </div>
        </div>
      </section>

      {/* Multi-Dimensional Readiness Metric Cards */}
      <section className="stat-grid">
        <StatCard icon={GraduationCap} value={`${progress.knowledgeMastery.score}%`} label="Knowledge mastery" detail={progress.knowledgeMastery.detail} tone="mint" />
        <StatCard icon={Gauge} value={`${progress.examReadiness.score}%`} label="Exam readiness" detail={progress.examReadiness.detail} tone="gold" />
        <StatCard icon={BriefcaseBusiness} value={`${progress.workplaceEvidence.score}%`} label="Workplace evidence" detail={progress.workplaceEvidence.detail} tone="navy" />
        <StatCard icon={ClipboardCheck} value={`${progress.interviewReadiness.score}%`} label="Interview readiness" detail={progress.interviewReadiness.detail} tone="coral" />
      </section>

      <section className="dashboard-grid">
        <article className="panel today-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Your priorities</p>
              <h2>Today&apos;s focus</h2>
            </div>
            <span className="date-pill">Today</span>
          </div>
          <div className="task-list">
            {progress.priorities.map((item, i) => (
              <button className="task-row" key={`${item.title}-${i}`} onClick={() => onSelectView(item.view)}>
                <span className={`task-kind k${i}`}>
                  {item.view === "learning" ? <BookOpen /> : item.view === "workplace" ? <BriefcaseBusiness /> : <Video />}
                </span>
                <span className="task-main">
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
                <span className="task-time">
                  <Clock3 /> {item.duration}
                </span>
                <ChevronRight />
              </button>
            ))}
          </div>
          <button className="text-link" onClick={() => onSelectView("calendar")}>
            View complete plan <ArrowRight />
          </button>
        </article>

        <article className="panel next-meeting">
          <div className="meeting-kicker">
            <Radio /> Next live simulation
          </div>
          <p className="eyebrow">Discovery Stage</p>
          <h2>Project scoping meeting</h2>
          <p>Clarify boundaries, present your draft deliverable to Sarah & Marcus, and test project assumptions.</p>
          <div className="mini-people">
            <span className="avatar coral">SM</span>
            <span className="avatar blue">MC</span>
            <span className="meeting-duration">30 min</span>
          </div>
          <div className="meeting-actions">
            <Button className="primary-action" onClick={() => onSelectView("meetings")}>
              <Video /> Enter room
            </Button>
            <Button variant="outline" asChild>
              <a
                href={buildGoogleCalendarUrl("Project scoping meeting", "Advantcore Academy simulated stakeholder interview")}
                target="_blank"
                rel="noreferrer"
              >
                <CalendarDays /> Add to Google
              </a>
            </Button>
          </div>
        </article>
      </section>

      <section className="dashboard-grid lower">
        <article className="panel trajectory">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Transparent readiness factors</p>
              <h2>Readiness breakdown</h2>
            </div>
            <Badge variant="outline">Grounded metrics</Badge>
          </div>
          <div className="trajectory-content">
            <ReadinessRing value={progress.knowledgeMastery.score} label="Knowledge" tone="mint" />
            <ReadinessRing value={progress.examReadiness.score} label="Exam" tone="gold" />
            <ReadinessRing value={progress.workplaceEvidence.score} label="Evidence" tone="navy" />
            <div className="trajectory-note">
              <Sparkles />
              <div>
                <strong>Reconciled Pathway Evidence</strong>
                <span>
                  {progress.overallScore > 0
                    ? `Calculated from ${progress.knowledgeMastery.completedCount} passed lesson quizzes, ${progress.workplaceEvidence.approvedCount} approved workplace deliverables, and ${progress.examReadiness.score}% mock exam score.`
                    : "Complete lesson quizzes, mock exams, and workplace deliverables to build your verified readiness score."}
                </span>
              </div>
            </div>
          </div>
        </article>

        <article className="panel team-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Advantcore project</p>
              <h2>Your virtual team</h2>
            </div>
            <MoreHorizontal />
          </div>
          <div className="team-list">
            {defaultTeam.map(person => (
              <div className="person-row" key={person.name}>
                <span className={`avatar ${person.colour}`}>{person.initials}</span>
                <span>
                  <strong>{person.name}</strong>
                  <small>{person.role}</small>
                </span>
                <span className="online-dot" />
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
