"use client"

import React, { useState } from "react"
import { ListChecks, CheckCircle2, RefreshCw, ArrowRight, ShieldCheck, ShieldAlert, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import type { Lesson, QuizSubmissionResult } from "@/lib/learning/types"
import { useAuth } from "@/lib/auth/auth-context"

interface QuizDialogProps {
  lesson: Lesson
  onPass?: (score?: number) => void
  nextLesson?: Lesson | null
  onNavigateToNextLesson?: (nextLesson: Lesson) => void
}

export function QuizDialog({ lesson, onPass, nextLesson, onNavigateToNextLesson }: QuizDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuizSubmissionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const currentQ = lesson.questions[currentIdx]
  const isLastQ = currentIdx === lesson.questions.length - 1
  const selectedAnswer = currentQ ? answers[currentQ.id] : ""

  function handleSelectOption(optKey: string) {
    if (!currentQ) return
    setAnswers(prev => ({ ...prev, [currentQ.id]: optKey }))
  }

  function handleNextOrSubmit() {
    if (!isLastQ) {
      setCurrentIdx(i => i + 1)
    } else {
      submitQuiz()
    }
  }

  function recordLessonCompletion(score: number) {
    if (typeof window !== "undefined") {
      const uId = user?.id || "guest"
      const currentCompleted: string[] = JSON.parse(localStorage.getItem(`advantcore_completed_lessons_${uId}`) || "[]")
      if (!currentCompleted.includes(lesson.id)) {
        currentCompleted.push(lesson.id)
        localStorage.setItem(`advantcore_completed_lessons_${uId}`, JSON.stringify(currentCompleted))
      }
      window.dispatchEvent(new CustomEvent("advantcore_progress_updated", { detail: { lessonId: lesson.id } }))
    }
    if (onPass) onPass(score)
  }

  async function submitQuiz() {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/learning/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          userId: user?.id,
          answers,
        }),
      })

      const data = (await res.json()) as QuizSubmissionResult
      setResult(data)
      if (data.masteryAchieved) {
        recordLessonCompletion(data.score)
      }
    } catch {
      // Local fallback calculation
      let correct = 0
      const explanations = lesson.questions.map(q => {
        const correctOpt = q.options.find(o => o.isCorrect)
        const isCorr = answers[q.id] === correctOpt?.key
        if (isCorr) correct++
        return {
          questionId: q.id,
          prompt: q.prompt,
          selectedKey: answers[q.id] || "",
          isCorrect: isCorr,
          explanation: q.explanation,
        }
      })
      const score = Math.round((correct / lesson.questions.length) * 100)
      const res: QuizSubmissionResult = {
        score,
        totalQuestions: lesson.questions.length,
        correctCount: correct,
        masteryAchieved: score >= 80,
        explanations,
      }
      setResult(res)
      if (res.masteryAchieved) {
        recordLessonCompletion(score)
      }
    } finally {
      setLoading(false)
    }
  }

  function handleRetake() {
    setResult(null)
    setAnswers({})
    setCurrentIdx(0)
  }

  function handleContinueToNext() {
    setOpen(false)
    if (nextLesson && onNavigateToNextLesson) {
      onNavigateToNextLesson(nextLesson)
    }
  }

  return (
    <Dialog open={open} onOpenChange={o => {
      setOpen(o)
      if (!o) handleRetake()
    }}>
      <DialogTrigger asChild>
        <Button className="primary-action">
          <ListChecks className="w-4 h-4 mr-1.5" /> Take lesson quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              <Award className="w-3.5 h-3.5 mr-1 text-primary" /> Mastery check · 80% required
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {lesson.id.toUpperCase()}
            </span>
          </div>
          <DialogTitle className="text-base sm:text-lg">{lesson.title}</DialogTitle>
          <DialogDescription className="text-xs">
            Answer the 10 questions below to demonstrate core competence and earn verified progress.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>Question {currentIdx + 1} of {lesson.questions.length}</span>
                <span>{Math.round(((currentIdx + 1) / lesson.questions.length) * 100)}% Complete</span>
              </div>
              <Progress value={((currentIdx + 1) / lesson.questions.length) * 100} className="h-1.5" />
            </div>

            {currentQ && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm sm:text-base leading-snug text-foreground">
                  {currentQ.prompt}
                </h3>

                <div className="space-y-2">
                  {currentQ.options.map(opt => {
                    const isSelected = selectedAnswer === opt.key
                    return (
                      <button
                        type="button"
                        key={opt.key}
                        onClick={() => handleSelectOption(opt.key)}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm flex items-center gap-3 transition-all min-h-[44px] cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 font-semibold ring-1 ring-primary text-foreground"
                            : "bg-card hover:bg-muted/40 text-foreground"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {opt.key.toUpperCase()}
                        </span>
                        <span className="flex-1 leading-snug">{opt.text}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                result.masteryAchieved
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-100"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-100"
              }`}
            >
              {result.masteryAchieved ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <RefreshCw className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm sm:text-base">
                    {result.masteryAchieved ? "Mastery Achieved!" : "Mastery Not Yet Achieved"}
                  </h3>
                  <Badge variant={result.masteryAchieved ? "default" : "destructive"}>
                    {result.score}% ({result.correctCount}/{result.totalQuestions})
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed">
                  {result.masteryAchieved
                    ? "Outstanding work. You have mastered this lesson and can advance to the next topic or apply this knowledge in the workplace."
                    : "You need 80% or higher to master this module. Review the explanations below and retake the quiz."}
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-60 sm:max-h-72 overflow-y-auto pr-1">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Question Review & Rationales</h4>
              {result.explanations.map((exp, idx) => (
                <div key={exp.questionId} className="p-3 rounded-lg border bg-card text-xs space-y-1">
                  <div className="flex items-start justify-between font-medium gap-2">
                    <span className="leading-snug">Q{idx + 1}: {exp.prompt}</span>
                    {exp.isCorrect ? (
                      <span className="text-emerald-500 flex items-center shrink-0 ml-1"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Correct</span>
                    ) : (
                      <span className="text-amber-500 flex items-center shrink-0 ml-1"><ShieldAlert className="w-3.5 h-3.5 mr-1" /> Review</span>
                    )}
                  </div>
                  <p className="text-muted-foreground pt-1 border-t text-[11px] leading-relaxed">{exp.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="pt-2">
          {!result ? (
            <div className="flex justify-between items-center w-full gap-2">
              <Button
                variant="outline"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                className="h-10 px-4 text-xs font-semibold"
              >
                Previous
              </Button>
              <Button
                className="primary-action h-10 px-4 text-xs font-bold"
                disabled={!selectedAnswer || loading}
                onClick={handleNextOrSubmit}
              >
                {isLastQ ? (loading ? "Submitting..." : "Submit quiz") : "Next question"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
              {!result.masteryAchieved ? (
                <Button variant="outline" className="w-full sm:w-auto h-10" onClick={handleRetake}>
                  <RefreshCw className="w-4 h-4 mr-1.5" /> Retake quiz
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full sm:w-auto h-10" onClick={() => setOpen(false)}>
                    Review Lesson
                  </Button>
                  {nextLesson && onNavigateToNextLesson ? (
                    <Button className="primary-action w-full sm:w-auto h-10 font-bold" onClick={handleContinueToNext}>
                      Next Lesson ({nextLesson.lessonNumber}) <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button className="primary-action w-full sm:w-auto h-10 font-bold" onClick={() => setOpen(false)}>
                      Continue learning <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
