type LogLevel = "info" | "warn" | "error" | "debug"

interface LogPayload {
  requestId?: string
  action?: string
  provider?: string
  model?: string
  durationMs?: number
  error?: string
  [key: string]: unknown
}

function sanitizeLogValue(value: unknown): unknown {
  if (typeof value === "string") {
    // Redact potential API keys or secrets
    if (value.length > 20 && /^[A-Za-z0-9_-]{20,}$/.test(value)) {
      return "[REDACTED_SECRET]"
    }
    return value.slice(0, 500)
  }
  return value
}

function formatLog(level: LogLevel, message: string, payload?: LogPayload) {
  const timestamp = new Date().toISOString()
  const sanitizedPayload: Record<string, unknown> = {}
  
  if (payload) {
    for (const [k, v] of Object.entries(payload)) {
      sanitizedPayload[k] = sanitizeLogValue(v)
    }
  }

  const logEntry = {
    timestamp,
    level,
    app: "advantcore-academy",
    message,
    ...sanitizedPayload,
  }

  if (process.env.NODE_ENV === "test") {
    return // Keep test output clean
  }

  const output = JSON.stringify(logEntry)
  if (level === "error") {
    console.error(output)
  } else if (level === "warn") {
    console.warn(output)
  } else {
    console.log(output)
  }
}

export const logger = {
  info: (message: string, payload?: LogPayload) => formatLog("info", message, payload),
  warn: (message: string, payload?: LogPayload) => formatLog("warn", message, payload),
  error: (message: string, payload?: LogPayload) => formatLog("error", message, payload),
  debug: (message: string, payload?: LogPayload) => formatLog("debug", message, payload),
}
