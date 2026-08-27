import { describe, it, expect } from "vitest"
import { validateClientEnv, validateServerEnv } from "@/lib/config/env"

describe("Environment Validation Module", () => {
  it("validates default client environment", () => {
    const clientEnv = validateClientEnv()
    expect(clientEnv.NEXT_PUBLIC_BASE_PATH).toBe("/academy")
  })

  it("validates server environment safely", () => {
    const serverEnv = validateServerEnv()
    expect(serverEnv.NEXT_PUBLIC_BASE_PATH).toBe("/academy")
    expect(["development", "test", "production"]).toContain(serverEnv.NODE_ENV)
  })
})
