"use client"

import React, { useState, useEffect } from "react"
import {
  RotateCw, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight,
  Shuffle, Sparkles, Bookmark, Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/auth-context"

export interface Flashcard {
  id: string
  title: string
  acronym: string
  category: "Strategy & Environment" | "Stakeholder & People" | "Process & Modelling" | "Requirements"
  examWeight: string
  definition: string
  breakdown: Array<{ key: string; name: string; description: string }>
  caseStudyExample: string
  examTrap: string
}

export const bcsFlashcardsData: Flashcard[] = [
  {
    id: "fc-01",
    title: "CATWOE Analysis",
    acronym: "CATWOE",
    category: "Strategy & Environment",
    examWeight: "High · 3-4 BCS Exam Questions",
    definition: "Used in Soft Systems Methodology to define the root definition and worldview of a business system or transformation.",
    breakdown: [
      { key: "C", name: "Customers", description: "Beneficiaries or victims of the system's output." },
      { key: "A", name: "Actors", description: "People who carry out the activities within the system." },
      { key: "T", name: "Transformation", description: "The core business process converting inputs into outputs." },
      { key: "W", name: "Worldview (Weltanschauung)", description: "The underlying perspective or belief that makes the system meaningful." },
      { key: "O", name: "Owner", description: "The authority who could decide to terminate or change the system." },
      { key: "E", name: "Environment", description: "External constraints, policies, laws, and boundaries the system must operate within." },
    ],
    caseStudyExample: "In ADV-BA-001, Customer = B2B client receiving advisory services; Owner = Sarah Mitchell (Sponsor); Transformation = Unqualified enquiry transformed into active project team.",
    examTrap: "Do NOT confuse the Actor (who performs the work) with the Owner (who has the authority to sanction or shut down the transformation).",
  },
  {
    id: "fc-02",
    title: "MoSCoW Prioritisation",
    acronym: "MoSCoW",
    category: "Requirements",
    examWeight: "Very High · Core BCS Technique",
    definition: "A dynamic prioritisation technique used to categorise business, functional, and non-functional requirements.",
    breakdown: [
      { key: "M", name: "Must Have", description: "Mandatory for go-live. Without this, the solution is illegal, unsafe, or unusable." },
      { key: "S", name: "Should Have", description: "Highly critical and important, but a viable workaround exists for initial release." },
      { key: "C", name: "Could Have", description: "Desirable enhancement; included only if time and budget permit." },
      { key: "W", name: "Won't Have (this time)", description: "Agreed to be out of scope for the current delivery increment." },
    ],
    caseStudyExample: "Must: Automated enquiry logging with timestamp; Should: One-click proposal generation; Could: Client portal self-service booking; Won't: AI automatic price estimation (deferred to Phase 2).",
    examTrap: "A 'Should Have' requirement is NOT optional—it is critical, but has a temporary workaround. 'Could Have' is truly optional.",
  },
  {
    id: "fc-03",
    title: "PESTLE Analysis",
    acronym: "PESTLE",
    category: "Strategy & Environment",
    examWeight: "High · Strategic Analysis",
    definition: "An external environmental scanning tool to identify macro factors influencing organizational strategy and projects.",
    breakdown: [
      { key: "P", name: "Political", description: "Government policy, tax changes, trade tariffs, political stability." },
      { key: "E", name: "Economic", description: "Interest rates, inflation, exchange rates, economic growth." },
      { key: "S", name: "Socio-Cultural", description: "Demographics, consumer behavior, work culture, ESG trends." },
      { key: "T", name: "Technological", description: "Automation, emerging tech, cybersecurity, infrastructure shifts." },
      { key: "L", name: "Legal", description: "GDPR, employment law, health & safety, consumer protection." },
      { key: "E", name: "Environmental", description: "Carbon reduction targets, sustainability, energy efficiency." },
    ],
    caseStudyExample: "Advantcore applies Legal (GDPR compliance on client data handling) and Technological (cloud workflow automation to replace legacy spreadsheets).",
    examTrap: "PESTLE analyzes EXTERNAL macro environments, NOT internal company weaknesses. Internal factors belong in SWOT (Strengths/Weaknesses).",
  },
  {
    id: "fc-04",
    title: "Porter's Five Forces",
    acronym: "5 FORCES",
    category: "Strategy & Environment",
    examWeight: "Medium · Industry Competitiveness",
    definition: "Framework by Michael Porter evaluating the structural attractiveness and competitive intensity of an industry.",
    breakdown: [
      { key: "1", name: "Threat of New Entrants", description: "Ease with which new competitors can enter the market." },
      { key: "2", name: "Bargaining Power of Buyers", description: "Ability of customers to drive down prices or demand higher quality." },
      { key: "3", name: "Bargaining Power of Suppliers", description: "Ability of suppliers to dictate prices or supply constraints." },
      { key: "4", name: "Threat of Substitute Products", description: "Availability of alternative ways to satisfy the same customer need." },
      { key: "5", name: "Industry Rivalry", description: "Intensity of direct competition among existing market players." },
    ],
    caseStudyExample: "Advantcore differentiates its consulting through proprietary diagnostic software to reduce buyer price sensitivity and build switching barriers.",
    examTrap: "Governments and regulations are NOT a sixth force in Porter's model; they influence the existing five forces.",
  },
  {
    id: "fc-05",
    title: "POPIT Model (Four Views of a Business System)",
    acronym: "POPIT",
    category: "Process & Modelling",
    examWeight: "High · Holistic Business Analysis",
    definition: "The fundamental BCS framework ensuring business analysts take a balanced, holistic view rather than focusing solely on IT.",
    breakdown: [
      { key: "P", name: "People", description: "Skills, roles, motivation, culture, recruitment, training, management." },
      { key: "O", name: "Organisation", description: "Structure, culture, governance, lines of accountability, business model." },
      { key: "P", name: "Process", description: "Workflows, activities, value streams, inputs, outputs, controls, bottlenecks." },
      { key: "IT", name: "Information & Technology", description: "Applications, data architecture, security, communication tools, legacy software." },
    ],
    caseStudyExample: "Fixing enquiry delays requires staff training (People), clear SLA hand-offs (Process), and unified CRM records (IT)—not just a software update.",
    examTrap: "BCS exam questions often describe a project that failed because only IT was updated while ignoring staff training (People) or workflow ownership (Process).",
  },
  {
    id: "fc-06",
    title: "RACI Governance Matrix",
    acronym: "RACI",
    category: "Stakeholder & People",
    examWeight: "Very High · Stakeholder Governance",
    definition: "A responsibility assignment matrix clarifying roles and decision boundaries across business transformation activities.",
    breakdown: [
      { key: "R", name: "Responsible", description: "The person(s) who does the actual work to complete the task." },
      { key: "A", name: "Accountable", description: "The SINGLE person answerable for the correct, thorough completion of the task." },
      { key: "C", name: "Consulted", description: "Subject matter experts whose inputs/opinions are sought before work is done (two-way)." },
      { key: "I", name: "Informed", description: "Individuals kept updated on progress or decisions after completion (one-way)." },
    ],
    caseStudyExample: "Deliverable sign-off: Responsible = Business Analyst; Accountable = BA Supervisor (Marcus); Consulted = Lead Architect; Informed = Project Sponsor.",
    examTrap: "There can only be ONE 'Accountable' person per activity in a strict RACI matrix to prevent diluted ownership.",
  },
  {
    id: "fc-07",
    title: "Business Activity Model (BAM)",
    acronym: "BAM",
    category: "Process & Modelling",
    examWeight: "Medium · Conceptual Modelling",
    definition: "A conceptual model showing the business activities needed to achieve the purpose described in the Root Definition (CATWOE).",
    breakdown: [
      { key: "Plan", name: "Planning Activities", description: "Setting goals, resource allocation, defining targets and budgets." },
      { key: "Enable", name: "Enabling Activities", description: "Securing resources, hiring staff, procuring tools, obtaining facilities." },
      { key: "Do", name: "Doing Activities", description: "The primary operational tasks fulfilling the core transformation." },
      { key: "Monitor", name: "Monitoring Activities", description: "Tracking KPIs, measuring operational quality and velocity against plan." },
      { key: "Control", name: "Control Activities", description: "Taking corrective actions when performance deviates from planned targets." },
    ],
    caseStudyExample: "Plan = Set monthly enquiry target; Enable = Hire senior BA; Do = Qualify leads; Monitor = Track hand-off cycle time; Control = Reassign triage queue when SLA exceeds 24h.",
    examTrap: "BAM models WHAT the business must do conceptually, NOT HOW it is currently done in physical systems.",
  },
  {
    id: "fc-08",
    title: "SWOT Analysis & Matrix",
    acronym: "SWOT",
    category: "Strategy & Environment",
    examWeight: "High · Strategic Synthesis",
    definition: "A strategic tool synthesizing internal capabilities (Strengths & Weaknesses) with external environment (Opportunities & Threats).",
    breakdown: [
      { key: "S", name: "Strengths", description: "Internal capabilities, proprietary tools, skilled staff, strong brand reputation." },
      { key: "W", name: "Weaknesses", description: "Internal gaps, legacy technology, slow processes, skill deficits." },
      { key: "O", name: "Opportunities", description: "External market growth, emerging customer demand, competitor exits." },
      { key: "T", name: "Threats", description: "External economic headwinds, disruptive new entrants, regulatory changes." },
    ],
    caseStudyExample: "Advantcore uses its high brand trust (Strength) to capture expanding enterprise consulting demand (Opportunity) while automating manual workflows (Weakness).",
    examTrap: "Strengths and Weaknesses are strictly INTERNAL to the organization. Opportunities and Threats are strictly EXTERNAL.",
  },
]

export function FlashcardsDeck() {
  const { user } = useAuth()
  const storageKey = `advantcore_flashcards_mastered_${user?.id || "guest"}`

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]")
    } catch {
      return []
    }
  })

  // Re-sync mastered IDs if user changes
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]")
      setMasteredIds(stored)
    } catch {
      setMasteredIds([])
    }
  }, [storageKey])

  const filteredCards = selectedCategory === "all"
    ? bcsFlashcardsData
    : bcsFlashcardsData.filter(c => c.category === selectedCategory)

  const activeCard = filteredCards[currentIndex] || bcsFlashcardsData[0]
  const isMastered = masteredIds.includes(activeCard.id)

  function handleNext() {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev < filteredCards.length - 1 ? prev + 1 : 0))
  }

  function handlePrev() {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : filteredCards.length - 1))
  }

  function handleShuffle() {
    setIsFlipped(false)
    const randomIdx = Math.floor(Math.random() * filteredCards.length)
    setCurrentIndex(randomIdx)
  }

  function toggleMastered(cardId: string) {
    setMasteredIds(prev => {
      const updated = prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const categories = ["all", "Strategy & Environment", "Requirements", "Stakeholder & People", "Process & Modelling"]

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border bg-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary text-primary-foreground gap-1 text-xs">
              <Sparkles className="w-3.5 h-3.5" /> BCS Framework Accelerator
            </Badge>
            <span className="text-xs text-muted-foreground">
              {masteredIds.length} of {bcsFlashcardsData.length} Mastered ({Math.round((masteredIds.length / bcsFlashcardsData.length) * 100)}%)
            </span>
          </div>
          <h2 className="text-lg font-bold text-foreground">Interactive BCS Flashcards & Framework Revision</h2>
          <p className="text-xs text-muted-foreground">
            Master high-yield business analysis acronyms and exam traps through active recall.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat)
                setCurrentIndex(0)
                setIsFlipped(false)
              }}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Display */}
      <div className="flex flex-col items-center">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full max-w-2xl min-h-[380px] p-6 sm:p-8 rounded-2xl border cursor-pointer transition-all duration-300 shadow-md flex flex-col justify-between select-none ${
            isFlipped
              ? "bg-linear-to-br from-card via-card to-primary/5 border-primary/40 ring-2 ring-primary/20"
              : "bg-card border-border hover:border-primary/50 hover:shadow-lg"
          }`}
        >
          {/* Top Card Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Card {currentIndex + 1} of {filteredCards.length}
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                {activeCard.category}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                {activeCard.examWeight}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMastered(activeCard.id)
                }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isMastered
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
                title={isMastered ? "Mark as needing practice" : "Mark as mastered"}
              >
                <Bookmark className={`w-4 h-4 ${isMastered ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* Card Body (Front vs Back) */}
          {!isFlipped ? (
            /* FRONT OF CARD */
            <div className="my-8 text-center space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-2xl sm:text-3xl tracking-wider">
                {activeCard.acronym}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{activeCard.title}</h1>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {activeCard.definition}
              </p>
              <div className="pt-4 flex items-center justify-center gap-2 text-xs text-primary font-semibold">
                <RotateCw className="w-4 h-4 animate-spin-slow" /> Tap card to reveal framework breakdown & exam traps
              </div>
            </div>
          ) : (
            /* BACK OF CARD */
            <div className="my-3 space-y-4 text-left">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" /> {activeCard.acronym} Element Breakdown:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeCard.breakdown.map(item => (
                    <div key={item.key} className="p-2 rounded-lg bg-muted/40 border border-border/60">
                      <strong className="text-primary font-bold mr-1">{item.key} ({item.name}):</strong>
                      <span className="text-muted-foreground">{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Case Study Integration */}
              <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 text-xs space-y-1">
                <strong className="text-blue-600 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" /> Advantcore Project Application (ADV-BA-001):
                </strong>
                <p className="text-muted-foreground leading-relaxed">{activeCard.caseStudyExample}</p>
              </div>

              {/* BCS Exam Trap */}
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-xs space-y-1">
                <strong className="text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Critical BCS Exam Trap:
                </strong>
                <p className="text-muted-foreground leading-relaxed">{activeCard.examTrap}</p>
              </div>
            </div>
          )}

          {/* Bottom Flip Indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
            <span>{isFlipped ? "Showing Detailed Answer" : "Question / Concept Side"}</span>
            <span className="text-primary font-medium flex items-center gap-1">
              <RotateCw className="w-3 h-3" /> Click to flip
            </span>
          </div>
        </div>

        {/* Navigation & Action Controls */}
        <div className="flex items-center justify-between w-full max-w-2xl mt-4 gap-3">
          <Button variant="outline" size="sm" onClick={handlePrev} className="gap-1 text-xs">
            <ChevronLeft className="w-4 h-4" /> Prev Card
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShuffle} className="gap-1 text-xs">
              <Shuffle className="w-3.5 h-3.5" /> Shuffle
            </Button>
            <Button
              size="sm"
              variant={isMastered ? "default" : "outline"}
              className={`gap-1.5 text-xs ${isMastered ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
              onClick={() => toggleMastered(activeCard.id)}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isMastered ? "Mastered ✔" : "Mark as Mastered"}
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={handleNext} className="gap-1 text-xs">
            Next Card <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
