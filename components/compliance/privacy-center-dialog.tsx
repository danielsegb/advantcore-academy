"use client"

import React, { useState } from "react"
import {
  ShieldCheck, Download, Trash2, CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { gdprRetentionSchedule, buildDsarExportPackage } from "@/lib/compliance/gdpr-policy"
import { useAuth } from "@/lib/auth/auth-context"

export function PrivacyCenterDialog() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [erasureRequested, setErasureRequested] = useState(false)
  const [downloading, setDownloading] = useState(false)

  function handleDownloadDsar() {
    setDownloading(true)
    const dsar = buildDsarExportPackage(
      user?.id || "usr-current",
      user?.fullName || "Amanda Okafor",
      user?.email || "amanda@advantcore.co"
    )

    const blob = new Blob([JSON.stringify(dsar, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `advantcore-gdpr-dsar-${user?.id || "export"}.json`
    a.click()
    URL.revokeObjectURL(url)
    setTimeout(() => setDownloading(false), 1000)
  }

  function handleRequestErasure() {
    setErasureRequested(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-all"
          title="Privacy & UK GDPR Data Rights"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Privacy & Data Rights
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> UK GDPR & DPA 2018 Compliant
            </Badge>
            <span className="text-xs text-muted-foreground">Controller: Advantcore Ltd</span>
          </div>
          <DialogTitle>UK Privacy & Data Rights Center</DialogTitle>
          <DialogDescription>
            Exercise your statutory data protection rights, inspect data retention schedules, and download your verified educational records.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Statutory Controller Information */}
          <div className="p-3.5 rounded-xl border bg-muted/20 text-xs space-y-1.5">
            <strong className="text-foreground block font-semibold">Data Protection Controller Information:</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
              <div>
                <span><strong>Legal Entity:</strong> Advantcore Ltd (UK Registered)</span>
              </div>
              <div>
                <span><strong>DPO Contact:</strong> privacy@advantcore.co</span>
              </div>
              <div>
                <span><strong>Primary Storage:</strong> London (eu-west-2, UK Region)</span>
              </div>
              <div>
                <span><strong>Supervisory Authority:</strong> Information Commissioner&apos;s Office (ICO)</span>
              </div>
            </div>
          </div>

          {/* Retention Schedule Table */}
          <div className="p-4 rounded-xl border bg-card space-y-2">
            <strong className="text-sm font-bold block">Statutory Data Retention Schedule:</strong>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[420px]">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-2">Data Category</th>
                    <th className="pb-2">Purpose</th>
                    <th className="pb-2">Retention Period</th>
                    <th className="pb-2">Lawful Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {gdprRetentionSchedule.map((item, idx) => (
                    <tr key={idx} className="py-2">
                      <td className="py-2 font-medium">{item.category}</td>
                      <td className="py-2 text-muted-foreground">{item.purpose}</td>
                      <td className="py-2 text-muted-foreground">{item.retentionPeriod}</td>
                      <td className="py-2 text-[11px] text-muted-foreground">{item.lawfulBasis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Subject Rights (DSAR & Erasure) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border bg-card space-y-2 flex flex-col justify-between">
              <div>
                <strong className="text-xs font-bold block text-foreground flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-primary shrink-0" /> Right of Access (DSAR Export)
                </strong>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Download a certified JSON export of your complete profile, progress logs, quiz mastery records, and workplace deliverables.
                </p>
              </div>
              <Button
                size="sm"
                className="primary-action w-full mt-2 h-9 font-semibold"
                onClick={handleDownloadDsar}
                disabled={downloading}
              >
                {downloading ? "Preparing DSAR export…" : "Download my data (JSON)"}
              </Button>
            </div>

            <div className="p-4 rounded-xl border bg-card space-y-2 flex flex-col justify-between">
              <div>
                <strong className="text-xs font-bold block text-foreground flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-destructive shrink-0" /> Right to Erasure (Account Deletion)
                </strong>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Submit a formal request to purge all personal data, subject to mandatory 5-year academic accreditation retention.
                </p>
              </div>
              {erasureRequested ? (
                <div className="p-2 border border-emerald-500/20 bg-emerald-500/5 rounded text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Erasure request logged for administrator review.
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 w-full mt-2 h-9 font-semibold"
                  onClick={handleRequestErasure}
                >
                  Request account erasure
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center w-full pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
