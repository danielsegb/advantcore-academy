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

    const exportable = getExportablePortfolio(initialEvidenceItems)
    expect(exportable.length).toBe(2)
    exportable.forEach(e => {
      expect(e.status).toBe("approved")
    })
  })
})
