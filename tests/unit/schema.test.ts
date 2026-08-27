import { describe, it, expect } from "vitest"
import { academyAIRequestSchema } from "@/lib/academy-ai/schema"

describe("Academy AI Request Zod Schema", () => {
  it("accepts valid meetingReply payload", () => {
    const result = academyAIRequestSchema.safeParse({
      action: "meetingReply",
      character: { name: "Marcus", role: "BA Supervisor", behaviour: "Challenging" },
      project: { name: "Test Project", company: "Advantcore" },
      message: "Hello world",
    })

    expect(result.success).toBe(true)
  })

  it("rejects unknown actions", () => {
    const result = academyAIRequestSchema.safeParse({
      action: "invalidAction",
      message: "Hello",
    })

    expect(result.success).toBe(false)
  })

  it("enforces max length constraints to prevent unbounded payload abuse", () => {
    const hugeMessage = "A".repeat(5000)
    const result = academyAIRequestSchema.safeParse({
      action: "meetingReply",
      message: hugeMessage,
    })

    expect(result.success).toBe(false)
  })
})
