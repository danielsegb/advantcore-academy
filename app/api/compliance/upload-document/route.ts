import { NextRequest, NextResponse } from "next/server"
import { validateUploadBuffer } from "@/lib/security/upload-validator"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { logger } from "@/lib/logging/logger"
import crypto from "node:crypto"

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const userId = formData.get("userId") as string | null
    const deliverableId = formData.get("deliverableId") as string | null

    if (!file) {
      return NextResponse.json(
        { error: "No file was uploaded." },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Inspect magic bytes, extensions, and calculate SHA-256 checksum
    const validation = validateUploadBuffer(buffer, file.name)

    if (!validation.isValid) {
      logger.warn("Rejected upload due to validation failure", {
        requestId,
        fileName: file.name,
        error: validation.error,
        fileSize: file.size,
      })
      return NextResponse.json(
        { error: validation.error },
        { status: 400, headers: { "X-Request-ID": requestId } }
      )
    }

    const supabase = getSupabaseAdminClient()

    if (supabase && userId) {
      await supabase.from("audit_events").insert({
        action: "DOCUMENT_UPLOAD_QUARANTINED",
        resource_type: "document",
        resource_id: deliverableId || "unassigned",
        details_json: {
          fileName: file.name,
          detectedMimeType: validation.detectedMimeType,
          checksumSha256: validation.checksumSha256,
          fileSizeBytes: validation.fileSizeBytes,
          quarantineStatus: validation.quarantineStatus,
        },
      })
    }

    logger.info("Document successfully validated and placed in quarantine", {
      requestId,
      fileName: file.name,
      detectedMimeType: validation.detectedMimeType,
      checksumSha256: validation.checksumSha256,
    })

    return NextResponse.json({
      success: true,
      message: "Document uploaded and quarantined for administrative review.",
      checksumSha256: validation.checksumSha256,
      quarantineStatus: validation.quarantineStatus,
      detectedMimeType: validation.detectedMimeType,
    }, { headers: { "X-Request-ID": requestId } })
  } catch (error) {
    logger.error("Failed to process document upload", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json({ error: "Internal server error during upload processing." }, { status: 500 })
  }
}
