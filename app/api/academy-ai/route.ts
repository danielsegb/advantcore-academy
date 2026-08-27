import { NextRequest, NextResponse } from "next/server"
import { generateAcademyAI } from "@/lib/academy-ai/engine"
import { academyAIRequestSchema } from "@/lib/academy-ai/schema"
import type { AcademyAIRequest } from "@/lib/academy-ai/types"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"

const requestWindows = new Map<string, { count: number; resetAt: number }>()

function sanitizeString(value: string | undefined, limit = 12000): string | undefined {
  if (!value) return undefined
  return value.replace(/\0/g, "").replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, limit)
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const start = Date.now()
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous"
  const now = Date.now()
  const window = requestWindows.get(ip)

  if (window && window.resetAt > now && window.count >= 30) {
    logger.warn("Rate limit exceeded", { requestId, ip, count: window.count })
    return NextResponse.json(
      { error: "Too many AI requests. Please wait a minute and try again." },
      { status: 429, headers: { "X-Request-ID": requestId } }
    )
  }
  requestWindows.set(ip, !window || window.resetAt <= now ? { count: 1, resetAt: now + 60000 } : { ...window, count: window.count + 1 })

  try {
    const rawBody: unknown = await request.json()
    const parseResult = academyAIRequestSchema.safeParse(rawBody)

    if (!parseResult.success) {
      logger.warn("Invalid AI request schema", { requestId, errors: parseResult.error.format() })
      return NextResponse.json(
        { error: "Invalid Academy AI request payload.", details: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const validated = parseResult.data
    const sanitizedInput: AcademyAIRequest = {
      ...validated,
      message: sanitizeString(validated.message, 4000),
      question: sanitizeString(validated.question, 2000),
      answer: sanitizeString(validated.answer, 4000),
      context: sanitizeString(validated.context, 12000),
      evidence: sanitizeString(validated.evidence, 12000),
    }

    const result = await generateAcademyAI(sanitizedInput)
    const durationMs = Date.now() - start

    logger.info("Academy AI request processed", {
      requestId,
      action: validated.action,
      provider: result.provider,
      model: result.model,
      degraded: result.degraded,
      durationMs,
    })

    let data = result.data
    if (validated.action === "quizFeedback" && !data) {
      try {
        data = JSON.parse(result.text.replace(/^```json\s*|```$/g, "")) as Record<string, unknown>
      } catch {
        data = undefined
      }
    }

    return NextResponse.json(
      { ...result, data },
      { headers: { "X-Request-ID": requestId } }
    )
  } catch (error) {
    const durationMs = Date.now() - start
    logger.error("Failed to process AI request", {
      requestId,
      durationMs,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json(
      { error: "The Academy AI service could not process this request." },
      { status: 500, headers: { "X-Request-ID": requestId } }
    )
  }
}
