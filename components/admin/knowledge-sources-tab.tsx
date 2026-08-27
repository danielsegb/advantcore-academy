"use client"

import React, { useState } from "react"
import {
  FileText, ShieldCheck, Plus,
  Calendar, Link as LinkIcon, ExternalLink,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

interface KnowledgeSource {
  id: string
  title: string
  docType: string
  version: string
  verificationDate: string
  usageRights: string
  sourceUrl?: string
  isApproved: boolean
}

export function KnowledgeSourcesTab() {
  const [sources, setSources] = useState<KnowledgeSource[]>([
    {
      id: "src-1",
      title: "BCS Foundation Certificate in Business Analysis Syllabus",
      docType: "Official Syllabus",
      version: "v4.2 (2026)",
      verificationDate: "2026-08-27",
      usageRights: "Official Accredited Syllabus Reference",
      sourceUrl: "https://www.bcs.org/qualifications-and-certifications/certifications-for-professionals/business-analysis/foundation-certificate-in-business-analysis/",
      isApproved: true,
    },
    {
      id: "src-2",
      title: "Advantcore Enquiry-to-Delivery Standard Operating Procedure",
      docType: "Company Policy",
      version: "v2.0",
      verificationDate: "2026-08-12",
      usageRights: "Advantcore Ltd Proprietary",
      isApproved: true,
    },
    {
      id: "src-3",
      title: "Stakeholder Management & Power-Interest Guidelines",
      docType: "Practice Guide",
      version: "v1.1",
      verificationDate: "2026-08-20",
      usageRights: "Internal Academy Practice Material",
      isApproved: true,
    },
  ])

  const [addOpen, setAddOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [docType, setDocType] = useState("Syllabus")
  const [version, setVersion] = useState("v1.0")
  const [usageRights, setUsageRights] = useState("Accredited Educational Reference")
  const [sourceUrl, setSourceUrl] = useState("")

  function handleAddSource(e: React.FormEvent) {
    e.preventDefault()
    setSources(prev => [
      ...prev,
      {
        id: `src-${Date.now()}`,
        title,
        docType,
        version,
        verificationDate: new Date().toISOString().split("T")[0],
        usageRights,
        sourceUrl: sourceUrl || undefined,
        isApproved: true,
      },
    ])
    setAddOpen(false)
    setTitle("")
    setSourceUrl("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Approved Knowledge Sources & Syllabuses</h2>
          <p className="text-sm text-muted-foreground">
            All AI responses, quizzes, and project rubrics are strictly grounded in these verified sources.
          </p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="primary-action">
              <Plus className="w-4 h-4 mr-1.5" /> Register source
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleAddSource} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Register approved knowledge source</DialogTitle>
                <DialogDescription>
                  Enter the verified source metadata. AI characters will ground their knowledge exclusively in approved materials.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Document / Syllabus Title
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                    placeholder="e.g. BCS Business Analysis Syllabus"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-medium">
                    Document Type
                    <select
                      value={docType}
                      onChange={e => setDocType(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                    >
                      <option>Official Syllabus</option>
                      <option>Company Policy</option>
                      <option>Practice Guide</option>
                      <option>Assessment Rubric</option>
                    </select>
                  </label>

                  <label className="block text-sm font-medium">
                    Version
                    <input
                      type="text"
                      required
                      value={version}
                      onChange={e => setVersion(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                      placeholder="e.g. v4.2"
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium">
                  Usage / Copyright Rights
                  <input
                    type="text"
                    required
                    value={usageRights}
                    onChange={e => setUsageRights(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                    placeholder="e.g. Authorized Educational Reference"
                  />
                </label>

                <label className="block text-sm font-medium">
                  Reference URL
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={e => setSourceUrl(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                    placeholder="https://..."
                  />
                </label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="primary-action">
                  Save approved source
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map(src => (
          <article key={src.id} className="p-4 border rounded-xl bg-card space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-primary/10 text-primary">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">{src.title}</h3>
                  <Badge variant="outline" className="mt-1 text-[11px]">
                    {src.docType} · {src.version}
                  </Badge>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Approved
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t">
              <div className="flex items-center justify-between">
                <span>Rights: {src.usageRights}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Verified {src.verificationDate}
                </span>
              </div>
              {src.sourceUrl && (
                <div className="pt-1">
                  <a
                    href={src.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <LinkIcon className="w-3 h-3" /> View accredited source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
