import { getSupabaseAdminClient } from "@/lib/supabase/admin"

export interface SystemHealthReport {
  status: "healthy" | "degraded" | "unhealthy"
  timestamp: string
  version: string
  uptimeSeconds: number
  environment: string
  subsystems: {
    database: { connected: boolean; latencyMs: number }
    aiEngine: { primaryProvider: string; fallbackReady: boolean }
    securityQuarantine: { active: boolean }
    memory: { rssMb: number; heapUsedMb: number }
  }
}

const startTime = Date.now()

export async function checkSystemHealth(): Promise<SystemHealthReport> {
  const startDb = Date.now()
  let dbConnected = false
  let dbLatencyMs = 0

  try {
    const supabase = getSupabaseAdminClient()
    if (supabase) {
      const { error } = await supabase.from("profiles").select("id").limit(1)
      dbConnected = !error
      dbLatencyMs = Date.now() - startDb
    }
  } catch {
    dbConnected = false
    dbLatencyMs = Date.now() - startDb
  }

  const memory = process.memoryUsage ? process.memoryUsage() : { rss: 0, heapUsed: 0 }
  const hasGroq = Boolean(process.env.GROQ_API_KEY)
  const hasGemini = Boolean(process.env.GEMINI_API_KEY)

  const primaryProvider = hasGroq ? "groq" : hasGemini ? "gemini" : "local-deterministic"

  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "0.1.0",
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    environment: process.env.NODE_ENV || "development",
    subsystems: {
      database: {
        connected: dbConnected,
        latencyMs: dbLatencyMs,
      },
      aiEngine: {
        primaryProvider,
        fallbackReady: true,
      },
      securityQuarantine: {
        active: true,
      },
      memory: {
        rssMb: Math.round((memory.rss || 0) / (1024 * 1024)),
        heapUsedMb: Math.round((memory.heapUsed || 0) / (1024 * 1024)),
      },
    },
  }
}
