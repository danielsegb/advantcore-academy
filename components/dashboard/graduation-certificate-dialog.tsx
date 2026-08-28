"use client"

import React, { useState } from "react"
import {
  Award, ShieldCheck, Printer, Share2, Copy, Check,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { ConfettiCelebration } from "@/components/shared/confetti-celebration"
import { useAuth } from "@/lib/auth/auth-context"

interface GraduationCertificateDialogProps {
  overallScore?: number
}

export function GraduationCertificateDialog({ overallScore = 100 }: GraduationCertificateDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const candidateName = user?.fullName || user?.email?.split("@")[0] || "Daniel Emmanuel"
  const certId = `ADV-BA-${new Date().getFullYear()}-${Math.abs((user?.id || "usr-01").split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0) % 90000 + 10000)}`
  const issueDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (isOpen) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3500)
    }
  }

  function handleCopyVerifyLink() {
    const link = `https://app.advantcore.co/academy/verify?id=${certId}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleAddToLinkedIn() {
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
      "Business Analysis Career Accelerator"
    )}&organizationName=${encodeURIComponent(
      "Advantcore Academy"
    )}&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certId=${certId}&certUrl=${encodeURIComponent(
      `https://app.advantcore.co/academy/verify?id=${certId}`
    )}`
    window.open(url, "_blank")
  }

  function handlePrintCertificate() {
    const printWin = window.open("", "_blank")
    if (!printWin) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Advantcore Certificate - ${candidateName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Inter:wght@400;500;600;700&family=Pinyon+Script&display=swap');
            @page { size: landscape; margin: 0; }
            body {
              margin: 0;
              padding: 40px;
              background-color: #f8fafc;
              font-family: 'Inter', sans-serif;
              color: #0f172a;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .cert-outer {
              border: 12px solid #0f766e;
              padding: 6px;
              background: #ffffff;
              width: 960px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.08);
              box-sizing: border-box;
            }
            .cert-inner {
              border: 2px solid #f59e0b;
              padding: 40px 48px;
              text-align: center;
              position: relative;
              background: radial-gradient(circle at center, #ffffff 0%, #fafafa 100%);
            }
            .cert-logo {
              font-family: 'Cinzel', serif;
              font-size: 22px;
              font-weight: 800;
              letter-spacing: 3px;
              color: #0f766e;
              margin-bottom: 8px;
            }
            .cert-tagline {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #64748b;
              margin-bottom: 24px;
            }
            .cert-title {
              font-family: 'Cinzel', serif;
              font-size: 24px;
              font-weight: 700;
              color: #1e293b;
              letter-spacing: 1.5px;
              margin-bottom: 12px;
            }
            .cert-presented {
              font-size: 13px;
              color: #475569;
              font-style: italic;
              margin-bottom: 12px;
            }
            .candidate-name {
              font-family: 'Cinzel', serif;
              font-size: 34px;
              font-weight: 800;
              color: #0f766e;
              border-bottom: 2px solid #f59e0b;
              display: inline-block;
              padding: 0 40px 6px 40px;
              margin-bottom: 18px;
            }
            .cert-copy {
              font-size: 13px;
              color: #334155;
              max-width: 680px;
              margin: 0 auto 28px auto;
              line-height: 1.6;
            }
            .meta-bar {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 36px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
            .sig-block {
              text-align: center;
              width: 220px;
            }
            .sig-line {
              border-top: 1px solid #94a3b8;
              margin-top: 6px;
              padding-top: 4px;
              font-size: 11px;
              color: #475569;
            }
            .sig-name {
              font-family: 'Pinyon Script', cursive;
              font-size: 24px;
              color: #0f766e;
              line-height: 1;
            }
            .seal-container {
              width: 100px;
              height: 100px;
              border: 3px solid #f59e0b;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: #fffbeb;
              color: #b45309;
              box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
            }
            .seal-star { font-size: 16px; }
            .seal-text { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
            .footer-verify {
              margin-top: 20px;
              font-size: 10px;
              color: #94a3b8;
              letter-spacing: 0.5px;
            }
            @media print {
              body { padding: 0; background: none; }
              .cert-outer { box-shadow: none; border-width: 8px; width: 100%; height: 100vh; }
            }
          </style>
        </head>
        <body>
          <div class="cert-outer">
            <div class="cert-inner">
              <div class="cert-logo">ADVANTCORE ACADEMY</div>
              <div class="cert-tagline">Executive Career Acceleration & Professional Standards</div>

              <div class="cert-title">CERTIFICATE OF CAREER READINESS & PRACTICAL COMPETENCE</div>
              <div class="cert-presented">This is to officially certify that</div>

              <div class="candidate-name">${candidateName}</div>

              <div class="cert-copy">
                has successfully completed all required curriculum modules, verified workplace project deliverables on <strong>ADV-BA-001</strong>, and demonstrated professional mastery against the <strong>BCS Foundation Certificate in Business Analysis</strong> examination syllabus.
              </div>

              <div class="meta-bar">
                <div class="sig-block">
                  <div class="sig-name">Sarah Mitchell</div>
                  <div class="sig-line">
                    <strong>Sarah Mitchell</strong><br />
                    Executive Sponsor & Director
                  </div>
                </div>

                <div class="seal-container">
                  <div class="seal-star">★ ★ ★</div>
                  <div class="seal-text">VERIFIED</div>
                  <div class="seal-text" style="font-size:7px;">BCS ALIGNED</div>
                </div>

                <div class="sig-block">
                  <div class="sig-name">Marcus Cole</div>
                  <div class="sig-line">
                    <strong>Marcus Cole</strong><br />
                    Lead BA Assessor & Supervisor
                  </div>
                </div>
              </div>

              <div class="footer-verify">
                Credential ID: <strong>${certId}</strong> · Issued: ${issueDate} · Registry: app.advantcore.co/academy/verify
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `
    printWin.document.write(htmlContent)
    printWin.document.close()
  }

  return (
    <>
      <ConfettiCelebration active={showConfetti} durationMs={3500} />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-1.5 h-10 font-bold border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10">
            <Award className="w-4 h-4 text-amber-500" /> Digital Certificate & Badge
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-xs gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Verified Digital Credential · {overallScore}% Readiness
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">ID: {certId}</span>
            </div>
            <DialogTitle className="text-base sm:text-lg">Advantcore Academy Verified Certificate</DialogTitle>
            <DialogDescription className="text-xs">
              A tamper-proof credential verifying comprehensive syllabus mastery, simulated client delivery (ADV-BA-001), and BCS professional alignment.
            </DialogDescription>
          </DialogHeader>

          {/* Certificate Graphical Preview Card */}
          <div className="p-6 sm:p-8 rounded-2xl border-4 border-double border-amber-500/40 bg-gradient-to-b from-card via-card to-amber-500/5 text-center space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
              <Award className="w-32 h-32 text-amber-500" />
            </div>

            <div className="space-y-1">
              <span className="font-serif font-black tracking-widest text-primary text-xs sm:text-sm uppercase block">
                Advantcore Academy
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-foreground">
                Certificate of Career Readiness & Practical Competence
              </h2>
            </div>

            <p className="text-xs text-muted-foreground italic">Presented to</p>

            <div className="font-serif font-bold text-xl sm:text-2xl text-foreground pb-1 border-b-2 border-amber-500/50 inline-block px-6">
              {candidateName}
            </div>

            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              For demonstrated competence in Business Analysis methodologies, RACI governance, stakeholder management, and project execution on <strong>ADV-BA-001</strong> in full alignment with the <strong>BCS Foundation Examination</strong> standards.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/60 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground block text-[11px] uppercase">Supervisors</strong>
                <span>Sarah Mitchell & Marcus Cole</span>
              </div>
              <div>
                <strong className="text-foreground block text-[11px] uppercase">Issued On</strong>
                <span>{issueDate}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Registered on Advantcore Immutable Verification Registry.</span>
            </div>
            <Badge variant="outline" className="text-[11px] shrink-0">Official BCS Alignment</Badge>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 pt-3 border-t border-border">
            <Button variant="outline" size="sm" className="w-full sm:w-auto h-9 text-xs" onClick={() => setOpen(false)}>
              Close
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button size="sm" variant="outline" className="h-9 text-xs font-semibold" onClick={handleCopyVerifyLink}>
                {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                {copied ? "Link Copied!" : "Copy Verify URL"}
              </Button>
              <Button size="sm" variant="outline" className="h-9 text-xs font-semibold text-blue-600 border-blue-500/30" onClick={handleAddToLinkedIn}>
                <Share2 className="w-3.5 h-3.5 mr-1.5" /> Add to LinkedIn
              </Button>
              <Button size="sm" className="primary-action h-9 text-xs font-bold" onClick={handlePrintCertificate}>
                <Printer className="w-3.5 h-3.5 mr-1.5" /> 1-Click Print / PDF
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
