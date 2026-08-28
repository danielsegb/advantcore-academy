"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
  Search, BookOpen, BriefcaseBusiness, ArrowRight, Sparkles, Layers
} from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { fullCurriculum } from "@/lib/learning/curriculum-data"
import { fullResourceDocuments } from "@/lib/learning/resource-documents"
import { advantcoreProjectStages } from "@/lib/workplace/project-data"
import type { View } from "@/components/shared/types"

interface GlobalSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (view: View) => void
}

interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: "Lesson" | "Resource" | "Workplace" | "Tool"
  view: View
  badge?: string
  keywords: string[]
}

export function GlobalSearchDialog({ open, onOpenChange, onNavigate }: GlobalSearchDialogProps) {
  const [query, setQuery] = useState("")

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onOpenChange])

  // Build searchable index
  const allItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = []

    // 1. Core Tools
    items.push(
      {
        id: "tool-dashboard",
        title: "Executive Dashboard",
        subtitle: "Overview of your readiness metrics, daily priorities, and team status",
        category: "Tool",
        view: "dashboard",
        badge: "Overview",
        keywords: ["dashboard", "home", "stats", "readiness", "priorities", "welcome"],
      },
      {
        id: "tool-mock",
        title: "Mock Exam Simulator (40 Questions)",
        subtitle: "Timed official examination simulation with rationales (65% pass mark)",
        category: "Tool",
        view: "learning",
        badge: "Exam Prep",
        keywords: ["mock", "exam", "test", "practice", "questions", "bcs", "certification", "timed"],
      },
      {
        id: "tool-meeting",
        title: "Virtual Meeting Room & Document Presenter",
        subtitle: "Live spoken simulation with Sarah Mitchell, Marcus Cole, Priya Shah, and Helen Grant",
        category: "Tool",
        view: "meetings",
        badge: "Simulation",
        keywords: ["meeting", "stakeholder", "sarah", "marcus", "priya", "helen", "voice", "microphone", "share", "document"],
      },
      {
        id: "tool-planner",
        title: "12-Week Adaptive Study & Delivery Plan",
        subtitle: "Weekly milestones, Google Calendar exports, and workload re-balancing",
        category: "Tool",
        view: "calendar",
        badge: "Schedule",
        keywords: ["plan", "calendar", "schedule", "weeks", "roadmap", "timeline", "google calendar"],
      },
      {
        id: "tool-workplace",
        title: "Virtual Workplace & Evidence Locker",
        subtitle: "5 project stages and 10 verifiable deliverables for ADV-BA-001",
        category: "Tool",
        view: "workplace",
        badge: "Evidence",
        keywords: ["workplace", "project", "evidence", "deliverables", "portfolio", "stages"],
      }
    )

    // 2. Curriculum Lessons
    fullCurriculum.forEach(mod => {
      mod.lessons.forEach(les => {
        items.push({
          id: `les-${les.id}`,
          title: `Lesson ${les.lessonNumber}: ${les.title}`,
          subtitle: `Module ${mod.moduleNumber} · ${les.intro}`,
          category: "Lesson",
          view: "learning",
          badge: `Mod ${mod.moduleNumber}`,
          keywords: [
            les.title.toLowerCase(),
            les.intro.toLowerCase(),
            mod.title.toLowerCase(),
            `module ${mod.moduleNumber}`,
            `lesson ${les.lessonNumber}`,
            ...les.concepts.map(c => c.title.toLowerCase()),
            ...les.outcomes.map(o => o.toLowerCase()),
          ],
        })
      })
    })

    // 3. Resource Documents & Textbook
    fullResourceDocuments.forEach(doc => {
      items.push({
        id: `doc-${doc.id}`,
        title: doc.title,
        subtitle: doc.subtitle,
        category: "Resource",
        view: "learning",
        badge: doc.documentType,
        keywords: [
          doc.title.toLowerCase(),
          doc.subtitle.toLowerCase(),
          doc.description.toLowerCase(),
          doc.documentType.toLowerCase(),
          ...doc.keyHighlights.map(h => h.toLowerCase()),
          ...doc.sections.map(s => s.title.toLowerCase()),
        ],
      })
    })

    // 4. Workplace Tasks
    advantcoreProjectStages.forEach(stage => {
      stage.tasks.forEach(task => {
        items.push({
          id: `task-${task.id}`,
          title: `Task ${task.taskNumber}: ${task.title}`,
          subtitle: `Stage ${stage.stageNumber} · Deliverable: ${task.deliverable}`,
          category: "Workplace",
          view: "workplace",
          badge: `Stage ${stage.stageNumber}`,
          keywords: [
            task.title.toLowerCase(),
            task.description.toLowerCase(),
            task.deliverable.toLowerCase(),
            task.assignedStakeholder.toLowerCase(),
            `stage ${stage.stageNumber}`,
            `task ${task.taskNumber}`,
          ],
        })
      })
    })

    return items
  }, [])

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allItems.slice(0, 8)

    return allItems
      .filter(item => {
        if (item.title.toLowerCase().includes(q)) return true
        if (item.subtitle.toLowerCase().includes(q)) return true
        if (item.badge?.toLowerCase().includes(q)) return true
        return item.keywords.some(k => k.includes(q))
      })
      .slice(0, 10)
  }, [allItems, query])

  function handleSelect(item: SearchItem) {
    onOpenChange(false)
    setQuery("")
    onNavigate(item.view)
  }

  function getCategoryIcon(cat: SearchItem["category"]) {
    switch (cat) {
      case "Lesson":
        return <BookOpen className="w-4 h-4 text-emerald-500" />
      case "Resource":
        return <Layers className="w-4 h-4 text-primary" />
      case "Workplace":
        return <BriefcaseBusiness className="w-4 h-4 text-blue-500" />
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Advantcore Academy</DialogTitle>
        </DialogHeader>

        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b bg-muted/20">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search lessons, textbook, RACI, user stories, mock exams, or meetings..."
            className="w-full bg-transparent text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground bg-muted border rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">No matching content found for &quot;{query}&quot;</p>
              <p>Try searching for terms like &quot;PESTLE&quot;, &quot;POPIT&quot;, &quot;MoSCoW&quot;, &quot;Given-When-Then&quot;, or &quot;Business Case&quot;.</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full p-2.5 rounded-lg text-left hover:bg-muted/60 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-md bg-background border shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-semibold text-foreground truncate">{item.title}</strong>
                      {item.badge && (
                        <Badge variant="outline" className="text-[9px] py-0 px-1 font-medium">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{item.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </button>
            ))
          )}
        </div>

        {/* Footer Quick Links */}
        <div className="px-4 py-2.5 bg-muted/30 border-t flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            {query.trim() ? `${filteredItems.length} matching results` : "Quick suggestions (type to search all materials)"}
          </span>
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1 py-0.5 bg-background border rounded text-[10px]">Enter</kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
