import { NextRequest, NextResponse } from "next/server"
import { buildDsarExportPackage } from "@/lib/compliance/gdpr-policy"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "usr-current"
    const fullName = searchParams.get("name") || "Amanda Okafor"
    const email = searchParams.get("email") || "amanda@advantcore.co"

    const dsarBundle = buildDsarExportPackage(userId, fullName, email)

    logger.info("GDPR DSAR Export generated", {
      requestId,
      userId,
      email,
    })

    return new NextResponse(JSON.stringify(dsarBundle, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="advantcore-dsar-export-${userId}.json"`,
        "X-Request-ID": requestId,
      },
    })
  } catch (error) {
    logger.error("Failed to generate DSAR export", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
