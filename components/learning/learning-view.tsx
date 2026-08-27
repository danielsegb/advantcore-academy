"use client"

import React, { useState } from "react"
import {
  LibraryBig, Play, Target, Check, ChevronRight, Gauge,
  Sparkles, ArrowRight, BookOpen, Clock, Layers,
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
  const [selectedModuleId, setSelectedModuleId] = useState<string>("mod-03")

  const currentModule = fullCurriculum.find(m => m.id === selectedModuleId) || fullCurriculum[2]
  const currentLesson = currentModule.lessons[0]

  // Calculate overall course stats
  const totalModules = fullCurriculum.length
  const completedModules = fullCurriculum.filter(m => m.status === "done").length
  const overallComplete = Math.round((completedModules / totalModules) * 100)

  return (
    <div className="page-stack">
      <SectionTitle
        eyebrow="Learning studio"
        title="BCS Foundation Certificate in Business Analysis"
        copy="A mastery-based pathway aligned with the accredited 40-question, 60-minute examination format and 90% Academy mastery standards."
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
                setSelectedModuleId("mod-03")
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
              <ReadinessRing value={overallComplete || 67} label="Complete" tone="mint" />
              <div>
                <Badge className="status-badge">
                  <Target className="w-3.5 h-3.5 mr-1" /> Target: 90% mastery threshold
                </Badge>
                <h2>Week 5 of 12</h2>
                <p>14 lessons completed · 5 quizzes passed · Current average 87%</p>
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
                <strong>90%</strong>
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
                  <span>{currentLesson.questions.length} questions · 90% required · Retakes allowed</span>
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
