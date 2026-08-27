"use client"

import React, { useState } from "react"
import {
  CheckCircle2, Bookmark, Award, Search,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResourceDoc {
  id: string
  title: string
  subtitle: string
  documentType: "Handbook" | "Study Guide" | "Toolkit" | "Playbook" | "Textbook"
  version: string
  description: string
  tableOfContents: string[]
  keyHighlights: string[]
  textbookChapters?: string[]
}

const programmeResources: ResourceDoc[] = [
  {
    id: "doc-01",
    title: "01. Advantcore BA Programme Handbook",
    subtitle: "The 12-Week Business Analyst Programme (Learn, Deliver, Prove, Land)",
    documentType: "Handbook",
    version: "Version 1.0 | Advantcore Ltd Manchester",
    description: "Converts learning into verifiable evidence of business analysis capability. Governs the 12-week schedule, weekly study allocations (10-15 hrs/wk), project governance, and factual reference criteria.",
    tableOfContents: [
      "1. Programme Promise and Boundaries (Learn, Deliver, Prove, Land)",
      "2. 12-Week Master Pathway Milestones & Review Gates",
      "3. Client Context: Advantcore Client Enquiry-to-Delivery Transformation",
      "4. Stakeholder Team: Sarah Mitchell, Marcus Cole, Priya Shah, Helen Grant",
      "5. Portfolio Standards & Non-Employment Compliance",
    ],
    keyHighlights: [
      "BCS Foundation Certificate in Business Analysis primary syllabus target",
      "Rigorous quality gates: Knowledge, Project, Conduct, and Portfolio gates",
      "Advantcore digital agency and bespoke software delivery operational model",
    ],
  },
  {
    id: "doc-02",
    title: "02. BCS Foundation Study Guide & Timed Mocks",
    subtitle: "14-Module Syllabus Revision Notes, Practice Scenarios & Timed Mocks",
    documentType: "Study Guide",
    version: "Version 1.0 | BCS 4th Edition Aligned",
    description: "Structured revision guide matching the official BCS syllabus. Includes closed-book recall guidelines, 8-week certification plan, and two 40-question mock exams (Mock A and Mock B).",
    tableOfContents: [
      "1. 8-Week Certification Schedule & Syllabus Mapping",
      "2. Modules 1-3: Lifecycle, Competencies & Strategy Analysis",
      "3. Modules 4-6: Investigation Techniques & Stakeholder Management",
      "4. Modules 7-8: Process Modelling (BPMN Swimlanes) & Options Appraisal",
      "5. Modules 9-10: Business Case Development & Requirements Engineering",
      "6. Modules 11-14: Requirements Validation, Traceability, UAT & Benefits",
      "7. Mock Exam A & B Answer Keys with Rationale",
    ],
    keyHighlights: [
      "Official BCS Examination: 40 questions, 60 minutes, 65% pass mark (26/40)",
      "Topic recall logs and scenario decision frameworks",
      "Strict distinction between business problems and technical solution assumptions",
    ],
  },
  {
    id: "doc-03",
    title: "03. Advantcore BA Work Experience & Portfolio Toolkit",
    subtitle: "Editable Delivery Templates & Verified Project Deliverables",
    documentType: "Toolkit",
    version: "Version 1.0 | Advantcore Delivery Workspace",
    description: "Standard delivery pack containing 10 verified templates used on Advantcore's Enquiry-to-Delivery Transformation project. Prepares learners for independent supervisor reviews.",
    tableOfContents: [
      "Template 1: Executive Problem Statement & Context Analysis",
      "Template 2: Advantcore Project Charter & Scope Boundaries",
      "Template 3: Stakeholder Identification & RACI Governance Matrix",
      "Template 4: As-Is Process Swimlane Diagram & Pain Points",
      "Template 5: Gap Analysis & Options Appraisal Matrix",
      "Template 6: Formal Requirements Catalogue (Functional, NFR, Business)",
      "Template 7: To-Be Target Operating Process Model",
      "Template 8: Executive Business Case & Cost-Benefit Analysis",
      "Template 9: User Acceptance Testing (UAT) & Traceability Matrix",
      "Template 10: Change Impact & Transition Assessment",
    ],
    keyHighlights: [
      "10 real deliverable templates with clear acceptance criteria",
      "Direct integration with Sarah Mitchell (Sponsor) and Helen Grant (Reviewer)",
      "Factual case study building for post-programme interviews",
    ],
  },
  {
    id: "doc-04",
    title: "04. Business Analyst Job Landing Playbook",
    subtitle: "Position Verified Experience, Target BA Lanes & Ace Technical Interviews",
    documentType: "Playbook",
    version: "Version 1.0 | Career Execution Guide",
    description: "Strategic career guide mapping verified project experience to the UK job market. Details 4 target BA lanes, CV bullet formulas, STAR interview scenarios, and recruiter positioning.",
    tableOfContents: [
      "1. Choosing Your Target Lane (Digital/IT BA, Process BA, Change BA, Product BA)",
      "2. Translating Advantcore Evidence into CV & LinkedIn Bullets",
      "3. The 10 Essential BA Interview Scenarios & STAR Responses",
      "4. Whiteboard & Process Mapping Technical Assessment Prep",
      "5. Weekly Campaign Execution & Recruiter Outreach Scripts",
    ],
    keyHighlights: [
      "4 distinct career lane positioning strategies",
      "Truth in simulation guidelines (ethical representation of simulated projects)",
      "Conversion tracking metrics (applications -> screening -> interviews -> offers)",
    ],
  },
  {
    id: "doc-05",
    title: "05. Official BCS Textbook Guide (Debra Paul & James Cadle)",
    subtitle: "Business Analysis (4th Edition, BCS The Chartered Institute for IT)",
    documentType: "Textbook",
    version: "4th Edition · Official Core Reference",
    description: "The definitive textbook for business analysis certification and practice. Cross-referenced throughout the Academy's 6 curriculum modules and AI tutoring responses.",
    tableOfContents: [
      "Chapter 1: What is Business Analysis?",
      "Chapter 2: The Competencies of a Business Analyst",
      "Chapter 3: Strategy Analysis",
      "Chapter 4: The Business Analysis Process Model",
      "Chapter 5: Investigation Techniques",
      "Chapter 6: Stakeholder Analysis and Management",
      "Chapter 7: Modelling Business Processes",
      "Chapter 8: Defining the Solution",
      "Chapter 9: Making a Business Case",
      "Chapter 10: Establishing the Requirements",
      "Chapter 11: Documenting and Modelling Requirements",
      "Chapter 12: Validating and Managing Requirements",
      "Chapter 13: Delivering the Requirements",
      "Chapter 14: Delivering the Business Solution",
    ],
    keyHighlights: [
      "Debra Paul, James Cadle, Malcolm Eva, Craig Rollason, Jonathan Hunsley",
      "The authoritative reference standard for BCS Foundation exams",
      "Integrated into Academy quiz explanations and module deep-dives",
    ],
  },
]

export function ResourceLibrary() {
  const [selectedDoc, setSelectedDoc] = useState<ResourceDoc>(programmeResources[0])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocs = programmeResources.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-900/40 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary-foreground border-primary/30 text-xs">
              Complete Programme Pack
            </Badge>
            <span className="text-xs text-slate-400">· 5 Core Guides & BCS Textbook</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Programme Library & Course Materials</h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            All curriculum guides, delivery toolkits, mock examination papers, job playbooks, and the official BCS 4th Edition textbook reading guides are available here for reference.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guides & chapters..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-950/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Grid: Master List on Left, Detail Viewer on Right */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Document Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredDocs.map(doc => {
            const isSelected = selectedDoc.id === doc.id
            return (
              <button
                type="button"
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-card border-primary ring-1 ring-primary/40 shadow-sm"
                    : "bg-card/50 border-border hover:bg-card hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                    {doc.documentType}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{doc.version}</span>
                </div>
                <div className="font-semibold text-sm text-foreground line-clamp-1">{doc.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                  {doc.description}
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Column: Active Document Viewer */}
        <div className="lg:col-span-7">
          <Card className="border shadow-xs">
            <CardHeader className="space-y-2 border-b pb-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  {selectedDoc.documentType} Document
                </Badge>
                <span className="text-xs text-muted-foreground">{selectedDoc.version}</span>
              </div>
              <CardTitle className="text-xl font-bold">{selectedDoc.title}</CardTitle>
              <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                {selectedDoc.subtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Document Overview */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Overview & Purpose
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  {selectedDoc.description}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="p-4 rounded-xl bg-muted/40 border space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Key Standards & Principles
                </div>
                <ul className="space-y-1.5">
                  {selectedDoc.keyHighlights.map((highlight, idx) => (
                    <li key={idx} className="text-xs flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Table of Contents / Syllabus Structure */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4" />
                  Structure & Syllabus Sections
                </div>
                <div className="space-y-2">
                  {selectedDoc.tableOfContents.map((section, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border bg-background text-xs font-medium flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span>{section}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Verified
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
