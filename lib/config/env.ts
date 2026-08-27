import { z } from "zod"

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_BASE_PATH: z.string().default("/academy"),
  GROQ_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
})

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BASE_PATH: z.string().default("/academy"),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>

export function validateServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env)
  if (!result.success) {
    console.error("Invalid server environment configuration:", result.error.format())
    throw new Error("Server environment validation failed.")
  }
  return result.data
}

export function validateClientEnv(): ClientEnv {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || "/academy",
  })
  if (!result.success) {
    console.error("Invalid client environment configuration:", result.error.format())
    throw new Error("Client environment validation failed.")
  }
  return result.data
}
