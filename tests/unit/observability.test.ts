import { describe, it, expect } from "vitest"
import { checkSystemHealth } from "@/lib/observability/health"

describe("Observability & System Health", () => {
  it("generates a comprehensive system health report", async () => {
    const health = await checkSystemHealth()

    expect(health.status).toBe("healthy")
    expect(health.version).toBe("0.1.0")
    expect(health.uptimeSeconds).toBeGreaterThanOrEqual(0)
    expect(health.subsystems.database).toBeDefined()
    expect(health.subsystems.aiEngine.fallbackReady).toBe(true)
    expect(health.subsystems.securityQuarantine.active).toBe(true)
    expect(health.subsystems.memory.heapUsedMb).toBeGreaterThanOrEqual(0)
  })
})
