import { runAcademyLocalFallback } from "./local-fallback"
import type { AcademyAIRequest, AcademyAIResult } from "./types"
import { buildAcademyPrompt } from "./prompts"

const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"]

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 20000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try { return await fetch(url, { ...init, signal: controller.signal }) }
  finally { clearTimeout(timeout) }
}

function sanitizeCompletedText(rawText: string): string {
  let text = rawText.trim()
  if (!text) return text

  // 1. Remove any unclosed source tags or brackets at the end (e.g. "[ADV-SOP-")
  text = text.replace(/\[[A-Za-z0-9_-]*$/, "").trim()

  // 2. If bracket is opened and not closed anywhere in trailing characters, close or remove
  const openBracketIndex = text.lastIndexOf("[")
  const closeBracketIndex = text.lastIndexOf("]")
  if (openBracketIndex > closeBracketIndex) {
    text = text.slice(0, openBracketIndex).trim()
  }

  // 3. Ensure proper sentence termination
  if (text && !/[.!?)"']$/.test(text)) {
    // If it ends with a comma, semicolon or hyphen, strip it
    text = text.replace(/[,;:\-\s]+$/, "")
    text += "."
  }

  return text
}

async function callGroq(prompt: string, model: string, jsonMode: boolean) {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error("Groq is not configured")
  const response = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
      ...(jsonMode ? { response_format: { type: "json_object" } } : {})
    }),
  })
  if (!response.ok) throw new Error(`Groq returned ${response.status}`)
  const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
  const text = body.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error("Groq returned an empty response")
  return jsonMode ? text : sanitizeCompletedText(text)
}

async function callGemini(prompt: string, model: string, jsonMode: boolean) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("Gemini is not configured")
  const response = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2500,
        ...(jsonMode ? { responseMimeType: "application/json" } : {})
      }
    }),
  })
  if (!response.ok) throw new Error(`Gemini returned ${response.status}`)
  const body = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
  const text = body.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!text) throw new Error("Gemini returned an empty response")
  return jsonMode ? text : sanitizeCompletedText(text)
}

export async function generateAcademyAI(input: AcademyAIRequest): Promise<AcademyAIResult> {
  const prompt = buildAcademyPrompt(input)
  const jsonMode = input.action === "quizFeedback"
  for (const model of GROQ_MODELS) {
    try {
      const text = await callGroq(prompt, model, jsonMode)
      return { text, provider: "groq", model, degraded: false }
    } catch {
      // Continue to next model in waterfall
    }
  }
  for (const model of GEMINI_MODELS) {
    try {
      const text = await callGemini(prompt, model, jsonMode)
      return { text, provider: "gemini", model, degraded: false }
    } catch {
      // Continue to deterministic fallback
    }
  }
  return runAcademyLocalFallback(input)
}
