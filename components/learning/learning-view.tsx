"use client"

import React from "react"
import {
  LibraryBig, Play, Target, Check, ChevronRight, Gauge,
  Sparkles, ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SectionTitle } from "@/components/shared/section-title"
import { ReadinessRing } from "@/components/shared/readiness-ring"
import { QuizDialog } from "./quiz-dialog"
import type { View } from "@/components/shared/types"

export const bcsModules = [
  ["01", "Business analysis foundations", 100, "done"],
  ["02", "Strategy analysis", 100, "done"],
  ["03", "Stakeholder analysis", 72, "active"],
  ["04", "Business systems modelling", 0, "locked"],
  ["05", "Requirements engineering", 0, "locked"],
  ["06", "Business cases", 0, "locked"],
] as const

interface LearningViewProps {
  onSelectView?: (view: View) => void
}

export function LearningView({ onSelectView }: LearningViewProps) {
  return (
    <div className="page-stack">
      <SectionTitle
        eyebrow="Learning studio"
        title="BCS Foundation Certificate in Business Analysis"
        copy="A mastery-based pathway aligned with the current 40-question, 60-minute examination format."
        actions={
          <>
            <Button variant="outline">
              <LibraryBig /> Resources
            </Button>
            <Button className="primary-action">
              <Play /> Resume lesson
            </Button>
          </>
        }
      />

      <div className="learning-overview">
        <div className="course-progress-main">
          <ReadinessRing value={67} label="Complete" tone="mint" />
          <div>
            <Badge className="status-badge">
              <Target /> Target: 90% mastery
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
              <h2>6 modules</h2>
            </div>
            <span>67%</span>
          </div>
          <div className="module-list">
            {bcsModules.map(m => (
              <button
                key={m[0]}
                className={`module-row ${m[3]}`}
                disabled={m[3] === "locked"}
              >
                <span className="module-number">{m[3] === "done" ? <Check /> : m[0]}</span>
                <span>
                  <strong>{m[1]}</strong>
                  <small>
                    {m[3] === "done" ? "Completed" : m[3] === "active" ? `${m[2]}% complete` : "Unlocks next"}
                  </small>
                </span>
                <ChevronRight />
              </button>
            ))}
          </div>
          <div className="mock-card">
            <Gauge />
            <div>
              <strong>Mock practice</strong>
              <span>Topic, mixed or full exam</span>
            </div>
            <Button size="sm" variant="outline">
              Practise
            </Button>
          </div>
        </aside>

        <article className="lesson-panel">
          <div className="lesson-topline">
            <span>Module 3 · Lesson 4 of 6</span>
            <Badge variant="outline">25 min</Badge>
          </div>
          <h1>Managing stakeholder relationships</h1>
          <p className="lesson-intro">
            Select engagement approaches that reflect stakeholder influence, interest, attitudes and information needs.
          </p>

          <section className="objectives-card">
            <div className="objectives-icon">
              <Target />
            </div>
            <div>
              <p className="eyebrow">Learning outcomes</p>
              <h3>By the end of this lesson, you can:</h3>
              <ul>
                <li><Check /> explain stakeholder management strategy</li>
                <li><Check /> apply the power-interest grid</li>
                <li><Check /> recommend suitable communication approaches</li>
              </ul>
            </div>
          </section>

          <div className="concept-grid">
            <div>
              <span>01</span>
              <h3>Analyse</h3>
              <p>Assess power, interest, attitude and impact using evidence.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Position</h3>
              <p>Map each stakeholder while recognising that positions change.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Engage</h3>
              <p>Choose communications that fit the person and decision.</p>
            </div>
          </div>

          <div className="lesson-example">
            <div>
              <Sparkles />
            </div>
            <div>
              <p className="eyebrow">Workplace connection</p>
              <h3>Apply this to the Advantcore project</h3>
              <p>Classify Sarah, Marcus, Priya and Helen, then justify how you will engage each person during discovery.</p>
              <button onClick={() => onSelectView?.("workplace")}>
                Open project task <ArrowRight />
              </button>
            </div>
          </div>

          <div className="lesson-footer">
            <div>
              <strong>Lesson mastery check</strong>
              <span>3 questions · 90% required · Retakes allowed</span>
            </div>
            <QuizDialog />
          </div>
        </article>
      </section>
    </div>
  )
}
