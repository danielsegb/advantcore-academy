"use client"

import React from "react"
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
import { calculateReadiness } from "@/lib/readiness/readiness-calculator"
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
  const readiness = calculateReadiness()

  const tasks = [
    ["Complete stakeholder power-interest grid", "Workplace · Due today", "35 min", "workplace" as View],
    ["Finish lesson 3.4: Stakeholder management", "Learning · Due today", "25 min", "learning" as View],
    ["Prepare discovery questions for Priya", "Meeting prep · Tomorrow", "20 min", "meetings" as View],
  ] as const

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

          <h1>Good morning, {firstName}.</h1>
          <p>
            You are making strong progress across both BCS syllabus mastery and Advantcore workplace delivery.
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
          <ReadinessRing value={readiness.overallScore} label="Overall" tone="mint" />
          <div className="hero-meta">
            <span>Overall pathway readiness</span>
            <strong>{readiness.overallScore}% Ready</strong>
            <small>12 days ahead of original schedule</small>
          </div>
        </div>
      </section>

      {/* Multi-Dimensional Readiness Metric Cards */}
      <section className="stat-grid">
        <StatCard icon={GraduationCap} value={`${readiness.knowledgeMastery.score}%`} label="Knowledge mastery" detail={readiness.knowledgeMastery.detail} tone="mint" />
        <StatCard icon={Gauge} value={`${readiness.mockExamScore.score}%`} label="Exam readiness" detail={readiness.mockExamScore.detail} tone="gold" />
        <StatCard icon={BriefcaseBusiness} value={`${readiness.workplaceEvidence.score}%`} label="Workplace evidence" detail={readiness.workplaceEvidence.detail} tone="navy" />
        <StatCard icon={ClipboardCheck} value={`${readiness.interviewReadiness.score}%`} label="Interview readiness" detail={readiness.interviewReadiness.detail} tone="coral" />
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
            {tasks.map((task, i) => (
              <button className="task-row" key={task[0]} onClick={() => onSelectView(task[3])}>
                <span className={`task-kind k${i}`}>
                  {i === 1 ? <BookOpen /> : i === 0 ? <BriefcaseBusiness /> : <Video />}
                </span>
                <span className="task-main">
                  <strong>{task[0]}</strong>
                  <small>{task[1]}</small>
                </span>
                <span className="task-time">
                  <Clock3 /> {task[2]}
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
          <p className="eyebrow">Tomorrow · 10:00</p>
          <h2>Stakeholder discovery interview</h2>
          <p>Interview the Operations Lead, clarify pain points, and test your assumptions.</p>
          <div className="mini-people">
            <span className="avatar violet">PS</span>
            <span className="avatar blue">MC</span>
            <span className="meeting-duration">45 min</span>
          </div>
          <div className="meeting-actions">
            <Button className="primary-action" onClick={() => onSelectView("meetings")}>
              <Video /> Enter room
            </Button>
            <Button variant="outline" asChild>
              <a
                href={buildGoogleCalendarUrl("Stakeholder discovery interview", "Advantcore Academy simulated stakeholder interview")}
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
            <ReadinessRing value={readiness.knowledgeMastery.score} label="Knowledge" tone="mint" />
            <ReadinessRing value={readiness.mockExamScore.score} label="Exam" tone="gold" />
            <ReadinessRing value={readiness.workplaceEvidence.score} label="Evidence" tone="navy" />
            <div className="trajectory-note">
              <Sparkles />
              <div>
                <strong>Reconciled Pathway Evidence</strong>
                <span>Calculated from 5 passed BCS module quizzes, 40-question mock exam score, and 4 approved workplace deliverables.</span>
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
