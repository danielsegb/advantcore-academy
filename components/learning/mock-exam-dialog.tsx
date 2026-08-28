"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  Gauge, Clock, Award,
  ArrowRight, ArrowLeft, RefreshCw, Flag, Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { generateExamQuestions, evaluateMockExam } from "@/lib/mock-exam/engine"
import type { ExamMode, MockExamQuestion, MockExamResult, QuestionDomain } from "@/lib/mock-exam/types"
import { useAuth } from "@/lib/auth/auth-context"

const DOMAIN_OPTIONS: QuestionDomain[] = [
  "Foundations",
  "Strategy Analysis",
  "Stakeholder Analysis",
  "Systems Modelling",
  "Requirements Engineering",
  "Business Cases",
]

export function MockExamDialog() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<"setup" | "exam" | "result">("setup")
  const [mode, setMode] = useState<ExamMode>("full_mock")
  const [selectedDomain, setSelectedDomain] = useState<QuestionDomain>("Stakeholder Analysis")
  const [timed, setTimed] = useState(true)

  // Exam state
  const [questions, setQuestions] = useState<MockExamQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [flagged, setFlagged] = useState<Record<string, boolean>>({})
  const [secondsRemaining, setSecondsRemaining] = useState(3600) // 60 minutes
  const [result, setResult] = useState<MockExamResult | null>(null)
  const timerRef = useRef<number | null>(null)

  const handleFinishExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    const timeSpent = timed ? (mode === "diagnostic" ? 900 - secondsRemaining : 3600 - secondsRemaining) : 0
    const evalResult = evaluateMockExam(questions, answers, Math.max(0, timeSpent))
    setResult(evalResult)
    setStage("result")

    if (typeof window !== "undefined") {
      const uId = user?.id || "guest"
      const currentScores: number[] = JSON.parse(localStorage.getItem(`advantcore_mock_scores_${uId}`) || "[]")
      currentScores.push(evalResult.score)
      localStorage.setItem(`advantcore_mock_scores_${uId}`, JSON.stringify(currentScores))
      window.dispatchEvent(new CustomEvent("advantcore_progress_updated", { detail: { mockScore: evalResult.score } }))
    }

    // Optionally post to server
    if (user?.id) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/learning/mock-exam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          mode,
          answers,
          timeSpentSeconds: timeSpent,
        }),
      }).catch(() => {})
    }
  }, [answers, mode, questions, secondsRemaining, timed, user])

  // Timer countdown
  useEffect(() => {
    if (stage === "exam" && timed) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            handleFinishExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [stage, timed, handleFinishExam])

  function handleStartExam() {
    const qList = generateExamQuestions(mode, mode === "topic_practice" ? selectedDomain : undefined)
    setQuestions(qList)
    setAnswers({})
    setFlagged({})
    setCurrentIdx(0)
    setSecondsRemaining(mode === "diagnostic" ? 900 : 3600) // 15 min or 60 min
    setResult(null)
    setStage("exam")
  }

  function handleOptionSelect(qId: string, optKey: string) {
    setAnswers(prev => ({ ...prev, [qId]: optKey }))
  }

  function toggleFlag(qId: string) {
    setFlagged(prev => ({ ...prev, [qId]: !prev[qId] }))
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const currentQ = questions[currentIdx]
  const answeredCount = Object.keys(answers).length

  return (
    <Dialog open={open} onOpenChange={o => {
      setOpen(o)
      if (!o) {
        if (timerRef.current) clearInterval(timerRef.current)
        setStage("setup")
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto h-10 font-semibold">
          <Gauge className="w-4 h-4 mr-1.5 text-primary" /> BCS timed mock exam
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        {stage === "setup" && (
          <div className="space-y-6">
            <DialogHeader>
              <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary w-fit mb-1">
                <Award className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg sm:text-xl">BCS Foundation Examination Simulator</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                40 multiple-choice questions adhering to the official BCS Foundation Certificate syllabus and weighting guidelines.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <strong className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Exam Mode</strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMode("full_mock")}
                  className={`p-4 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                    mode === "full_mock" ? "border-primary bg-primary/5 ring-2 ring-primary" : "bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm">Full Mock Exam</strong>
                    <Badge variant="default" className="text-[10px]">40 Questions</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">60-minute full simulation covering all 6 syllabus modules.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("diagnostic")}
                  className={`p-4 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                    mode === "diagnostic" ? "border-primary bg-primary/5 ring-2 ring-primary" : "bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm">Rapid Diagnostic</strong>
                    <Badge variant="secondary" className="text-[10px]">10 Questions</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">15-minute quick test to assess overall syllabus readiness.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("topic_practice")}
                  className={`p-4 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                    mode === "topic_practice" ? "border-primary bg-primary/5 ring-2 ring-primary" : "bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm">Topic Practice</strong>
                    <Badge variant="outline" className="text-[10px]">Targeted</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Focus specifically on a chosen business analysis domain.</p>
                </button>
              </div>
            </div>

            {mode === "topic_practice" && (
              <div className="space-y-2 p-4 border rounded-xl bg-muted/40">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="domain-select">
                  Select Focus Domain
                </label>
                <select
                  id="domain-select"
                  value={selectedDomain}
                  onChange={e => setSelectedDomain(e.target.value as QuestionDomain)}
                  className="w-full p-2.5 rounded-lg border bg-background text-base sm:text-sm font-medium"
                >
                  {DOMAIN_OPTIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-card gap-3">
              <div>
                <strong className="text-sm block">Timed Examination Mode</strong>
                <span className="text-xs text-muted-foreground">
                  {timed ? "Active countdown timer enabled" : "Untimed self-paced practice"}
                </span>
              </div>
              <Button
                variant={timed ? "default" : "outline"}
                size="sm"
                className="h-9 font-semibold shrink-0"
                onClick={() => setTimed(t => !t)}
              >
                <Clock className="w-4 h-4 mr-1.5" /> {timed ? "Timed Mode (On)" : "Untimed Mode (Off)"}
              </Button>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto h-10" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="primary-action w-full sm:w-auto h-10 font-bold" onClick={handleStartExam}>
                Start examination <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </DialogFooter>
          </div>
        )}

        {stage === "exam" && currentQ && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">Question {currentIdx + 1} of {questions.length}</Badge>
                <span className="text-xs text-muted-foreground font-medium">{currentQ.domain}</span>
              </div>

              <div className="flex items-center gap-2">
                {timed && (
                  <div className={`flex items-center gap-1 font-mono text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-md ${secondsRemaining < 300 ? "bg-destructive/10 text-destructive animate-pulse" : "bg-muted"}`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(secondsRemaining)}</span>
                  </div>
                )}
                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold" onClick={handleFinishExam}>
                  Submit exam
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-sm sm:text-base leading-relaxed">{currentQ.prompt}</h3>
                <Button
                  size="sm"
                  variant={flagged[currentQ.id] ? "default" : "ghost"}
                  className={`h-8 text-xs shrink-0 ${flagged[currentQ.id] ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}`}
                  onClick={() => toggleFlag(currentQ.id)}
                >
                  <Flag className="w-3.5 h-3.5 mr-1" />
                  {flagged[currentQ.id] ? "Flagged" : "Flag"}
                </Button>
              </div>

              <div className="space-y-2">
                {currentQ.options.map(opt => (
                  <label
                    key={opt.key}
                    className={`answer-option ${answers[currentQ.id] === opt.key ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`exam-q-${currentQ.id}`}
                      value={opt.key}
                      checked={answers[currentQ.id] === opt.key}
                      onChange={() => handleOptionSelect(currentQ.id, opt.key)}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question Navigator Grid */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress: {answeredCount}/{questions.length} answered</span>
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Answered</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Flagged</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors ${
                      idx === currentIdx
                        ? "ring-2 ring-primary font-bold"
                        : ""
                    } ${
                      flagged[q.id]
                        ? "bg-amber-500 text-white"
                        : answers[q.id]
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter className="flex justify-between items-center w-full pt-2">
              <Button
                variant="outline"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <div className="flex gap-2">
                {currentIdx < questions.length - 1 ? (
                  <Button
                    className="primary-action"
                    onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}
                  >
                    Next question <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button className="primary-action" onClick={handleFinishExam}>
                    Finish & Grade <Check className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </DialogFooter>
          </div>
        )}

        {stage === "result" && result && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Examination Performance & Readiness Report</DialogTitle>
              <DialogDescription>
                Detailed breakdown of your results against official BCS certification criteria and Advantcore Academy mastery standards.
              </DialogDescription>
            </DialogHeader>

            {/* Score & Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-xl bg-card text-center space-y-1">
                <span className="text-xs text-muted-foreground block">Overall Score</span>
                <strong className="text-3xl font-extrabold text-foreground">{result.score}%</strong>
                <small className="text-xs text-muted-foreground block">
                  {result.correctCount} of {result.totalQuestions} correct
                </small>
              </div>

              <div className={`p-4 border rounded-xl text-center space-y-1 ${result.passedOfficial ? "bg-emerald-500/10 border-emerald-500/20" : "bg-destructive/10 border-destructive/20"}`}>
                <span className="text-xs block font-medium">BCS Official Pass (65%)</span>
                <strong className={`text-xl font-bold ${result.passedOfficial ? "text-emerald-600" : "text-destructive"}`}>
                  {result.passedOfficial ? "PASSED" : "NOT MET"}
                </strong>
                <small className="text-xs text-muted-foreground block">Pass threshold: 65% (26/40)</small>
              </div>

              <div className={`p-4 border rounded-xl text-center space-y-1 ${result.passedAcademy ? "bg-indigo-500/10 border-indigo-500/20" : "bg-amber-500/10 border-amber-500/20"}`}>
                <span className="text-xs block font-medium">Academy Mastery (90%)</span>
                <strong className={`text-xl font-bold ${result.passedAcademy ? "text-indigo-600" : "text-amber-600"}`}>
                  {result.passedAcademy ? "MASTERED" : "IN PROGRESS"}
                </strong>
                <small className="text-xs text-muted-foreground block">Mastery threshold: 90% (36/40)</small>
              </div>
            </div>

            {/* Domain Breakdown Progress */}
            <div className="space-y-3 p-4 border rounded-xl bg-card">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-primary" /> Performance by Syllabus Domain
              </h3>
              <div className="space-y-2.5">
                {result.domainBreakdowns.map(dom => (
                  <div key={dom.domain} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{dom.domain}</span>
                      <span>{dom.percentage}% ({dom.correctCount}/{dom.totalQuestions})</span>
                    </div>
                    <Progress value={dom.percentage} />
                  </div>
                ))}
              </div>
            </div>

            {/* Question by Question Review */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold">Detailed Question Review & Rationales</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {result.answers.map((ans, idx) => (
                  <div key={ans.questionId} className={`p-4 rounded-xl border space-y-2 text-xs ${ans.isCorrect ? "bg-card border-border" : "bg-destructive/5 border-destructive/20"}`}>
                    <div className="flex items-start justify-between font-semibold">
                      <span>Q{idx + 1}: {ans.prompt}</span>
                      {ans.isCorrect ? (
                        <Badge className="bg-emerald-500 text-white shrink-0 ml-2">Correct</Badge>
                      ) : (
                        <Badge variant="destructive" className="shrink-0 ml-2">Incorrect</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed pt-1 border-t">
                      <strong>Rationale:</strong> {ans.explanation}
                    </p>
                    <small className="text-muted-foreground block pt-0.5 text-[11px]">
                      <strong>Syllabus Reference:</strong> {ans.syllabusReference}
                    </small>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 pt-2">
              <Button variant="outline" className="w-full sm:w-auto h-10" onClick={() => setStage("setup")}>
                <RefreshCw className="w-4 h-4 mr-1.5" /> Retake or change mode
              </Button>
              <Button className="primary-action w-full sm:w-auto h-10 font-bold" onClick={() => setOpen(false)}>
                Return to Learning Studio <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
