"use client"

import React, { useState } from "react"
import { ListChecks, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

export function QuizDialog() {
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const correct = answer === "manage"

  const options = [
    ["identify", "To identify every person in the organisation"],
    ["manage", "To determine an appropriate engagement approach"],
    ["rank", "To rank stakeholders by job seniority"],
    ["replace", "To replace stakeholder interviews"],
  ] as const

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="primary-action">
          <ListChecks /> Take lesson quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="quiz-dialog">
        <DialogHeader>
          <p className="eyebrow">Module 3 · Knowledge check</p>
          <DialogTitle>Stakeholder analysis</DialogTitle>
          <DialogDescription>
            You need 90% to master this lesson. Answers are explained after submission.
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <div className="quiz-body">
            <div className="question-count">
              <span>Question 1 of 3</span>
              <Progress value={33} />
            </div>
            <h3>What is the primary purpose of a stakeholder power-interest grid?</h3>
            {options.map(([v, l]) => (
              <label className={`answer-option ${answer === v ? "selected" : ""}`} key={v}>
                <input
                  type="radio"
                  name="quiz-answer"
                  value={v}
                  checked={answer === v}
                  onChange={() => setAnswer(v)}
                />
                <span>{l}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className={`quiz-result ${correct ? "correct" : "retry"}`}>
            {correct ? <CheckCircle2 /> : <RefreshCw />}
            <div>
              <h3>{correct ? "Correct" : "Review and try again"}</h3>
              <p>
                {correct
                  ? "The grid helps tailor communication and engagement to stakeholder influence and interest."
                  : "Consider how the model changes the way an analyst communicates with each group."}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {submitted && !correct ? (
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false)
                setAnswer("")
              }}
            >
              <RefreshCw /> Retake
            </Button>
          ) : (
            <Button
              className="primary-action"
              disabled={!answer}
              onClick={() => setSubmitted(true)}
            >
              {submitted ? "Continue" : "Submit answer"}
              <ArrowRight />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
