"use client"

import React, { useState, useMemo } from "react"
import {
  Clock3, CheckCircle2, Target, CalendarDays,
  Sparkles, ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionTitle } from "@/components/shared/section-title"
import { StatCard } from "@/components/shared/stat-card"
import { buildGoogleCalendarUrl } from "@/components/shared/calendar-utils"
import { buildEventGoogleCalendarUrl } from "@/lib/planner/google-calendar"
import { AdaptiveScheduleDialog } from "./adaptive-schedule-dialog"
import { full12WeekSchedule } from "@/lib/planner/schedule-data"
import { calculateAdaptiveSchedule } from "@/lib/planner/adaptive-scheduler"
import { useAuth } from "@/lib/auth/auth-context"
import { getLearnerRealProgress } from "@/lib/progress/learner-progress"

export function CalendarView() {
  const { user } = useAuth()
  const progress = useMemo(() => getLearnerRealProgress(user?.id), [user?.id])

  // Calculate current active week based on real learner progress
  const activeWeekNum = useMemo(() => {
    if (progress.overallScore >= 100) return 12
    const week = Math.floor(progress.overallScore / 8.5) + 1
    return Math.max(1, Math.min(12, week))
  }, [progress.overallScore])

  const [selectedWeekNum, setSelectedWeekNum] = useState(activeWeekNum)
  const [selectedMobileDay, setSelectedMobileDay] = useState<string>("Mon")
  const [isAccelerated, setIsAccelerated] = useState(false)

  const selectedWeek = full12WeekSchedule.find(w => w.weekNumber === selectedWeekNum) || full12WeekSchedule[0]
  const adaptivePlan = calculateAdaptiveSchedule(full12WeekSchedule, activeWeekNum, isAccelerated ? 14 : 12)

  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri"]

  return (
    <div className="page-stack">
      <SectionTitle
        eyebrow="Adaptive planner"
        title={`Week ${selectedWeek.weekNumber} · ${selectedWeek.title}`}
        copy="Self-paced 12-week curriculum and delivery calendar. Working ahead of pace dynamically compresses future milestones."
        actions={
          <>
            <Button variant="outline" asChild>
              <a
                href={buildGoogleCalendarUrl(
                  `[Advantcore Academy] Week ${selectedWeek.weekNumber}: ${selectedWeek.title}`,
                  `Study & Project Blocks for Week ${selectedWeek.weekNumber}\nModule: ${selectedWeek.moduleTitle}\nProject: ${selectedWeek.projectStageTitle}`,
                  72,
                  120
                )}
                target="_blank"
                rel="noreferrer"
              >
                <CalendarDays className="w-4 h-4 mr-1.5" /> Sync week to Google
              </a>
            </Button>
            <AdaptiveScheduleDialog onScheduleApplied={() => setIsAccelerated(true)} />
          </>
        }
      />

      <section className="calendar-summary">
        <StatCard
          icon={Clock3}
          value={`${selectedWeek.hoursEstimated}h`}
          label="Workload this week"
          detail={selectedWeek.moduleTitle}
          tone="mint"
        />
        <StatCard
          icon={CheckCircle2}
          value={isAccelerated ? "Accelerated" : "On track"}
          label="Pace status"
          detail={isAccelerated ? `Pace: 14h/wk (${adaptivePlan.acceleratedWeeks} wks)` : "Standard pace · 12 weeks"}
          tone="navy"
        />
        <StatCard
          icon={Target}
          value={isAccelerated ? adaptivePlan.estimatedCompletionDate.split(" ")[0] + " " + adaptivePlan.estimatedCompletionDate.split(" ")[1] : "12 Weeks"}
          label="Target completion"
          detail={isAccelerated ? `Graduation compressed by ${12 - adaptivePlan.acceleratedWeeks} weeks` : "Target: 12-week graduation"}
          tone="gold"
        />
      </section>

      {/* 12-Week Roadmap Track */}
      <section className="p-4 border rounded-xl bg-card space-y-3">
        <div className="flex items-center justify-between">
          <strong className="text-sm font-bold flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" /> 12-Week Pathway Roadmap
          </strong>
          <span className="text-xs text-muted-foreground">Click week to inspect</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-2 -webkit-overflow-scrolling-touch">
          {full12WeekSchedule.map(w => {
            const isDone = w.weekNumber < activeWeekNum
            const isActive = w.weekNumber === activeWeekNum
            return (
              <button
                key={w.weekNumber}
                onClick={() => setSelectedWeekNum(w.weekNumber)}
                className={`p-2.5 rounded-lg border text-left min-w-[120px] sm:min-w-[130px] shrink-0 transition-all ${
                  w.weekNumber === selectedWeekNum
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : isDone
                    ? "bg-muted/40 text-muted-foreground"
                    : "bg-card hover:bg-muted/20"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>W{w.weekNumber}</span>
                  <Badge variant={isDone ? "outline" : isActive ? "default" : "secondary"} className="text-[10px] px-1 py-0">
                    {isDone ? "Done" : isActive ? "Active" : "Planned"}
                  </Badge>
                </div>
                <strong className="text-xs block mt-1 line-clamp-1">{w.title}</strong>
                <small className="text-[11px] text-muted-foreground block">{w.hoursEstimated}h workload</small>
              </button>
            )
          })}
        </div>
      </section>

      {/* Mobile Day Selector Tabs */}
      <div className="sm:hidden grid grid-cols-5 gap-1 p-1 bg-muted/60 rounded-xl border">
        {daysList.map(dayName => {
          const hasEvents = selectedWeek.events.some(e => e.day === dayName)
          const isSelected = selectedMobileDay === dayName
          return (
            <button
              key={dayName}
              type="button"
              onClick={() => setSelectedMobileDay(dayName)}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                isSelected
                  ? "bg-background text-foreground shadow-xs ring-1 ring-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{dayName}</span>
              {hasEvents && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          )
        })}
      </div>

      {/* Week Day Board */}
      <section className="week-board">
        {daysList.map(dayName => {
          const dayEvents = selectedWeek.events.filter(e => e.day === dayName)
          const isCurrentActiveDay = dayName === "Mon" && selectedWeekNum === activeWeekNum
          const isHiddenOnMobile = selectedMobileDay !== dayName

          return (
            <div
              className={`day-column ${isCurrentActiveDay ? "today" : ""} ${
                isHiddenOnMobile ? "hidden sm:block" : "block"
              }`}
              key={dayName}
            >
              <div className="day-head">
                <span>{dayName}</span>
                <strong>{isCurrentActiveDay ? "Active" : "Schedule"}</strong>
              </div>

              {dayEvents.length === 0 ? (
                <div className="p-3 text-center text-xs text-muted-foreground italic">
                  Self-paced study & project work
                </div>
              ) : (
                dayEvents.map(ev => (
                  <div key={ev.id} className="p-3 rounded-lg border bg-card space-y-1.5 text-xs mb-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={
                          ev.type === "review_gate"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]"
                            : ev.type === "mock_exam"
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/30 text-[10px]"
                            : "text-[10px]"
                        }
                      >
                        {ev.type.replace("_", " ").toUpperCase()}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-mono">{ev.time}</span>
                    </div>

                    <strong className="font-semibold block leading-tight text-foreground">{ev.title}</strong>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">{ev.detail}</p>

                    <div className="flex items-center justify-between pt-1 border-t text-[11px]">
                      <span className="text-muted-foreground">{ev.durationMinutes} min</span>
                      <a
                        href={buildEventGoogleCalendarUrl(ev)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-0.5"
                      >
                        GCal <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )
        })}
      </section>

      <section className="panel realign-note flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-sm">Adaptive scheduling & pace governance</strong>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Complete modules early and the adaptive planner automatically recalculates future study milestones while strictly preserving fixed independent assessment review gates.
            </p>
          </div>
        </div>
        <AdaptiveScheduleDialog onScheduleApplied={() => setIsAccelerated(true)} />
      </section>
    </div>
  )
}
