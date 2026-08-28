import React from "react"
import { Sparkles, GraduationCap, BriefcaseBusiness, Gauge, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { View } from "@/components/shared/types"

interface GuidedTourDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStartLearning: (view: View) => void
}

export function GuidedTourDialog({ open, onOpenChange, onStartLearning }: GuidedTourDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="tour-dialog">
        <DialogHeader>
          <Badge className="status-badge">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Welcome to Advantcore Academy
          </Badge>
          <DialogTitle>Learn it. Practise it. Prove it.</DialogTitle>
          <DialogDescription>
            Your career journey connects structured study with a realistic Advantcore workplace.
          </DialogDescription>
        </DialogHeader>
        <div className="tour-grid">
          <div>
            <span>1</span>
            <GraduationCap />
            <strong>Master the knowledge</strong>
            <p>Lessons, quizzes and adaptive exam practice.</p>
          </div>
          <div>
            <span>2</span>
            <BriefcaseBusiness />
            <strong>Apply it at work</strong>
            <p>Projects, project stakeholders and assessed evidence.</p>
          </div>
          <div>
            <span>3</span>
            <Gauge />
            <strong>Know when ready</strong>
            <p>One view of certification and job readiness.</p>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 pt-2">
          <Button variant="outline" className="w-full sm:w-auto h-10" onClick={() => onOpenChange(false)}>
            Skip tour
          </Button>
          <Button
            className="primary-action w-full sm:w-auto h-10 font-bold"
            onClick={() => {
              onOpenChange(false)
              onStartLearning("learning")
            }}
          >
            Start with learning <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
