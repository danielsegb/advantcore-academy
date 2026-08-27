import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"
import { z } from "zod"

const pathwayPackageSchema = z.object({
  action: z.enum(["saveDraft", "publish", "unpublish", "list"]),
  pathwayId: z.string().optional(),
  title: z.string().min(3).max(150).optional(),
  slug: z.string().min(3).max(150).optional(),
  careerFamily: z.string().default("business").optional(),
  targetOutcome: z.string().min(10).max(1000).optional(),
  defaultDurationWeeks: z.number().int().min(1).max(52).default(12).optional(),
  masteryThreshold: z.number().int().min(50).max(100).default(90).optional(),
  certification: z.object({
    title: z.string().max(150),
    awardingBody: z.string().max(100),
    examFormat: z.string().default("Multiple Choice"),
    questionCount: z.number().int().default(40),
    durationMinutes: z.number().int().default(60),
    passPercentage: z.number().int().default(65),
    sourceUrl: z.string().url().optional(),
    verificationDate: z.string().optional(),
  }).optional(),
  project: z.object({
    code: z.string().max(30),
    title: z.string().max(150),
    description: z.string().max(2000),
    companyName: z.string().max(100).default("Advantcore Ltd"),
    stages: z.array(z.string().max(50)).default(["Initiate", "Discover", "Analyse", "Design", "Validate"]),
  }).optional(),
  characters: z.array(z.object({
    name: z.string().max(100),
    role: z.string().max(100),
    initials: z.string().max(4),
    colour: z.string().default("blue"),
    behaviourInstructions: z.string().max(2000),
    knowledgeScope: z.string().max(2000).optional(),
  })).optional(),
})

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const rawBody: unknown = await request.json()
    const parseResult = pathwayPackageSchema.safeParse(rawBody)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid pathway payload.", details: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const payload = parseResult.data
    const supabase = getSupabaseAdminClient()

    if (!supabase) {
      logger.info("Pathway action processed (local simulation)", { requestId, action: payload.action, title: payload.title })
      return NextResponse.json({
        success: true,
        message: `Action '${payload.action}' executed successfully (local simulation).`,
        pathwayId: payload.pathwayId || `pathway-${Date.now()}`,
      }, { headers: { "X-Request-ID": requestId } })
    }

    if (payload.action === "publish" || payload.action === "saveDraft") {
      const isPublished = payload.action === "publish"
      const slug = payload.slug || (payload.title || "new-pathway").toLowerCase().replace(/[^a-z0-9]+/g, "-")

      // 1. Upsert Pathway
      const { data: pathwayData, error: pathwayError } = await supabase
        .from("career_pathways")
        .upsert({
          id: payload.pathwayId || crypto.randomUUID(),
          title: payload.title || "Untitled Pathway",
          slug,
          career_family: payload.careerFamily || "business",
          target_outcome: payload.targetOutcome || "Career accelerator pathway.",
          default_duration_weeks: payload.defaultDurationWeeks || 12,
          mastery_threshold: payload.masteryThreshold || 90,
          is_published: isPublished,
        })
        .select()
        .single()

      if (pathwayError || !pathwayData) {
        logger.error("Failed to save pathway", { requestId, error: pathwayError?.message })
        return NextResponse.json({ error: pathwayError?.message || "Database error saving pathway." }, { status: 500 })
      }

      // 2. Upsert Certification if provided
      if (payload.certification) {
        await supabase.from("certifications").upsert({
          pathway_id: pathwayData.id,
          title: payload.certification.title,
          awarding_body: payload.certification.awardingBody,
          exam_format: payload.certification.examFormat,
          question_count: payload.certification.questionCount,
          duration_minutes: payload.certification.durationMinutes,
          pass_percentage: payload.certification.passPercentage,
          academy_target_percentage: 90,
          source_url: payload.certification.sourceUrl,
        })
      }

      // 3. Log Audit Event
      await supabase.from("audit_events").insert({
        action: isPublished ? "PATHWAY_PUBLISHED" : "PATHWAY_DRAFT_SAVED",
        resource_type: "career_pathways",
        resource_id: pathwayData.id,
        details_json: { title: pathwayData.title, isPublished },
      })

      logger.info("Pathway saved successfully", { requestId, pathwayId: pathwayData.id, isPublished })

      return NextResponse.json({
        success: true,
        pathwayId: pathwayData.id,
        isPublished,
      }, { headers: { "X-Request-ID": requestId } })
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 })
  } catch (error) {
    logger.error("Failed to process pathway action", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
