"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Mic, MicOff, Volume2, Sparkles, CheckCircle2, AlertCircle,
  RotateCw, Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { InterviewScenario } from "@/lib/readiness/types"
import { useAuth } from "@/lib/auth/auth-context"

interface InteractiveInterviewSimulatorProps {
  scenario: InterviewScenario
  onCompleted?: (scenarioId: string, score: number) => void
}

interface SpeechRecognitionResultItem {
  [index: number]: { transcript: string }
}

interface SpeechRecognitionEventLike {
  resultIndex: number
  results: {
    length: number
    [index: number]: SpeechRecognitionResultItem
  }
}

interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

interface WindowWithSpeech {
  SpeechRecognition?: new () => SpeechRecognitionInstance
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance
}

export function InteractiveInterviewSimulator({ scenario, onCompleted }: InteractiveInterviewSimulatorProps) {
  const { user } = useAuth()
  const [candidateAnswer, setCandidateAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number
    starRating: number
    strengths: string[]
    improvements: string[]
    modelAnswer: string
  } | null>(null)

  const synthRef = useRef<SpeechSynthesis | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }
    return () => {
      if (synthRef.current) synthRef.current.cancel()
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  // Speech-to-text recording
  function toggleRecording() {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop()
      setIsRecording(false)
      return
    }

    if (typeof window === "undefined") return

    const win = window as unknown as WindowWithSpeech
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition

    if (!SpeechRec) {
      alert("Speech recognition is not supported in this browser. You can type your answer directly.")
      return
    }

    try {
      const recognition = new SpeechRec()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-GB"

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let currentTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript
        }
        setCandidateAnswer(prev => {
          const trimmed = prev.trim()
          return trimmed ? `${trimmed} ${currentTranscript}` : currentTranscript
        })
      }

      recognition.onerror = () => {
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognition.start()
      recognitionRef.current = recognition
      setIsRecording(true)
    } catch {
      setIsRecording(false)
    }
  }

  // Interviewer voice narration
  function handleSpeakQuestion() {
    if (!synthRef.current) return
    if (isSpeaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      return
    }

    synthRef.current.cancel()
    const promptText = `Hello, I'm ${scenario.interviewerRole}. Here is your question: ${scenario.question}`
    const utterance = new SpeechSynthesisUtterance(promptText)
    utterance.rate = 1.0

    const voices = synthRef.current.getVoices()
    const ukVoice = voices.find(v => v.lang === "en-GB" || v.name.includes("UK") || v.name.includes("British"))
    if (ukVoice) utterance.voice = ukVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current.speak(utterance)
  }

  function insertStarPrefix(prefix: string) {
    setCandidateAnswer(prev => `${prev}\n**${prefix}:** `)
  }

  // Intelligent client-side rubric evaluation
  function handleEvaluateAnswer() {
    if (!candidateAnswer.trim() || candidateAnswer.length < 20) {
      alert("Please provide a more detailed response (at least 20 words) to receive a full rubric evaluation.")
      return
    }

    setEvaluating(true)

    setTimeout(() => {
      const lower = candidateAnswer.toLowerCase()
      let score = 65

      const keywords = [
        "situation", "task", "action", "result", "star",
        "moscow", "catwoe", "raci", "popit", "power", "interest",
        "stakeholder", "process", "evidence", "advantcore", "sarah", "marcus",
        "objective", "scope", "requirement", "charter", "metrics", "roi"
      ]

      const matchedCount = keywords.filter(kw => lower.includes(kw)).length
      score += Math.min(matchedCount * 3, 30)
      if (candidateAnswer.length > 250) score += 5
      score = Math.min(Math.max(score, 60), 98)

      const strengths: string[] = []
      const improvements: string[] = []

      if (lower.includes("star") || lower.includes("situation") || lower.includes("action")) {
        strengths.push("Clear structured delivery using the STAR competency framework.")
      } else {
        improvements.push("Explicitly structure your answer into Situation, Task, Action, and Result.")
      }

      if (lower.includes("raci") || lower.includes("power") || lower.includes("moscow") || lower.includes("popit") || lower.includes("catwoe")) {
        strengths.push("Excellent integration of formal BCS Business Analysis techniques and tools.")
      } else {
        improvements.push("Incorporate specific BA techniques (e.g. RACI governance or MoSCoW prioritization).")
      }

      if (lower.includes("advantcore") || lower.includes("enquiry") || lower.includes("lead")) {
        strengths.push("Compelling real-world evidence referenced from the ADV-BA-001 project transformation.")
      } else {
        improvements.push("Ground your story in concrete project details (metrics, timelines, deliverables).")
      }

      const evalData = {
        score,
        starRating: Math.round(score / 20),
        strengths: strengths.length > 0 ? strengths : ["Demonstrated good professional enthusiasm and practical knowledge."],
        improvements: improvements.length > 0 ? improvements : ["Add specific quantified percentage improvements to maximize commercial impact."],
        modelAnswer: scenario.modelAnswerFramework,
      }

      setEvaluationResult(evalData)
      setEvaluating(false)

      // Save scenario completion to boost interview readiness
      if (typeof window !== "undefined") {
        const uId = user?.id || "guest"
        try {
          const stored: string[] = JSON.parse(localStorage.getItem(`advantcore_interview_scenarios_${uId}`) || "[]")
          if (!stored.includes(scenario.id)) {
            stored.push(scenario.id)
            localStorage.setItem(`advantcore_interview_scenarios_${uId}`, JSON.stringify(stored))
            window.dispatchEvent(new CustomEvent("advantcore_progress_updated", { detail: { scenarioId: scenario.id } }))
          }
        } catch {}
      }

      if (onCompleted) {
        onCompleted(scenario.id, score)
      }
    }, 800)
  }

  return (
    <div className="space-y-4">
      {/* Interviewer Prompt Card */}
      <div className="p-4 rounded-xl border bg-card/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              {scenario.interviewerRole.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <strong className="text-xs text-foreground block">{scenario.interviewerRole}</strong>
              <span className="text-[11px] text-muted-foreground">{scenario.category} Focus</span>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5 font-medium"
            onClick={handleSpeakQuestion}
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "text-primary animate-pulse" : ""}`} />
            {isSpeaking ? "Stop Voice" : "Hear Question"}
          </Button>
        </div>

        <blockquote className="text-sm font-semibold text-foreground border-l-2 border-primary pl-3 py-0.5 leading-snug">
          &ldquo;{scenario.question}&rdquo;
        </blockquote>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>Expected Competency: <strong>{scenario.keyCriteria[0]}</strong></span>
        </div>
      </div>

      {/* Answer Input Workspace */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            Your Spoken or Written Response
          </label>

          {/* STAR quick insert tags */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground hidden sm:inline mr-1">STAR Helpers:</span>
            {["Situation", "Task", "Action", "Result"].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => insertStarPrefix(star)}
                className="px-2 py-0.5 text-[10px] rounded bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted font-medium border"
              >
                +{star[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={6}
            value={candidateAnswer}
            onChange={e => setCandidateAnswer(e.target.value)}
            placeholder="Structure your answer using STAR: Describe the Situation on ADV-BA-001, your Task, the Actions taken with BCS techniques (MoSCoW, RACI, POPIT), and the commercial Results..."
            className="w-full p-3 text-xs border rounded-xl bg-background leading-relaxed font-sans focus:ring-1 focus:ring-primary focus:outline-none"
          />

          <div className="absolute right-2.5 bottom-2.5 flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={isRecording ? "default" : "outline"}
              className={`h-7 px-2.5 text-xs gap-1.5 rounded-lg ${
                isRecording ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : ""
              }`}
              onClick={toggleRecording}
            >
              {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              {isRecording ? "Stop Recording" : "Voice Dictate"}
            </Button>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">
          {candidateAnswer.split(/\s+/).filter(Boolean).length} words
        </span>

        <Button
          size="sm"
          className="primary-action text-xs font-bold h-9 gap-1.5"
          disabled={evaluating || !candidateAnswer.trim()}
          onClick={handleEvaluateAnswer}
        >
          {evaluating ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {evaluating ? "Evaluating against BCS Rubric..." : "Evaluate my response"}
        </Button>
      </div>

      {/* Evaluation Feedback Results Card */}
      {evaluationResult && (
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3.5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-primary/20 pb-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-bold text-xs">
                Competency Score: {evaluationResult.score}%
              </Badge>
              <span className="text-xs font-semibold text-foreground">
                {evaluationResult.score >= 80 ? "Senior BA Ready ✔" : "Competent · Room for Polish"}
              </span>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Scenario Saved to Portfolio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Strengths */}
            <div className="p-3 rounded-lg bg-card border space-y-1.5">
              <strong className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" /> Identified Strengths:
              </strong>
              <ul className="space-y-1 text-muted-foreground">
                {evaluationResult.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-500">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities for Polish */}
            <div className="p-3 rounded-lg bg-card border space-y-1.5">
              <strong className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> Opportunities for Polish:
              </strong>
              <ul className="space-y-1 text-muted-foreground">
                {evaluationResult.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-amber-500">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Answer Breakdown */}
          <div className="p-3 rounded-lg border bg-card text-xs space-y-1.5">
            <strong className="text-foreground flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" /> Senior BA Benchmark Answer:
            </strong>
            <p className="text-muted-foreground leading-relaxed font-serif italic">
              &ldquo;{evaluationResult.modelAnswer}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
