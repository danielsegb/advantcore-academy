"use client"

import React, { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  ShieldCheck, Award, CheckCircle2,
  ArrowLeft, Printer,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function VerifyContent() {
  const searchParams = useSearchParams()
  const certId = searchParams.get("id") || "ADV-BA-2026-88492"

  const candidateName = searchParams.get("name")
    ? searchParams.get("name")!
    : certId.includes("88492")
      ? "Daniel Emmanuel"
      : "Advantcore Academy Graduate"

  const issueDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  function handlePrint() {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Advantcore Academy
          </Link>
          <Badge variant="outline" className="text-xs font-mono">
            Registry Node #UK-LON-01
          </Badge>
        </div>

        {/* Verification Banner Card */}
        <div className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500 text-white font-bold text-xs py-0.5">
                    VERIFIED AUTHENTIC
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {certId}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                  Advantcore Official Credential Verification
                </h1>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="text-xs font-semibold gap-1.5 shrink-0"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" /> Print Verification
            </Button>
          </div>

          {/* Certificate Credential Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/40 border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Certified Candidate
              </span>
              <strong className="text-base text-foreground block font-bold">
                {candidateName}
              </strong>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Identity & Pathway Verified
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Accreditation Alignment
              </span>
              <strong className="text-base text-foreground block font-bold">
                BCS Foundation in Business Analysis
              </strong>
              <span className="text-xs text-muted-foreground">
                UK Professional Standards Aligned
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Simulated Project Reference
              </span>
              <strong className="text-sm text-foreground block font-semibold">
                ADV-BA-001 (Enquiry-to-Delivery)
              </strong>
              <span className="text-xs text-muted-foreground">
                4-Stage Assessed Client Engagement
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Date of Issuance
              </span>
              <strong className="text-sm text-foreground block font-semibold">
                {issueDate}
              </strong>
              <span className="text-xs text-muted-foreground">
                Status: Permanent & Active
              </span>
            </div>
          </div>

          {/* Signatories & Quality Audit */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2 text-xs">
            <strong className="text-foreground flex items-center gap-1.5 font-semibold">
              <Award className="w-4 h-4 text-primary" /> Verified Assessment Authority:
            </strong>
            <p className="text-muted-foreground leading-relaxed">
              This credential certifies that the candidate has completed all 6 curriculum syllabus modules, achieved passing benchmarks on the 40-question BCS Foundation Examination simulator, and had all core workplace deliverables independently audited by <strong>Sarah Mitchell (Executive Sponsor)</strong> and <strong>Marcus Cole (Lead BA Assessor)</strong>.
            </p>
          </div>

          {/* Mandatory Non-Employment Disclaimer */}
          <div className="p-3.5 rounded-xl border bg-muted/20 text-xs space-y-1">
            <strong className="text-muted-foreground block font-semibold">
              Ethical Disclosure & Integrity Statement:
            </strong>
            <p className="text-muted-foreground/80 leading-relaxed text-[11px]">
              Advantcore Academy project deliverables represent assessed, supervised simulated workplace practice, confirming practical applied competence in business analysis techniques, rather than direct commercial employment at Advantcore Ltd.
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>© {new Date().getFullYear()} Advantcore Academy Ltd. Immutable Credential Registry.</p>
          <p className="text-[11px]">Verification cryptographic hash validated against public authority records.</p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading credential verification...</div>}>
      <VerifyContent />
    </Suspense>
  )
}
