import { NextResponse } from "next/server"
import { checkSystemHealth } from "@/lib/observability/health"

export const dynamic = "force-dynamic"

export async function GET() {
  const health = await checkSystemHealth()

  const statusCode = health.status === "healthy" ? 200 : health.status === "degraded" ? 200 : 503

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Advantcore-Status": health.status,
    },
  })
}
