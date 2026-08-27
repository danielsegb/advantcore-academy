"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  LibraryBig, Play, Pause, Square,
  Target, Check, ChevronRight, Gauge, Sparkles, ArrowRight,
  BookOpen, Clock, Layers, Headphones
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionTitle } from "@/components/shared/section-title"
import { ReadinessRing } from "@/components/shared/readiness-ring"
import { QuizDialog } from "./quiz-dialog"
import { MockExamDialog } from "./mock-exam-dialog"
import { ResourceLibrary } from "./resource-library"
import { fullCurriculum } from "@/lib/learning/curriculum-data"
import type { View } from "@/components/shared/types"

interface LearningViewProps {
  onSelectView?: (view: View) => void
}

export function LearningView({ onSelectView }: LearningViewProps) {
  const [activeStudioTab, setActiveStudioTab] = useState<"lessons" | "resources">("lessons")
  const firstActiveModuleId = fullCurriculum.find(m => m.status === "active" || m.status === "done")?.id ?? "mod-01"
  const [selectedModuleId, setSelectedModuleId] = useState<string>(firstActiveModuleId)

  // Audio Reader state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isPausedAudio, setIsPausedAudio] = useState(false)
  const [playbackRate, setPlaybackRate] = useState<number>(1.0)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const currentModule = fullCurriculum.find(m => m.id === selectedModuleId) ?? fullCurriculum[0]
  const currentLesson = currentModule.lessons[0]

  // Setup speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  // Stop audio whenever user changes lesson or module
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsPlayingAudio(false)
      setIsPausedAudio(false)
    }
  }, [selectedModuleId, activeStudioTab])

  function handlePlayAudio() {
    if (!synthRef.current) return

    if (isPausedAudio) {
      synthRef.current.resume()
      setIsPausedAudio(false)
      setIsPlayingAudio(true)
      return
    }

    synthRef.current.cancel()

    // Build comprehensive narration script from lesson content
    const scriptParts: string[] = [
      `Module ${currentModule.moduleNumber}, Lesson ${currentLesson.lessonNumber}: ${currentLesson.title}.`,
      currentLesson.intro,
      "Key Learning Outcomes:",
      ...currentLesson.outcomes,
      "Core Concepts:",
      ...currentLesson.concepts.map(c => `${c.title}: ${c.description}`),
    ]

    if (currentLesson.bodyContent) {
      currentLesson.bodyContent.forEach(sec => {
        scriptParts.push(sec.heading)
        scriptParts.push(...sec.paragraphs)
      })
    }

    const fullScript = scriptParts.join(" ")
    const utterance = new SpeechSynthesisUtterance(fullScript)
    utterance.rate = playbackRate

    // Try finding UK English voice
    const voices = synthRef.current.getVoices()
    const ukVoice = voices.find(v => v.lang === "en-GB" || v.name.includes("UK") || v.name.includes("British"))
    if (ukVoice) {
      utterance.voice = ukVoice
    }

    utterance.onstart = () => {
      setIsPlayingAudio(true)
      setIsPausedAudio(false)
    }

    utterance.onend = () => {
      setIsPlayingAudio(false)
      setIsPausedAudio(false)
    }

    utterance.onerror = () => {
      setIsPlayingAudio(false)
      setIsPausedAudio(false)
    }

    synthRef.current.speak(utterance)
  }

  function handlePauseAudio() {
    if (!synthRef.current) return
    synthRef.current.pause()
    setIsPausedAudio(true)
  }

  function handleStopAudio() {
    if (!synthRef.current) return
    synthRef.current.cancel()
    setIsPlayingAudio(false)
    setIsPausedAudio(false)
  }

  function handleRateChange(rate: number) {
    setPlaybackRate(rate)
    if (isPlayingAudio && !isPausedAudio) {
      handleStopAudio()
      setTimeout(() => {
        setPlaybackRate(rate)
        handlePlayAudio()
      }, 50)
    }
  }

  // Calculate overall course stats from actual data
  const totalModules = fullCurriculum.length
  const completedModules = fullCurriculum.filter(m => m.status === "done").length
  const overallComplete = Math.round((completedModules / totalModules) * 100)
  const currentWeek = completedModules > 0 ? Math.min(completedModules * 2 + 1, 12) : 1
  const lessonsCompleted = fullCurriculum.filter(m => m.status === "done").reduce((acc, m) => acc + m.lessons.length, 0)
  const quizzesPassed = lessonsCompleted

  return (
    <div className="page-stack">
      <SectionTitle
        eyebrow="Learning studio"
        title="BCS Foundation Certificate in Business Analysis"
        copy="A mastery-based pathway aligned with the accredited 40-question, 60-minute examination format and 80% Academy mastery standards."
        actions={
          <>
            <Button
              variant={activeStudioTab === "resources" ? "default" : "outline"}
              onClick={() => setActiveStudioTab("resources")}
            >
              <LibraryBig className="w-4 h-4 mr-1.5" /> Programme library & textbook
            </Button>
            <Button
              className="primary-action"
              onClick={() => {
                setActiveStudioTab("lessons")
                setSelectedModuleId(firstActiveModuleId)
              }}
            >
              <Play className="w-4 h-4 mr-1.5" /> Resume lesson
            </Button>
          </>
        }
      />

      <Tabs value={activeStudioTab} onValueChange={(v) => setActiveStudioTab(v as "lessons" | "resources")} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="lessons" className="gap-1.5">
            <BookOpen className="w-4 h-4" /> 6 BCS Curriculum Modules
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-1.5">
            <Layers className="w-4 h-4" /> Programme Pack & Textbook Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6">
          <ResourceLibrary />
        </TabsContent>

        <TabsContent value="lessons" className="space-y-6">
          <div className="learning-overview">
            <div className="course-progress-main">
              <ReadinessRing value={overallComplete} label="Complete" tone="mint" />
              <div>
                <Badge className="status-badge">
                  <Target className="w-3.5 h-3.5 mr-1" /> Target: 80% mastery threshold
                </Badge>
                <h2>Week {currentWeek} of 12</h2>
                <p>{lessonsCompleted > 0 ? `${lessonsCompleted} lesson${lessonsCompleted > 1 ? "s" : ""} completed · ${quizzesPassed} quiz${quizzesPassed !== 1 ? "zes" : ""} passed` : "No lessons completed yet — start Module 1"}</p>
              </div>
            </div>
            <div className="exam-facts">
              <div>
                <strong>40</strong>
                <span>Questions</span>
              </div>
              <div>
                <strong>60</strong>
                <span>Minutes</span>
              </div>
              <div>
                <strong>65%</strong>
                <span>Official pass mark</span>
              </div>
              <div>
                <strong>80%</strong>
                <span>Academy target</span>
              </div>
            </div>
          </div>

          <section className="learning-layout">
            <aside className="module-panel">
              <div className="panel-title-row">
                <div>
                  <p className="eyebrow">Course map</p>
                  <h2>6 BCS modules</h2>
                </div>
                <span className="font-semibold text-sm">{overallComplete}%</span>
              </div>
              <div className="module-list">
                {fullCurriculum.map(m => (
                  <button
                    key={m.id}
                    className={`module-row ${m.id === selectedModuleId ? "active" : m.status}`}
                    onClick={() => setSelectedModuleId(m.id)}
                  >
                    <span className="module-number">{m.status === "done" ? <Check className="w-3.5 h-3.5" /> : m.moduleNumber}</span>
                    <span>
                      <strong>{m.title}</strong>
                      <small>
                        {m.status === "done" ? "Completed" : m.status === "active" ? `${m.progressPercentage}% complete` : "Self-paced"}
                      </small>
                    </span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                ))}
              </div>

              <div className="mock-card">
                <Gauge className="w-5 h-5 text-amber-500" />
                <div>
                  <strong>Mock practice</strong>
                  <span>Topic, mixed or full exam</span>
                </div>
                <MockExamDialog />
              </div>
            </aside>

            <article className="lesson-panel">
              <div className="lesson-topline">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-primary" /> Module {currentModule.moduleNumber} · Lesson {currentLesson.lessonNumber}
                </span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {currentLesson.estimatedMinutes} min
                </Badge>
              </div>

              <h1>{currentLesson.title}</h1>
              <p className="lesson-intro">{currentLesson.intro}</p>

              {/* Lesson Audio Reader Card */}
              <div className="p-4 rounded-xl border bg-card/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlayingAudio && !isPausedAudio ? "bg-primary text-white ring-4 ring-primary/20 animate-pulse" : "bg-primary/10 text-primary"}`}>
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-semibold text-foreground">Lesson Audio Reader</strong>
                      {isPlayingAudio && !isPausedAudio && (
                        <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] py-0 px-1.5 border-emerald-500/30 animate-pulse">
                          Speaking...
                        </Badge>
                      )}
                      {isPausedAudio && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-amber-500 border-amber-500/30">
                          Paused
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Listen to the full lesson body, outcomes, and core concept breakdowns.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Play / Pause / Stop Buttons */}
                  {!isPlayingAudio || isPausedAudio ? (
                    <Button
                      size="sm"
                      className="primary-action text-xs h-8 gap-1.5"
                      onClick={handlePlayAudio}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {isPausedAudio ? "Resume" : "Listen to Lesson"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 gap-1.5 text-amber-500 border-amber-500/30"
                      onClick={handlePauseAudio}
                    >
                      <Pause className="w-3.5 h-3.5" />
                      Pause
                    </Button>
                  )}

                  {isPlayingAudio && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-8 px-2 text-muted-foreground hover:text-red-500"
                      onClick={handleStopAudio}
                      title="Stop audio playback"
                    >
                      <Square className="w-3.5 h-3.5" />
                    </Button>
                  )}

                  {/* Playback Speed selector */}
                  <div className="flex bg-muted p-0.5 rounded-lg border text-[11px] font-medium">
                    {[1.0, 1.25, 1.5].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleRateChange(rate)}
                        className={`px-2 py-1 rounded transition-all ${playbackRate === rate ? "bg-background text-foreground font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Objectives and Learning Outcomes rendered BEFORE content */}
              <section className="objectives-card">
                <div className="objectives-icon">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="eyebrow">Learning outcomes</p>
                  <h3>By the end of this lesson, you can:</h3>
                  <ul className="space-y-1 mt-2">
                    {currentLesson.outcomes.map(outc => (
                      <li key={outc} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{outc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Key Concept Breakdown */}
              <div className="concept-grid">
                {currentLesson.concepts.map(con => (
                  <div key={con.number}>
                    <span>{con.number}</span>
                    <h3>{con.title}</h3>
                    <p>{con.description}</p>
                  </div>
                ))}
              </div>

              {/* Lesson Body Content — Structured Reading Material */}
              {currentLesson.bodyContent && currentLesson.bodyContent.length > 0 && (
                <div className="lesson-body-content space-y-6">
                  {currentLesson.bodyContent.map((section, idx) => (
                    <div key={idx} className="p-5 rounded-xl border bg-card">
                      <h3 className="font-semibold text-base mb-3 text-foreground">{section.heading}</h3>
                      <div className="space-y-3">
                        {section.paragraphs.map((para, pIdx) => (
                          <p key={pIdx} className="text-sm text-muted-foreground leading-relaxed">{para}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Workplace Connection */}
              <div className="lesson-example">
                <div>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="eyebrow">Workplace connection</p>
                  <h3>{currentLesson.workplaceConnection.title}</h3>
                  <p>{currentLesson.workplaceConnection.description}</p>
                  <button onClick={() => onSelectView?.("workplace")} className="text-primary font-semibold flex items-center gap-1 text-sm mt-2">
                    {currentLesson.workplaceConnection.actionText} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Knowledge Check Mastery Gate */}
              <div className="lesson-footer">
                <div>
                  <strong>Lesson mastery check</strong>
                  <span>{currentLesson.questions.length} questions · 80% pass threshold · Retakes allowed</span>
                </div>
                <QuizDialog lesson={currentLesson} />
              </div>
            </article>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  )
}
