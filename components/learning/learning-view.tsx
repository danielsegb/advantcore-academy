"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  LibraryBig, Play, Pause, Square,
  Target, Check, ChevronRight, Gauge, Sparkles, ArrowRight, ArrowLeft,
  BookOpen, Clock, Layers, Headphones, CheckCircle2, CircleDot, Trophy, Award
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionTitle } from "@/components/shared/section-title"
import { ReadinessRing } from "@/components/shared/readiness-ring"
import { QuizDialog } from "./quiz-dialog"
import { MockExamDialog } from "./mock-exam-dialog"
import { ResourceLibrary } from "./resource-library"
import { LessonCompletionDialog } from "./lesson-completion-dialog"
import { fullCurriculum } from "@/lib/learning/curriculum-data"
import { syncLearnerProgressFromServer, recordLessonCompletionCrossDevice } from "@/lib/progress/progress-sync"
import { useAuth } from "@/lib/auth/auth-context"
import type { Lesson } from "@/lib/learning/types"
import type { View } from "@/components/shared/types"

interface LearningViewProps {
  onSelectView?: (view: View) => void
}

export function LearningView({ onSelectView }: LearningViewProps) {
  const { user } = useAuth()
  const [activeStudioTab, setActiveStudioTab] = useState<"lessons" | "resources">("lessons")
  
  // Flattened linear sequence of all lessons across modules
  const allLessons = useMemo(() => fullCurriculum.flatMap(m => m.lessons), [])
  const firstActiveModuleId = fullCurriculum.find(m => m.status === "active" || m.status === "done")?.id ?? "mod-01"

  const [selectedModuleId, setSelectedModuleId] = useState<string>(firstActiveModuleId)
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    fullCurriculum.find(m => m.id === firstActiveModuleId)?.lessons[0]?.id ?? allLessons[0]?.id ?? "les-01-01"
  )

  // Real-time completed lessons state
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const uId = user?.id || "guest"
      return JSON.parse(localStorage.getItem(`advantcore_completed_lessons_${uId}`) || "[]")
    } catch {
      return []
    }
  })

  // Completion Celebration Dialog state
  const [completionCelebrationOpen, setCompletionCelebrationOpen] = useState(false)
  const [completionScore, setCompletionScore] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (user?.id) {
      syncLearnerProgressFromServer(user.id)
    }

    function handleProgressUpdate() {
      if (typeof window === "undefined") return
      const uId = user?.id || "guest"
      try {
        const stored: string[] = JSON.parse(localStorage.getItem(`advantcore_completed_lessons_${uId}`) || "[]")
        setCompletedLessonIds(stored)
      } catch {
        setCompletedLessonIds([])
      }
    }

    window.addEventListener("advantcore_progress_updated", handleProgressUpdate)
    window.addEventListener("storage", handleProgressUpdate)
    return () => {
      window.removeEventListener("advantcore_progress_updated", handleProgressUpdate)
      window.removeEventListener("storage", handleProgressUpdate)
    }
  }, [user?.id])

  // Audio Reader state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isPausedAudio, setIsPausedAudio] = useState(false)
  const [playbackRate, setPlaybackRate] = useState<number>(1.0)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const lessonPanelRef = useRef<HTMLDivElement | null>(null)

  // Determine current lesson, module, and adjacent lessons in sequence
  const currentLessonIndex = useMemo(() => {
    const idx = allLessons.findIndex(l => l.id === selectedLessonId)
    return idx >= 0 ? idx : 0
  }, [allLessons, selectedLessonId])

  const currentLesson: Lesson = allLessons[currentLessonIndex] ?? fullCurriculum[0].lessons[0]
  const currentModule = useMemo(() => {
    return fullCurriculum.find(m => m.id === currentLesson.moduleId) ?? fullCurriculum[0]
  }, [currentLesson.moduleId])

  const prevLesson: Lesson | null = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null
  const nextLesson: Lesson | null = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null
  const isCurrentLessonCompleted = completedLessonIds.includes(currentLesson.id)

  // Navigation handler
  const navigateToLesson = useCallback((targetLesson: Lesson) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsPlayingAudio(false)
      setIsPausedAudio(false)
    }
    setSelectedModuleId(targetLesson.moduleId)
    setSelectedLessonId(targetLesson.id)
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      try {
        window.scrollTo({ top: 180, behavior: "smooth" })
      } catch {
        // Fallback for environments where scrollTo options object is not supported
      }
    }
  }, [])

  // Manual Lesson Completion Trigger
  function handleMarkLessonComplete() {
    recordLessonCompletionCrossDevice(user?.id, currentLesson.id, 100)
    setCompletedLessonIds(prev => Array.from(new Set([...prev, currentLesson.id])))
    setCompletionScore(undefined)
    setCompletionCelebrationOpen(true)
  }

  // Quiz Pass Handler
  function handleQuizPass(score?: number) {
    recordLessonCompletionCrossDevice(user?.id, currentLesson.id, score ?? 100)
    setCompletedLessonIds(prev => Array.from(new Set([...prev, currentLesson.id])))
    setCompletionScore(score)
    setCompletionCelebrationOpen(true)
  }

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
  }, [selectedLessonId, selectedModuleId, activeStudioTab])

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

  // Calculate dynamic course stats based on real-time completed lessons
  const totalLessons = allLessons.length || 6
  const lessonsCompleted = completedLessonIds.length
  const overallComplete = Math.min(100, Math.round((lessonsCompleted / totalLessons) * 100))
  const currentWeek = lessonsCompleted > 0 ? Math.min(Math.ceil(lessonsCompleted * 2), 12) : 1
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
                // Jump to first uncompleted lesson, or current
                const firstUnfinished = allLessons.find(l => !completedLessonIds.includes(l.id))
                if (firstUnfinished) {
                  navigateToLesson(firstUnfinished)
                } else {
                  setSelectedModuleId(firstActiveModuleId)
                }
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
                <p>
                  {lessonsCompleted > 0
                    ? `${lessonsCompleted} of ${totalLessons} lesson${totalLessons > 1 ? "s" : ""} completed (${overallComplete}%) · ${quizzesPassed} quiz${quizzesPassed !== 1 ? "zes" : ""} passed`
                    : "No lessons completed yet — start Module 1"}
                </p>
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
            {/* Sidebar Module & Lesson Navigation */}
            <aside className="module-panel">
              <div className="panel-title-row">
                <div>
                  <p className="eyebrow">Course map</p>
                  <h2>6 BCS modules</h2>
                </div>
                <span className="font-semibold text-sm">{overallComplete}%</span>
              </div>
              <div className="module-list">
                {fullCurriculum.map(m => {
                  const modLessons = m.lessons
                  const modCompletedCount = modLessons.filter(l => completedLessonIds.includes(l.id)).length
                  const isModDone = modCompletedCount === modLessons.length && modLessons.length > 0
                  const isModActive = m.id === selectedModuleId
                  const modPercent = modLessons.length > 0 ? Math.round((modCompletedCount / modLessons.length) * 100) : 0

                  return (
                    <div key={m.id} className="border-b border-border/50 last:border-0 pb-1">
                      <button
                        className={`module-row w-full ${isModActive ? "active" : isModDone ? "done" : ""}`}
                        onClick={() => {
                          setSelectedModuleId(m.id)
                          if (m.lessons.length > 0 && !m.lessons.some(l => l.id === selectedLessonId)) {
                            navigateToLesson(m.lessons[0])
                          }
                        }}
                      >
                        <span className="module-number">
                          {isModDone ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" /> : m.moduleNumber}
                        </span>
                        <span>
                          <strong>{m.title}</strong>
                          <small>
                            {isModDone
                              ? "Completed (100%)"
                              : modCompletedCount > 0
                              ? `${modCompletedCount}/${modLessons.length} done (${modPercent}%)`
                              : `${modLessons.length} lesson${modLessons.length > 1 ? "s" : ""}`}
                          </small>
                        </span>
                        <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isModActive ? "rotate-90 text-primary" : "text-muted-foreground"}`} />
                      </button>

                      {/* Expandable Lessons list for active module */}
                      {isModActive && modLessons.length > 0 && (
                        <div className="pl-9 pr-2 py-1.5 space-y-1 bg-muted/40 rounded-lg mb-2">
                          {modLessons.map(les => {
                            const isLesActive = les.id === selectedLessonId
                            const isLesDone = completedLessonIds.includes(les.id)

                            return (
                              <button
                                key={les.id}
                                onClick={() => navigateToLesson(les)}
                                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md flex items-center justify-between gap-2 transition-colors ${
                                  isLesActive
                                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                    : isLesDone
                                    ? "hover:bg-muted text-foreground"
                                    : "hover:bg-muted text-muted-foreground"
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {isLesDone ? (
                                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isLesActive ? "text-primary-foreground" : "text-emerald-600 dark:text-emerald-400"}`} />
                                  ) : isLesActive ? (
                                    <Play className="w-3.5 h-3.5 shrink-0 fill-current" />
                                  ) : (
                                    <CircleDot className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
                                  )}
                                  <span className="truncate">{les.lessonNumber} {les.title}</span>
                                </div>
                                <span className={`text-[10px] shrink-0 ${isLesActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                  {les.estimatedMinutes}m
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mock-card mt-4">
                <Gauge className="w-5 h-5 text-amber-500" />
                <div>
                  <strong>Mock practice</strong>
                  <span>Topic, mixed or full exam</span>
                </div>
                <MockExamDialog />
              </div>
            </aside>

            {/* Main Lesson Content Panel */}
            <article className="lesson-panel" ref={lessonPanelRef}>
              {/* Top Navigation & Status Bar */}
              <div className="lesson-topline pb-3 mb-2 border-b border-border/50 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 font-medium text-foreground text-xs">
                    <BookOpen className="w-4 h-4 text-primary" /> Module {currentModule.moduleNumber} · Lesson {currentLesson.lessonNumber}
                  </span>
                  <Badge variant="outline" className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" /> {currentLesson.estimatedMinutes} min
                  </Badge>
                  {isCurrentLessonCompleted ? (
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Completed & Mastered
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
                      <CircleDot className="w-3 h-3 text-amber-500" /> In Progress
                    </Badge>
                  )}
                </div>

                {/* Quick Prev / Next top switcher */}
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs gap-1"
                    disabled={!prevLesson}
                    onClick={() => prevLesson && navigateToLesson(prevLesson)}
                    title={prevLesson ? `Previous: ${prevLesson.title}` : "First lesson"}
                  >
                    <ArrowLeft className="w-3 h-3" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs gap-1"
                    disabled={!nextLesson}
                    onClick={() => nextLesson && navigateToLesson(nextLesson)}
                    title={nextLesson ? `Next: ${nextLesson.title}` : "Last lesson"}
                  >
                    Next <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
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

              {/* Objectives and Learning Outcomes */}
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

              {/* Lesson Body Content */}
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

              {/* Knowledge Check Mastery Gate Card */}
              <div className="lesson-footer">
                <div>
                  <div className="flex items-center gap-2">
                    <strong>Lesson mastery check</strong>
                    {isCurrentLessonCompleted && (
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] border-emerald-500/30">
                        <Award className="w-3 h-3 mr-1" /> Mastered (80%+)
                      </Badge>
                    )}
                  </div>
                  <span>{currentLesson.questions.length} questions · 80% pass threshold · Retakes allowed</span>
                </div>
                <QuizDialog
                  lesson={currentLesson}
                  onPass={handleQuizPass}
                  nextLesson={nextLesson}
                  onNavigateToNextLesson={navigateToLesson}
                />
              </div>

              {/* Bottom Sequential Navigation & Completion Bar */}
              <div className="mt-8 pt-5 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/30 p-4 rounded-xl border">
                {/* Previous Lesson Button */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!prevLesson}
                  onClick={() => prevLesson && navigateToLesson(prevLesson)}
                  className="w-full sm:w-auto h-10 sm:h-9 text-xs font-semibold gap-1.5 order-2 sm:order-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {prevLesson ? `Previous (${prevLesson.lessonNumber})` : "Previous Lesson"}
                </Button>

                {/* Center / Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
                  {/* Mark Complete Trigger Button */}
                  {!isCurrentLessonCompleted ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-10 sm:h-9 text-xs font-semibold gap-1.5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-800"
                      onClick={handleMarkLessonComplete}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Mark as Complete
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-10 sm:h-9 text-xs font-semibold gap-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => setCompletionCelebrationOpen(true)}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Completed ✓
                    </Button>
                  )}

                  {/* Next Lesson Button */}
                  {nextLesson ? (
                    <Button
                      size="sm"
                      className="primary-action h-10 sm:h-9 text-xs gap-1.5 font-bold"
                      onClick={() => navigateToLesson(nextLesson)}
                    >
                      Next: Lesson {nextLesson.lessonNumber}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="primary-action h-10 sm:h-9 text-xs gap-1.5 font-bold"
                      onClick={() => setCompletionCelebrationOpen(true)}
                    >
                      Curriculum Complete <Trophy className="w-4 h-4 text-amber-300" />
                    </Button>
                  )}
                </div>
              </div>
            </article>
          </section>
        </TabsContent>
      </Tabs>

      {/* Celebratory Lesson Completion Dialog */}
      <LessonCompletionDialog
        open={completionCelebrationOpen}
        onOpenChange={setCompletionCelebrationOpen}
        lesson={currentLesson}
        moduleNumber={currentModule.moduleNumber}
        moduleTitle={currentModule.title}
        nextLesson={nextLesson}
        onNavigateToNextLesson={navigateToLesson}
        onNavigateToWorkplace={() => onSelectView?.("workplace")}
        score={completionScore}
      />
    </div>
  )
}
