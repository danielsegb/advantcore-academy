"use client"

import React, { useState } from "react"
import {
  FileDown, CheckCircle2, ShieldCheck, Copy, Check,
  Printer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import type { EvidenceItem } from "@/lib/workplace/types"
import { useAuth } from "@/lib/auth/auth-context"

interface PortfolioExportDialogProps {
  evidenceItems: EvidenceItem[]
}

export function PortfolioExportDialog({ evidenceItems }: PortfolioExportDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Filter ONLY approved deliverables
  const approvedItems = evidenceItems.filter(e => e.status === "approved")

  const portfolioMarkdown = `# ADVANTCORE ACADEMY — PROFESSIONAL CASE STUDY PORTFOLIO
**Learner:** ${user?.fullName || "Amanda Okafor"}  
**Pathway:** Business Analyst Career Accelerator  
**Accreditation Alignment:** BCS Foundation Certificate in Business Analysis  
**Project Reference:** ADV-BA-001 (Enquiry-to-delivery process transformation)  
**Verification Date:** ${new Date().toISOString().split("T")[0]}  

---

> [!IMPORTANT]
> **DISCLAIMER & NON-EMPLOYMENT DISCLOSURE:**
> This case study compiles assessed and independently reviewed project deliverables completed within the Advantcore Academy simulated workplace environment. This reflects practical, verified competence in business analysis techniques, not direct commercial employment at Advantcore Ltd.

---

## Executive Summary
This portfolio demonstrates end-to-end business analysis capabilities across problem framing, stakeholder power-interest mapping, RACI governance, As-Is and To-Be process modelling, functional requirements catalogues, and business case financial appraisals.

---

${approvedItems
  .map(
    (item, idx) => `### Deliverable ${idx + 1}: ${item.title}
**Status:** Approved by Independent Reviewer  
**Stage:** Stage ${item.stageNumber}  
**Version:** v${item.version}.0  

${item.content}

*Reviewer Audit Sign-off: ${item.reviewerDecision?.reviewerName || "Helen Grant (Independent Reviewer)"} — "${item.reviewerDecision?.comment || "Verified against BCS Professional Standards."}"*

---`
  )
  .join("\n\n")}`

  function handleCopy() {
    navigator.clipboard.writeText(portfolioMarkdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="primary-action">
          <FileDown className="w-4 h-4 mr-1.5" /> Export portfolio case study
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold">
              <ShieldCheck className="w-4 h-4" /> Verified Evidence Portfolio
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
              {approvedItems.length} Approved Deliverables
            </Badge>
          </div>
          <DialogTitle className="text-base sm:text-lg">Advantcore BA Case Study Portfolio</DialogTitle>
          <DialogDescription className="text-xs">
            An exportable executive case study compiling only independently verified deliverables. Unapproved drafts and internal drafts are strictly excluded.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-xs space-y-1">
            <strong className="text-amber-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Non-Employment Statement:
            </strong>
            <p className="text-muted-foreground leading-relaxed">
              This portfolio represents assessed simulated workplace project experience completed at Advantcore Academy, not direct employment.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-muted/30 max-h-80 sm:max-h-96 overflow-y-auto text-xs font-mono whitespace-pre-wrap leading-relaxed">
            {portfolioMarkdown}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 pt-3">
          <Button variant="outline" className="w-full sm:w-auto h-9" onClick={() => setOpen(false)}>
            Close
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button size="sm" variant="outline" className="w-full sm:w-auto h-9" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1.5" /> Print PDF
            </Button>
            <Button size="sm" className="primary-action w-full sm:w-auto h-9 font-bold" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? "Copied Markdown!" : "Copy markdown"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
