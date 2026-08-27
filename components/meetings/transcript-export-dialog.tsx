"use client"

import React, { useState } from "react"
import {
  Download, Copy, Check, Printer, FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import type { TranscriptLine } from "@/components/shared/types"

interface TranscriptExportDialogProps {
  transcript: TranscriptLine[]
  projectName?: string
}

export function TranscriptExportDialog({ transcript, projectName }: TranscriptExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const dateStr = new Date().toISOString().split("T")[0]

  const transcriptMarkdown = `# ADVANTCORE ACADEMY — MEETING TRANSCRIPT
**Project:** ${projectName || "Enquiry-to-delivery process transformation (ADV-BA-001)"}  
**Date:** ${dateStr}  

---

${transcript
  .map(
    l => `**[${l.time}] ${l.speaker} (${l.role}):**  
${l.text}`
  )
  .join("\n\n---\n\n")}`

  function handleCopy() {
    navigator.clipboard.writeText(transcriptMarkdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-1.5" /> Transcript
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              <FileText className="w-3.5 h-3.5 mr-1" /> Multi-Party Transcript
            </Badge>
            <span className="text-xs text-muted-foreground">{transcript.length} entries</span>
          </div>
          <DialogTitle>Project Meeting Transcript</DialogTitle>
          <DialogDescription>
            Complete chronological transcript of stakeholder contributions, supervisory coaching, and learner responses.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border bg-muted/30 max-h-96 overflow-y-auto text-xs font-mono whitespace-pre-wrap leading-relaxed">
            {transcriptMarkdown}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center w-full pt-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1.5" /> Print
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
