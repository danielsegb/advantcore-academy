"use client"

import React from "react"
import {
  Clock3, CheckCircle2, Target, Plus, RefreshCw, CalendarDays, Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionTitle } from "@/components/shared/section-title"
import { StatCard } from "@/components/shared/stat-card"
import { buildGoogleCalendarUrl } from "@/components/shared/calendar-utils"
import { PlanCard } from "./plan-card"

export function CalendarView() {
  const days = ["Monday 31", "Tuesday 1", "Wednesday 2", "Thursday 3", "Friday 4"]

  return (
    <div className="page-stack">
      <SectionTitle
        eyebrow="Adaptive plan"
        title="Week 6 · Requirements discovery"
        copy="Finish early, reschedule safely and let Academy realign the remaining pathway without losing your target."
        actions={
          <>
            <Button variant="outline" asChild>
              <a
                href={buildGoogleCalendarUrl("Advantcore Academy weekly plan", "Learning and virtual workplace plan", 72, 120)}
                target="_blank"
                rel="noreferrer"
              >
                <CalendarDays /> Add week to Google
              </a>
            </Button>
            <Button className="primary-action">
              <RefreshCw /> Realign plan
            </Button>
          </>
        }
      />

      <section className="calendar-summary">
        <StatCard icon={Clock3} value="8h 20m" label="Planned this week" detail="Across work and learning" tone="mint" />
        <StatCard icon={CheckCircle2} value="3/11" label="Activities complete" detail="12 days ahead" tone="navy" />
        <StatCard icon={Target} value="30 Oct" label="Forecast finish" detail="Original date: 13 Nov" tone="gold" />
      </section>

      <section className="week-board">
        {days.map((day, i) => (
          <div className={`day-column ${i === 3 ? "today" : ""}`} key={day}>
            <div className="day-head">
              <span>{day.split(" ")[0]}</span>
              <strong>{day.split(" ")[1]}</strong>
              {i === 3 && <small>Today</small>}
            </div>

            {i === 0 && (
              <>
                <PlanCard type="learn" time="09:30 · 40 min" title="Requirements foundations" label="Learning" />
                <PlanCard type="work" time="14:00 · 60 min" title="Interview planning" label="Workplace" />
              </>
            )}

            {i === 1 && (
              <PlanCard type="meeting" time="10:00 · 45 min" title="Operations interview" label="AI meeting" />
            )}

            {i === 2 && (
              <>
                <PlanCard type="work" time="09:30 · 90 min" title="As-is process model" label="Workplace" />
                <PlanCard type="learn" time="16:00 · 25 min" title="Quiz · Modelling" label="Learning" />
              </>
            )}

            {i === 3 && (
              <>
                <PlanCard type="current" time="11:30 · 35 min" title="Stakeholder grid" label="Due today" />
                <button className="add-plan" aria-label="Add activity">
                  <Plus /> Add activity
                </button>
              </>
            )}

            {i === 4 && (
              <PlanCard type="review" time="15:00 · 45 min" title="Supervisor review" label="Evidence gate" />
            )}
          </div>
        ))}
      </section>

      <section className="panel realign-note">
        <Sparkles />
        <div>
          <strong>How adaptive scheduling works</strong>
          <p>
            Complete an activity early or move a deadline, and Academy proposes the smallest safe adjustment to dependent learning, meetings and project tasks. You approve every change.
          </p>
        </div>
        <Button variant="outline">View dependencies</Button>
      </section>
    </div>
  )
}
