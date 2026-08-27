"use client"

import React, { useState } from "react"
import {
  CheckCircle2, Bookmark, Award, Search, BookOpen,
  FileText, ChevronRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fullResourceDocuments, type ResourceDocumentDetail } from "@/lib/learning/resource-documents"

export function ResourceLibrary() {
  const [selectedDoc, setSelectedDoc] = useState<ResourceDocumentDetail>(fullResourceDocuments[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"overview" | "reader">("reader")

  const filteredDocs = fullResourceDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeSection = activeSectionId
    ? selectedDoc.sections.find(s => s.id === activeSectionId) || selectedDoc.sections[0]
    : selectedDoc.sections[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-[#183f35]/20 shadow-sm text-white"
        style={{ background: "linear-gradient(135deg, #183f35 0%, #0e2820 100%)" }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white border-white/30 text-xs">
              Complete Knowledge & Reference Hub
            </Badge>
            <span className="text-xs opacity-70">· 5 Full Text Guides & BCS Textbook Study Packs</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Programme Library & Source Materials</h2>
          <p className="text-xs opacity-80 max-w-2xl leading-relaxed">
            Access the complete syllabus study guides, official BCS 4th Edition textbook notes, delivery toolkits, mock examination keys, and job landing playbooks directly on the platform.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guides & chapters..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      {/* Grid: Master List on Left, Interactive Viewer on Right */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Document Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Available Resource Packs ({filteredDocs.length})
          </div>
          {filteredDocs.map(doc => {
            const isSelected = selectedDoc.id === doc.id
            return (
              <button
                type="button"
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc)
                  setActiveSectionId(doc.sections[0]?.id || null)
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-card border-primary ring-2 ring-primary/40 shadow-sm"
                    : "bg-card/50 border-border hover:bg-card hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                    {doc.documentType}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{doc.version.split("|")[0].trim()}</span>
                </div>
                <div className="font-semibold text-sm text-foreground line-clamp-1">{doc.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                  {doc.description}
                </div>
                <div className="flex items-center gap-1 mt-2.5 text-[11px] text-primary font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{doc.sections.length} readable chapters / sections</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Column: Active Document Viewer / Reader */}
        <div className="lg:col-span-8">
          <Card className="border shadow-xs flex flex-col h-full">
            <CardHeader className="space-y-3 border-b pb-4 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {selectedDoc.documentType} Pack
                  </Badge>
                  <span className="text-xs text-muted-foreground">{selectedDoc.version}</span>
                </div>
                {/* View Mode Toggle */}
                <div className="flex gap-1 bg-muted p-1 rounded-lg border text-xs">
                  <button
                    type="button"
                    className={`px-2.5 py-1 rounded font-medium transition-all ${viewMode === "reader" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setViewMode("reader")}
                  >
                    <BookOpen className="w-3.5 h-3.5 inline mr-1" /> Full Reader
                  </button>
                  <button
                    type="button"
                    className={`px-2.5 py-1 rounded font-medium transition-all ${viewMode === "overview" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setViewMode("overview")}
                  >
                    <FileText className="w-3.5 h-3.5 inline mr-1" /> Overview
                  </button>
                </div>
              </div>

              <div>
                <CardTitle className="text-xl font-bold text-foreground">{selectedDoc.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed text-muted-foreground mt-1">
                  {selectedDoc.subtitle}
                </CardDescription>
              </div>

              {/* Section Tabs inside Reader */}
              {viewMode === "reader" && selectedDoc.sections.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto pt-2 pb-1 border-t">
                  {selectedDoc.sections.map((section, idx) => {
                    const isActive = (activeSectionId || selectedDoc.sections[0].id) === section.id
                    return (
                      <button
                        type="button"
                        key={section.id}
                        onClick={() => setActiveSectionId(section.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span className="opacity-80">#{idx + 1}</span>
                        <span>{section.title.split(":")[0].replace(/^\d+\.\s*/, "")}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardHeader>

            <CardContent className="p-6 flex-1 flex flex-col">
              {viewMode === "overview" ? (
                <div className="space-y-6">
                  {/* Document Overview */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Overview & Scope
                    </div>
                    <p className="text-xs text-foreground leading-relaxed bg-muted/20 p-4 rounded-xl border">
                      {selectedDoc.description}
                    </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="p-4 rounded-xl bg-muted/40 border space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      Key Standards & Syllabus References
                    </div>
                    <ul className="space-y-1.5">
                      {selectedDoc.keyHighlights.map((highlight, idx) => (
                        <li key={idx} className="text-xs flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Table of Contents */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4" />
                      Document Contents & Sections ({selectedDoc.sections.length})
                    </div>
                    <div className="space-y-2">
                      {selectedDoc.sections.map((section, idx) => (
                        <div
                          key={section.id}
                          onClick={() => {
                            setActiveSectionId(section.id)
                            setViewMode("reader")
                          }}
                          className="p-3 rounded-lg border bg-background hover:border-primary/50 transition-all text-xs font-medium flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-foreground">{section.title}</span>
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-primary">
                            Read <ChevronRight className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Full Text Reader View */
                <div className="flex-1 flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {activeSection?.title}
                    </h3>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      Full Study Text
                    </Badge>
                  </div>

                  <div className="flex-1 min-h-[350px] max-h-[500px] overflow-y-auto pr-2 space-y-3 text-xs leading-relaxed text-foreground font-sans bg-background p-4 rounded-xl border">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs space-y-2 whitespace-pre-wrap">
                      {activeSection?.content}
                    </div>
                  </div>

                  {/* Section Navigator Footer */}
                  <div className="flex items-center justify-between pt-3 border-t text-xs">
                    <span className="text-muted-foreground">
                      Section {selectedDoc.sections.findIndex(s => s.id === activeSection?.id) + 1} of {selectedDoc.sections.length}
                    </span>
                    <div className="flex gap-2">
                      {selectedDoc.sections.findIndex(s => s.id === activeSection?.id) > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const currentIdx = selectedDoc.sections.findIndex(s => s.id === activeSection?.id)
                            setActiveSectionId(selectedDoc.sections[currentIdx - 1].id)
                          }}
                        >
                          Previous Section
                        </Button>
                      )}
                      {selectedDoc.sections.findIndex(s => s.id === activeSection?.id) < selectedDoc.sections.length - 1 && (
                        <Button
                          size="sm"
                          className="primary-action"
                          onClick={() => {
                            const currentIdx = selectedDoc.sections.findIndex(s => s.id === activeSection?.id)
                            setActiveSectionId(selectedDoc.sections[currentIdx + 1].id)
                          }}
                        >
                          Next Section
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
