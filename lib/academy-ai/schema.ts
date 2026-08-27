import { z } from "zod"

export const characterSchema = z.object({
  name: z.string().max(100),
  role: z.string().max(100),
  behaviour: z.string().max(500).optional(),
})

export const projectSchema = z.object({
  name: z.string().max(150),
  company: z.string().max(100),
  objective: z.string().max(500).optional(),
  stage: z.string().max(50).optional(),
})

export const academyAIRequestSchema = z.object({
  action: z.enum(["meetingReply", "quizFeedback", "pathwayRecommendation", "evidenceReview"]),
  character: characterSchema.optional(),
  project: projectSchema.optional(),
  context: z.string().max(12000).optional(),
  message: z.string().max(4000).optional(),
  question: z.string().max(2000).optional(),
  answer: z.string().max(4000).optional(),
  expectedConcepts: z.array(z.string().max(100)).max(20).optional(),
  targetRole: z.string().max(100).optional(),
  certification: z.string().max(100).optional(),
  evidence: z.string().max(12000).optional(),
})

export type ValidatedAcademyAIRequest = z.infer<typeof academyAIRequestSchema>
