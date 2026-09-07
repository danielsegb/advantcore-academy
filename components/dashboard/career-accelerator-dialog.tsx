"use client"

import React, { useState } from "react"
import {
  Briefcase, Copy, Check,
  ShieldCheck, Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  interviewScenarios, generateLinkedInCaseStudyBullets,
} from "@/lib/readiness/readiness-calculator"
import { useAuth } from "@/lib/auth/auth-context"

import { InteractiveInterviewSimulator } from "./interactive-interview-simulator"

export function CareerAcceleratorDialog() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"interview" | "linkedin">("interview")
  const [selectedScenarioId, setSelectedScenarioId] = useState("scen-1")
  const [copied, setCopied] = useState(false)

  const activeScenario = interviewScenarios.find(s => s.id === selectedScenarioId) || interviewScenarios[0]
  const linkedInBullets = generateLinkedInCaseStudyBullets(user?.fullName || user?.email?.split("@")[0] || "Learner")

  function handleCopy() {
    navigator.clipboard.writeText(linkedInBullets)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="primary-action">
          <Briefcase className="w-4 h-4 mr-1.5" /> Career & interview accelerator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs w-fit">
              <Award className="w-3.5 h-3.5 mr-1" /> BCS Career Transition Kit
            </Badge>
            <div className="flex gap-1 border rounded-lg p-0.5 bg-muted/30 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("interview")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "interview" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
                }`}
              >
                AI Interview Simulator
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("linkedin")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "linkedin" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
                }`}
              >
                LinkedIn & CV Bullets
              </button>
            </div>
          </div>
          <DialogTitle className="text-base sm:text-lg">Business Analyst Career Accelerator</DialogTitle>
          <DialogDescription className="text-xs">
            Practice live voice/text competency questions with instant AI rubric evaluation, or export evidence-backed case study bullet points.
          </DialogDescription>
        </DialogHeader>

        {activeTab === "interview" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
            {/* Scenarios sidebar */}
            <div className="space-y-2">
              <strong className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">
                Interview Scenarios:
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
                {interviewScenarios.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedScenarioId(s.id)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                      s.id === selectedScenarioId
                        ? "border-primary bg-primary/5 ring-1 ring-primary font-semibold"
                        : "bg-card hover:bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <span className="text-[10px] text-primary block">{s.category}</span>
                    <span className="line-clamp-2 text-foreground font-medium">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Simulator Component */}
            <div className="col-span-1 md:col-span-2">
              <InteractiveInterviewSimulator scenario={activeScenario} />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg text-xs space-y-1">
              <strong className="text-amber-600 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Professional Disclosure & Integrity Standard:
              </strong>
              <p className="text-muted-foreground">
                To maintain strict ethical compliance and BCS integrity, Advantcore project experience is clearly designated as supervised simulated learning rather than direct commercial employment.
              </p>
            </div>

            <div className="p-4 rounded-xl border bg-muted/30 max-h-72 overflow-y-auto font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {linkedInBullets}
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center w-full pt-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          {activeTab === "linkedin" && (
            <Button size="sm" className="primary-action" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? "Copied to Clipboard!" : "Copy LinkedIn summary"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
