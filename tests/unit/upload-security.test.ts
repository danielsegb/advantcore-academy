import { describe, it, expect } from "vitest"
import { validateUploadBuffer } from "@/lib/security/upload-validator"

describe("Upload Security & Magic-Byte Validator", () => {
  it("validates legitimate PDF files by %PDF magic byte signature", () => {
    const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]) // %PDF-1.4
    const result = validateUploadBuffer(pdfBuffer, "project-charter.pdf")

    expect(result.isValid).toBe(true)
    expect(result.detectedMimeType).toBe("application/pdf")
    expect(result.checksumSha256).toBeDefined()
    expect(result.quarantineStatus).toBe("quarantined")
  })

  it("validates legitimate PNG files by magic byte signature", () => {
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    const result = validateUploadBuffer(pngBuffer, "process-map.png")

    expect(result.isValid).toBe(true)
    expect(result.detectedMimeType).toBe("image/png")
  })

  it("rejects malicious files with banned extensions", () => {
    const fakeBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46])
    const result = validateUploadBuffer(fakeBuffer, "exploit.exe")

    expect(result.isValid).toBe(false)
    expect(result.error).toContain("strictly prohibited")
    expect(result.quarantineStatus).toBe("rejected")
  })

  it("rejects spoofed files where extension does not match magic bytes", () => {
    const plainTextBuffer = Buffer.from("Hello this is plain text masquerading as a PDF")
    const result = validateUploadBuffer(plainTextBuffer, "fake.pdf")

    expect(result.isValid).toBe(false)
    expect(result.error).toContain("Magic byte inspection failed")
  })

  it("rejects oversized files exceeding 10MB limit", () => {
    const oversizedBuffer = Buffer.alloc(11 * 1024 * 1024)
    const result = validateUploadBuffer(oversizedBuffer, "large.pdf")

    expect(result.isValid).toBe(false)
    expect(result.error).toContain("exceeds 10MB limit")
  })
})
