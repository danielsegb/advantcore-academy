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
  onPass?: () => void
}

export function QuizDialog({ lesson, onPass }: QuizDialogProps) {
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
      if (data.masteryAchieved && onPass) {
        onPass()
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
        masteryAchieved: score >= 90,
        explanations,
      }
      setResult(res)
      if (res.masteryAchieved && onPass) {
        onPass()
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
      <DialogContent className="quiz-dialog max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <p className="eyebrow">Lesson {lesson.lessonNumber} · Knowledge Mastery Check</p>
            <Badge variant="outline" className="text-xs">
              <Award className="w-3.5 h-3.5 mr-1" /> 90% required
            </Badge>
          </div>
          <DialogTitle>{lesson.title}</DialogTitle>
          <DialogDescription>
            You must score 90% or higher to master this lesson. Detailed explanations are provided for all questions.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="quiz-body space-y-4">
            <div className="question-count">
              <span>Question {currentIdx + 1} of {lesson.questions.length}</span>
              <Progress value={((currentIdx + 1) / lesson.questions.length) * 100} />
            </div>

            {currentQ && (
              <div className="space-y-3">
                <h3 className="font-semibold text-base leading-snug">{currentQ.prompt}</h3>
                <div className="space-y-2">
                  {currentQ.options.map(opt => (
                    <label
                      key={opt.key}
                      className={`answer-option ${selectedAnswer === opt.key ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQ.id}`}
                        value={opt.key}
                        checked={selectedAnswer === opt.key}
                        onChange={() => handleSelectOption(opt.key)}
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`quiz-result ${result.masteryAchieved ? "correct" : "retry"}`}>
              {result.masteryAchieved ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              ) : (
                <RefreshCw className="w-6 h-6 text-amber-500 shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base">
                    {result.masteryAchieved ? "Mastery Achieved!" : "Mastery Not Yet Achieved"}
                  </h3>
                  <Badge variant={result.masteryAchieved ? "default" : "destructive"}>
                    {result.score}% ({result.correctCount}/{result.totalQuestions})
                  </Badge>
                </div>
                <p className="text-sm mt-1">
                  {result.masteryAchieved
                    ? "Outstanding work. You have mastered this lesson and can advance to the next topic or apply this knowledge in the workplace."
                    : "You need 90% or higher to master this module. Review the explanations below and retake the quiz."}
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Question Review & Rationales</h4>
              {result.explanations.map((exp, idx) => (
                <div key={exp.questionId} className="p-3 rounded-lg border bg-card text-xs space-y-1">
                  <div className="flex items-start justify-between font-medium">
                    <span>Q{idx + 1}: {exp.prompt}</span>
                    {exp.isCorrect ? (
                      <span className="text-emerald-500 flex items-center shrink-0 ml-2"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Correct</span>
                    ) : (
                      <span className="text-amber-500 flex items-center shrink-0 ml-2"><ShieldAlert className="w-3.5 h-3.5 mr-1" /> Review</span>
                    )}
                  </div>
                  <p className="text-muted-foreground pt-1 border-t text-[11px]">{exp.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="pt-2">
          {!result ? (
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              >
                Previous
              </Button>
              <Button
                className="primary-action"
                disabled={!selectedAnswer || loading}
                onClick={handleNextOrSubmit}
              >
                {isLastQ ? (loading ? "Submitting..." : "Submit quiz") : "Next question"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-end gap-2 w-full">
              {!result.masteryAchieved ? (
                <Button variant="outline" onClick={handleRetake}>
                  <RefreshCw className="w-4 h-4 mr-1.5" /> Retake quiz
                </Button>
              ) : (
                <Button className="primary-action" onClick={() => setOpen(false)}>
                  Continue learning <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
