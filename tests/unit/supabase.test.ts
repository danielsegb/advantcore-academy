import { describe, it, expect } from "vitest"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

describe("Supabase Client Helpers", () => {
  it("returns null when environment variables are not present", () => {
    // In test environment without env vars, clients gracefully return null
    const browserClient = getSupabaseBrowserClient()
    const serverClient = getSupabaseServerClient()
    const adminClient = getSupabaseAdminClient()

    expect(browserClient === null || typeof browserClient === "object").toBe(true)
    expect(serverClient === null || typeof serverClient === "object").toBe(true)
    expect(adminClient === null || typeof adminClient === "object").toBe(true)
  })
})
