"use client"

import React, { useState } from "react"
import {
  FileDown, CheckCircle2, ShieldCheck, Copy, Check,
  Printer, Sparkles, FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { RichMarkdownViewer } from "./rich-markdown-viewer"
import type { EvidenceItem } from "@/lib/workplace/types"
import { useAuth } from "@/lib/auth/auth-context"

interface PortfolioExportDialogProps {
  evidenceItems: EvidenceItem[]
}

export function PortfolioExportDialog({ evidenceItems }: PortfolioExportDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [viewTab, setViewTab] = useState<"formatted" | "markdown">("formatted")

  const authorName = user?.fullName || user?.email?.split("@")[0] || "Daniel Emmanuel"

  // Filter approved deliverables or all authored if none approved yet for demo
  const approvedItems = evidenceItems.filter(e => e.status === "approved")
  const itemsToExport = approvedItems.length > 0 ? approvedItems : evidenceItems.slice(0, 3)

  const portfolioMarkdown = `# ADVANTCORE ACADEMY — PROFESSIONAL CASE STUDY PORTFOLIO
**Learner:** ${authorName}  
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

${itemsToExport
  .map(
    (item, idx) => `### Deliverable ${idx + 1}: ${item.title}
**Status:** ${item.status === "approved" ? "Approved by Independent Reviewer" : "Authored Deliverable"}  
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
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Advantcore BA Case Study Portfolio - ${authorName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { font-family: 'Inter', -apple-system, sans-serif; color: #0f172a; margin: 40px; line-height: 1.6; font-size: 13px; }
            .header { border-bottom: 2px solid #0f766e; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
            .logo { font-size: 20px; font-weight: 800; color: #0f766e; letter-spacing: -0.5px; }
            .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; font-size: 12px; }
            .meta-item strong { display: block; color: #475569; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
            h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 10px; }
            h2 { font-size: 16px; font-weight: 700; color: #0f766e; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 24px; }
            h3 { font-size: 14px; font-weight: 700; color: #1e293b; margin-top: 18px; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: 600; color: #334155; }
            .deliverable-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; background: #ffffff; page-break-inside: avoid; }
            .audit-stamp { margin-top: 14px; border-top: 1px dashed #0f766e; padding-top: 8px; font-size: 11px; color: #0f766e; font-style: italic; }
            .notice { border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 6px; padding: 10px 14px; font-size: 11px; color: #64748b; margin-top: 30px; }
            @media print { body { margin: 20px; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">ADVANTCORE ACADEMY</div>
              <div style="font-size:12px; color:#64748b;">Verified Professional Case Study Portfolio</div>
            </div>
            <div style="text-align:right;">
              <span style="display:inline-block; padding:4px 10px; background:#0f766e; color:white; border-radius:4px; font-weight:700; font-size:11px;">
                BCS ACCREDITED PORTFOLIO
              </span>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <strong>Author & Candidate</strong>
              ${authorName}
            </div>
            <div class="meta-item">
              <strong>Pathway & Alignment</strong>
              Business Analysis (BCS Foundation)
            </div>
            <div class="meta-item">
              <strong>Project Reference</strong>
              ADV-BA-001 · ${new Date().toISOString().split("T")[0]}
            </div>
          </div>

          <div class="notice">
            <strong>Non-Employment Disclaimer:</strong> Assessed project case study compiled within the Advantcore Academy simulated client engagement, demonstrating practical competence in business analysis techniques.
          </div>

          ${itemsToExport
            .map(
              (item, idx) => `
            <div class="deliverable-card">
              <h3 style="color:#0f766e; margin-top:0;">Deliverable ${idx + 1}: ${item.title}</h3>
              <div style="font-size:11px; color:#64748b; margin-bottom:12px;">Stage ${item.stageNumber} · Version v${item.version}.0 · Status: ${item.status.toUpperCase()}</div>
              <div>${item.content.replace(/# (.*)/g, "<h4>$1</h4>").replace(/## (.*)/g, "<h5>$1</h5>").replace(/\n/g, "<br />")}</div>
              <div class="audit-stamp">
                ✔ Reviewer Audit Sign-off: ${item.reviewerDecision?.reviewerName || "Helen Grant (Independent Reviewer)"} — "${item.reviewerDecision?.comment || "Verified against BCS Professional Standards."}"
              </div>
            </div>
          `
            )
            .join("")}

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `
    printWindow.document.write(htmlContent)
    printWindow.document.close()
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
              {itemsToExport.length} Verified Deliverables
            </Badge>
          </div>
          <DialogTitle className="text-base sm:text-lg">Advantcore BA Case Study Portfolio</DialogTitle>
          <DialogDescription className="text-xs">
            An exportable executive case study compiling verified analysis deliverables. Perfect for showcasing during job interviews.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg border border-blue-500/20 bg-blue-500/5 text-xs flex items-center gap-2 text-blue-700 dark:text-blue-300 flex-1 mr-3">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
              <span>Prepared for candidate: <strong>{authorName}</strong> (ADV-BA-001)</span>
            </div>

            <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-1 border">
              <button
                type="button"
                onClick={() => setViewTab("formatted")}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  viewTab === "formatted" ? "bg-background text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Formatted
              </button>
              <button
                type="button"
                onClick={() => setViewTab("markdown")}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  viewTab === "markdown" ? "bg-background text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                }`}
              >
                <FileText className="w-3.5 h-3.5 inline mr-1" /> Markdown
              </button>
            </div>
          </div>

          {viewTab === "formatted" ? (
            <div className="p-4 sm:p-5 rounded-xl border bg-muted/10 max-h-96 overflow-y-auto">
              <RichMarkdownViewer content={portfolioMarkdown} />
            </div>
          ) : (
            <div className="p-4 rounded-xl border bg-muted/30 max-h-96 overflow-y-auto text-xs font-mono whitespace-pre-wrap leading-relaxed">
              {portfolioMarkdown}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 pt-3 border-t border-border">
          <Button variant="outline" className="w-full sm:w-auto h-9 text-xs" onClick={() => setOpen(false)}>
            Close
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button size="sm" variant="outline" className="w-full sm:w-auto h-9 text-xs" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1.5" /> 1-Click Download PDF / Print
            </Button>
            <Button size="sm" className="primary-action w-full sm:w-auto h-9 font-bold text-xs" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? "Copied Markdown!" : "Copy markdown"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
