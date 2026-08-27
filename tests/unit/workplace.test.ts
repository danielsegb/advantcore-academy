import { describe, it, expect } from "vitest"
import { advantcoreProjectStages, initialEvidenceItems } from "@/lib/workplace/project-data"
import type { EvidenceItem } from "@/lib/workplace/types"

describe("Virtual Workplace & Evidence Workflow", () => {
  it("contains all 5 Advantcore project stages", () => {
    expect(advantcoreProjectStages.length).toBe(5)
    const stageNumbers = advantcoreProjectStages.map(s => s.stageNumber)
    expect(stageNumbers).toEqual([1, 2, 3, 4, 5])
  })

  it("ensures all 10 tasks have acceptance criteria and assigned stakeholders", () => {
    let totalTasks = 0
    advantcoreProjectStages.forEach(stage => {
      totalTasks += stage.tasks.length
      stage.tasks.forEach(task => {
        expect(task.acceptanceCriteria.length).toBeGreaterThan(0)
        expect(task.assignedStakeholder).toBeDefined()
        expect(task.deliverable).toBeDefined()
      })
    })
    expect(totalTasks).toBe(10)
  })

  it("filters only approved evidence items for portfolio export", () => {
    function getExportablePortfolio(items: EvidenceItem[]): EvidenceItem[] {
      return items.filter(i => i.status === "approved")
    }

    const sampleItems: EvidenceItem[] = [
      { id: "ev-1", taskId: "t-1", taskTitle: "Task 1", stageNumber: 1, title: "Doc 1", content: "...", version: 1, status: "approved", updatedAt: "2026-08-20T10:00:00Z" },
      { id: "ev-2", taskId: "t-2", taskTitle: "Task 2", stageNumber: 1, title: "Doc 2", content: "...", version: 1, status: "in_review", updatedAt: "2026-08-20T10:00:00Z" },
      { id: "ev-3", taskId: "t-3", taskTitle: "Task 3", stageNumber: 2, title: "Doc 3", content: "...", version: 1, status: "approved", updatedAt: "2026-08-20T10:00:00Z" },
    ]

    const exportable = getExportablePortfolio(sampleItems)
    expect(exportable.length).toBe(2)
    exportable.forEach(e => {
      expect(e.status).toBe("approved")
    })

    // Confirm initial evidence items starts clean for new learners
    expect(initialEvidenceItems.length).toBe(0)
  })
})
