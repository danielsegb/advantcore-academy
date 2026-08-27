import crypto from "node:crypto"

export interface UploadValidationResult {
  isValid: boolean
  error?: string
  detectedMimeType?: string
  checksumSha256?: string
  fileSizeBytes: number
  quarantineStatus: "quarantined" | "rejected"
}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10MB
export const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".docx"]

const BANNED_EXTENSIONS = [
  ".exe", ".bat", ".cmd", ".sh", ".vbs", ".js", ".mjs", ".py", ".ps1",
  ".msi", ".dll", ".scr", ".com", ".pif", ".application", ".gadget",
]

/**
 * Inspects binary buffer magic bytes to verify file type signature.
 * Prevents disguised executable uploads and MIME spoofing.
 */
export function validateUploadBuffer(
  buffer: Buffer,
  fileName: string
): UploadValidationResult {
  const fileSizeBytes = buffer.length

  // 1. Check size limit
  if (fileSizeBytes > MAX_UPLOAD_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds 10MB limit (received ${(fileSizeBytes / (1024 * 1024)).toFixed(2)}MB).`,
      fileSizeBytes,
      quarantineStatus: "rejected",
    }
  }

  if (fileSizeBytes < 4) {
    return {
      isValid: false,
      error: "File is empty or corrupted.",
      fileSizeBytes,
      quarantineStatus: "rejected",
    }
  }

  // 2. Check file extension
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase()
  if (BANNED_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      error: `Potentially malicious file extension '${ext}' is strictly prohibited.`,
      fileSizeBytes,
      quarantineStatus: "rejected",
    }
  }

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      error: `File extension '${ext}' is not permitted. Allowed extensions: ${ALLOWED_EXTENSIONS.join(", ")}.`,
      fileSizeBytes,
      quarantineStatus: "rejected",
    }
  }

  // 3. Inspect magic bytes
  let detectedMimeType: string | undefined

  // PDF: %PDF (25 50 44 46)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    detectedMimeType = "application/pdf"
  }
  // PNG: \x89PNG (89 50 4E 47)
  else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    detectedMimeType = "image/png"
  }
  // JPEG: \xFF\xD8\xFF (FF D8 FF)
  else if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    detectedMimeType = "image/jpeg"
  }
  // DOCX / ZIP: PK\x03\x04 (50 4B 03 04)
  else if (buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) {
    detectedMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  }

  if (!detectedMimeType) {
    return {
      isValid: false,
      error: "File signature does not match allowed types (PDF, PNG, JPEG, DOCX). Magic byte inspection failed.",
      fileSizeBytes,
      quarantineStatus: "rejected",
    }
  }

  // 4. Calculate SHA-256 checksum for immutable provenance
  const checksumSha256 = crypto.createHash("sha256").update(buffer).digest("hex")

  return {
    isValid: true,
    detectedMimeType,
    checksumSha256,
    fileSizeBytes,
    quarantineStatus: "quarantined", // Stays quarantined until administrator / reviewer approves
  }
}
