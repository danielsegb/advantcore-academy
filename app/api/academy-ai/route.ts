import { NextRequest, NextResponse } from "next/server"
import { generateAcademyAI } from "@/lib/academy-ai/engine"
import type { AcademyAIRequest } from "@/lib/academy-ai/types"

const requestWindows = new Map<string, { count: number; resetAt: number }>()
const validActions = new Set(["meetingReply", "quizFeedback", "pathwayRecommendation", "evidenceReview"])

function clean(value: unknown, limit = 12000) {
  return typeof value === "string" ? value.replace(/\0/g, "").replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, limit) : value
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous"
  const now = Date.now()
  const window = requestWindows.get(ip)
  if (window && window.resetAt > now && window.count >= 20) return NextResponse.json({ error: "Too many AI requests. Please wait a minute and try again." }, { status: 429 })
  requestWindows.set(ip, !window || window.resetAt <= now ? { count: 1, resetAt: now + 60000 } : { ...window, count: window.count + 1 })

  try {
    const raw = await request.json() as AcademyAIRequest
    if (!validActions.has(raw.action)) return NextResponse.json({ error: "Unsupported Academy AI action." }, { status: 400 })
    const input: AcademyAIRequest = { ...raw, message: clean(raw.message) as string, question: clean(raw.question) as string, answer: clean(raw.answer) as string, context: clean(raw.context) as string, evidence: clean(raw.evidence) as string }
    const result = await generateAcademyAI(input)
    let data = result.data
    if (raw.action === "quizFeedback" && !data) {
      try { data = JSON.parse(result.text.replace(/^```json\s*|```$/g, "")) as Record<string, unknown> } catch { data = undefined }
    }
    return NextResponse.json({ ...result, data })
  } catch {
    return NextResponse.json({ error: "The Academy AI service could not process this request." }, { status: 500 })
  }
}

