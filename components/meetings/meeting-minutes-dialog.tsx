"use client"

import React, { useState } from "react"
import {
  WandSparkles, Copy, Check, Printer, FileText,
  Calendar, Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { generateMeetingMinutes } from "@/lib/meetings/minutes-generator"
import type { TranscriptLine } from "@/components/shared/types"
import { useAuth } from "@/lib/auth/auth-context"

interface MeetingMinutesDialogProps {
  transcript: TranscriptLine[]
  projectName?: string
}

export function MeetingMinutesDialog({ transcript, projectName }: MeetingMinutesDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const minutes = generateMeetingMinutes(
    transcript,
    projectName || "Enquiry-to-delivery process transformation",
    "ADV-BA-001",
    user?.fullName || "Amanda Okafor"
  )

  function handleCopy() {
    navigator.clipboard.writeText(minutes.markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="primary-action">
          <WandSparkles className="w-4 h-4 mr-1.5" /> Generate minutes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              <FileText className="w-3.5 h-3.5 mr-1" /> Executive Project Deliverable
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {minutes.date}
            </span>
          </div>
          <DialogTitle>{minutes.meetingTitle}</DialogTitle>
          <DialogDescription>
            Automated executive meeting minutes synthesized from live conversation transcript. Grounded in BCS Foundation standards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Attendees */}
          <div className="p-3 rounded-lg border bg-muted/20 text-xs space-y-1">
            <strong className="text-foreground flex items-center gap-1.5 font-semibold">
              <Users className="w-3.5 h-3.5" /> Attendees Present:
            </strong>
            <div className="flex gap-2 flex-wrap text-muted-foreground pt-1">
              {minutes.attendees.map(att => (
                <Badge key={att} variant="outline" className="text-[11px]">
                  {att}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Items Table */}
          <div className="p-4 rounded-xl border bg-card space-y-2">
            <strong className="text-sm font-bold block">Agreed Action Items & Deliverables:</strong>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-2">Action Deliverable</th>
                    <th className="pb-2">Owner</th>
                    <th className="pb-2">Target Date</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {minutes.actionItems.map(act => (
                    <tr key={act.id} className="py-2">
                      <td className="py-2 font-medium">{act.task}</td>
                      <td className="py-2 text-muted-foreground">{act.owner}</td>
                      <td className="py-2 text-muted-foreground">{act.dueDate}</td>
                      <td className="py-2">
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                          {act.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formatted Markdown Preview */}
          <div className="p-4 rounded-xl border bg-muted/30 max-h-72 overflow-y-auto text-xs font-mono whitespace-pre-wrap leading-relaxed">
            {minutes.markdown}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center w-full pt-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1.5" /> Print minutes
            </Button>
            <Button size="sm" className="primary-action" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? "Copied Markdown!" : "Copy markdown"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
