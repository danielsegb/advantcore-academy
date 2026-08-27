import { describe, it, expect } from "vitest"
import {
  gdprRetentionSchedule, buildDsarExportPackage,
} from "@/lib/compliance/gdpr-policy"

describe("UK GDPR & Privacy Compliance Engine", () => {
  it("defines comprehensive statutory retention schedules", () => {
    expect(gdprRetentionSchedule.length).toBeGreaterThanOrEqual(5)
    gdprRetentionSchedule.forEach(item => {
      expect(item.category).toBeDefined()
      expect(item.purpose).toBeDefined()
      expect(item.retentionPeriod).toBeDefined()
      expect(item.lawfulBasis).toBeDefined()
    })
  })

  it("builds compliant DSAR export package with controller details", () => {
    const dsar = buildDsarExportPackage("usr-123", "Amanda Okafor", "amanda@advantcore.co")

    expect(dsar.dataSubjectId).toBe("usr-123")
    expect(dsar.controller.legalEntity).toBe("Advantcore Ltd")
    expect(dsar.controller.dpoContact).toBe("privacy@advantcore.co")
    expect(dsar.profile.fullName).toBe("Amanda Okafor")
    expect(dsar.pathwayEnrollments.length).toBeGreaterThan(0)
    expect(dsar.learningProgress.length).toBeGreaterThan(0)
    expect(dsar.workplaceEvidence.length).toBeGreaterThan(0)
    expect(dsar.complianceNotice).toContain("UK GDPR Article 15")
  })
})
