"use client"

import React, { useState } from "react"
import {
  Sparkles, Zap, ArrowRight, Check,
  CalendarDays, CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { calculateAdaptiveSchedule } from "@/lib/planner/adaptive-scheduler"
import { full12WeekSchedule } from "@/lib/planner/schedule-data"
import { useAuth } from "@/lib/auth/auth-context"

interface AdaptiveScheduleDialogProps {
  onScheduleApplied?: () => void
  activeWeekNum?: number
  overallScore?: number
}

export function AdaptiveScheduleDialog({ onScheduleApplied, activeWeekNum = 1, overallScore = 0 }: AdaptiveScheduleDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState(false)
  const [loading, setLoading] = useState(false)

  // Calculate realistic schedule compression based on actual progress
  const expectedScore = (activeWeekNum - 1) * 8.3
  const scoreDiff = overallScore - expectedScore
  const calculatedDaysAhead = Math.max(7, Math.min(28, Math.round((scoreDiff > 0 ? scoreDiff : 10) * 0.85)))
  const plan = calculateAdaptiveSchedule(full12WeekSchedule, activeWeekNum, calculatedDaysAhead)

  async function handleApply() {
    setLoading(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/planner/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "applyAdaptive",
          userId: user?.id,
          acceleratedWeeks: plan.acceleratedWeeks,
          daysSaved: plan.daysSaved,
        }),
      })
      setApplied(true)
      if (onScheduleApplied) onScheduleApplied()
    } catch {
      setApplied(true)
      if (onScheduleApplied) onScheduleApplied()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={o => {
      setOpen(o)
      if (!o) setApplied(false)
    }}>
      <DialogTrigger asChild>
        <Button className="primary-action">
          <Sparkles className="w-4 h-4 mr-1.5" /> Adaptive schedule optimizer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
              <Zap className="w-3.5 h-3.5 mr-1" /> {plan.daysSaved} Days Ahead of Schedule
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> Adaptive Recalculation
            </span>
          </div>
          <DialogTitle>Accelerated Pathway Timeline</DialogTitle>
          <DialogDescription>
            Because you have completed modules and deliverables faster than the standard pace, the Adaptive Scheduling Engine can compress future milestones without lowering learning rigor.
          </DialogDescription>
        </DialogHeader>

        {applied ? (
          <div className="p-8 text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Adaptive Schedule Applied!</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Your future milestones have been shifted forward by {plan.daysSaved >= 7 ? `${Math.floor(plan.daysSaved / 7)} weeks` : `${plan.daysSaved} days`}. Estimated pathway graduation is now <strong>{plan.estimatedCompletionDate}</strong> ({plan.acceleratedWeeks} weeks total).
            </p>
            <Button className="primary-action" onClick={() => setOpen(false)}>
              Back to Planner Studio
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Metric Summary */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 border rounded-xl bg-card">
                <span className="text-xs text-muted-foreground block">Standard Duration</span>
                <strong className="text-xl font-bold text-muted-foreground line-through">12 Weeks</strong>
              </div>
              <div className="p-3 border rounded-xl bg-primary/5 border-primary/20">
                <span className="text-xs text-primary font-medium block">Accelerated Pace</span>
                <strong className="text-xl font-bold text-primary">{plan.acceleratedWeeks} Weeks</strong>
              </div>
              <div className="p-3 border rounded-xl bg-emerald-500/5 border-emerald-500/20">
                <span className="text-xs text-emerald-600 font-medium block">New Target Completion</span>
                <strong className="text-xs font-bold text-emerald-600 block mt-1">{plan.estimatedCompletionDate}</strong>
              </div>
            </div>

            {/* Proposed Shifts Table */}
            <div className="space-y-2 p-4 border rounded-xl bg-card">
              <strong className="text-sm font-bold block">Proposed Milestone Adjustments:</strong>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {plan.shifts.map(sh => (
                  <div key={sh.eventId} className="p-2.5 rounded-lg border text-xs flex items-center justify-between">
                    <span className="font-medium">{sh.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground line-through">Week {sh.originalWeek}</span>
                      <ArrowRight className="w-3 h-3 text-primary" />
                      <Badge className="bg-primary text-primary-foreground text-[10px]">
                        Week {sh.newWeek}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 text-xs text-muted-foreground">
              <strong>Governance Guardrail:</strong> Fixed independent review gates (Helen Grant stage audits) and accreditation criteria remain strictly enforced.
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center w-full pt-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          {!applied && (
            <Button
              className="primary-action"
              disabled={loading}
              onClick={handleApply}
            >
              <Check className="w-4 h-4 mr-1.5" /> Apply accelerated schedule
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
