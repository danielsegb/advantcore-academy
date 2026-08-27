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
  const tasks = [
    ["Complete stakeholder power-interest grid", "Workplace · Due today", "35 min", "workplace" as View],
    ["Finish lesson 3.4: Stakeholder management", "Learning · Due today", "25 min", "learning" as View],
    ["Prepare discovery questions for Priya", "Meeting prep · Tomorrow", "20 min", "meetings" as View],
  ] as const

  return (
    <div className="page-stack">
      <section className="welcome-panel">
        <div>
          <Badge className="status-badge">
            <CircleDot /> On track
          </Badge>
          <h1>Good morning, Daniel.</h1>
          <p>
            You are making strong progress. Complete today&apos;s two priority activities to keep your 12-week plan ahead of schedule.
          </p>
          <div className="welcome-actions">
            <Button className="primary-action" onClick={() => onSelectView("learning")}>
              <Play /> Continue learning
            </Button>
            <Button variant="outline" onClick={() => onSelectView("workplace")}>
              <BriefcaseBusiness /> Resume work
            </Button>
            <Button variant="ghost" onClick={onOpenTour}>
              <Sparkles /> Guided tour
            </Button>
          </div>
        </div>
        <div className="hero-progress">
          <ReadinessRing value={68} label="Overall" tone="mint" />
          <div className="hero-meta">
            <span>Estimated readiness</span>
            <strong>4 weeks, 3 days</strong>
            <small>12 days ahead of the original plan</small>
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <StatCard icon={GraduationCap} value="67%" label="Course progress" detail="3 of 6 modules active" tone="mint" />
        <StatCard icon={BriefcaseBusiness} value="58%" label="Work experience" detail="Discovery stage" tone="navy" />
        <StatCard icon={Gauge} value="74%" label="Exam readiness" detail="Up 6% this week" tone="gold" />
        <StatCard icon={ClipboardCheck} value="8" label="Evidence items" detail="2 awaiting review" tone="coral" />
      </section>

      <section className="dashboard-grid">
        <article className="panel today-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Your priorities</p>
              <h2>Today&apos;s focus</h2>
            </div>
            <span className="date-pill">Thu, 27 Aug</span>
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
          <p>Interview the Operations Lead, clarify pain points and test your assumptions.</p>
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
              <p className="eyebrow">Adaptive pathway</p>
              <h2>Your readiness trajectory</h2>
            </div>
            <Badge variant="outline">Updated today</Badge>
          </div>
          <div className="trajectory-content">
            <ReadinessRing value={74} label="Exam" tone="mint" />
            <ReadinessRing value={61} label="Career" tone="navy" />
            <ReadinessRing value={82} label="Consistency" tone="gold" />
            <div className="trajectory-note">
              <Sparkles />
              <div>
                <strong>Academy insight</strong>
                <span>Your stakeholder analysis is stronger than your requirements modelling. Week 6 includes one extra practice activity.</span>
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
