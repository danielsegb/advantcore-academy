"use client"

import React from "react"
import {
  Trophy, CheckCircle2, ArrowRight, Sparkles, BookOpen,
  BriefcaseBusiness, Check, Award
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Lesson } from "@/lib/learning/types"

interface LessonCompletionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lesson: Lesson
  moduleNumber: string
  moduleTitle: string
  nextLesson?: Lesson | null
  onNavigateToNextLesson?: (nextLesson: Lesson) => void
  onNavigateToWorkplace?: () => void
  score?: number
}

export function LessonCompletionDialog({
  open,
  onOpenChange,
  lesson,
  moduleNumber,
  moduleTitle,
  nextLesson,
  onNavigateToNextLesson,
  onNavigateToWorkplace,
  score,
}: LessonCompletionDialogProps) {
  function handleNext() {
    onOpenChange(false)
    if (nextLesson && onNavigateToNextLesson) {
      onNavigateToNextLesson(nextLesson)
    }
  }

  function handleWorkplace() {
    onOpenChange(false)
    if (onNavigateToWorkplace) {
      onNavigateToWorkplace()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-border/80 shadow-2xl">
        {/* Top Header Banner with Emerald Glow */}
        <div className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-6 text-white overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-4 bottom-2 text-emerald-400/10 pointer-events-none">
            <Trophy className="w-28 h-28" />
          </div>

          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner">
              <Trophy className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/40 text-[11px] font-semibold py-0.5">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-300" /> Lesson Mastered
                </Badge>
                {score !== undefined && (
                  <Badge variant="outline" className="text-emerald-200 border-emerald-400/30 text-[11px]">
                    <Award className="w-3 h-3 mr-1" /> Score: {score}%
                  </Badge>
                )}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1.5">
                Lesson {lesson.lessonNumber} Completed!
              </h2>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Module {moduleNumber}: {moduleTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Dialog Body */}
        <div className="p-6 space-y-5 bg-card">
          <DialogHeader className="sr-only">
            <DialogTitle>Lesson {lesson.lessonNumber} Completed</DialogTitle>
            <DialogDescription>
              You have successfully completed {lesson.title} and verified key learning outcomes.
            </DialogDescription>
          </DialogHeader>

          {/* Lesson Title & Confirmation Card */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-foreground truncate">{lesson.title}</h4>
              <p className="text-[11px] text-muted-foreground">
                Your pathway readiness score and BCS Foundation progress have been updated.
              </p>
            </div>
          </div>

          {/* Verified Learning Outcomes */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-primary" /> Verified Learning Outcomes
            </p>
            <ul className="space-y-1.5">
              {lesson.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Workplace Connection Teaser */}
          {lesson.workplaceConnection && (
            <div className="p-3 rounded-xl bg-muted/60 border text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                <BriefcaseBusiness className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Next in Workplace Simulation</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {lesson.workplaceConnection.title}: {lesson.workplaceConnection.description}
              </p>
            </div>
          )}
        </div>

        {/* Dialog Footer Actions */}
        <DialogFooter className="p-4 bg-muted/40 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onOpenChange(false)}
          >
            Stay on this lesson
          </Button>

          <div className="flex items-center gap-2">
            {lesson.workplaceConnection && onNavigateToWorkplace && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={handleWorkplace}
              >
                <BriefcaseBusiness className="w-3.5 h-3.5 text-amber-600" /> Workplace Task
              </Button>
            )}

            {nextLesson ? (
              <Button
                size="sm"
                className="primary-action text-xs gap-1.5 font-semibold"
                onClick={handleNext}
              >
                Next Lesson ({nextLesson.lessonNumber}) <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                className="primary-action text-xs gap-1.5 font-semibold"
                onClick={() => onOpenChange(false)}
              >
                Curriculum Completed <Sparkles className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
