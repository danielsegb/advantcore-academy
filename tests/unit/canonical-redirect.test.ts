import { describe, it, expect } from "vitest"
import { proxy } from "@/proxy"
import { NextRequest } from "next/server"

describe("Canonical Domain & Proxy Routing", () => {
  it("redirects direct vercel.app visits with 308 to https://app.advantcore.co/academy", () => {
    const request = new NextRequest("https://advantcore-academy.vercel.app/academy", {
      headers: {
        host: "advantcore-academy.vercel.app",
      },
    })

    const response = proxy(request)
    expect(response.status).toBe(308)
    expect(response.headers.get("location")).toBe("https://app.advantcore.co/academy")
  })

  it("allows reverse-proxied traffic from app.advantcore.co without redirecting", () => {
    const request = new NextRequest("https://app.advantcore.co/academy", {
      headers: {
        host: "advantcore-academy.vercel.app",
        "x-forwarded-host": "app.advantcore.co",
      },
    })

    const response = proxy(request)
    expect(response.status).toBe(200)
  })

  it("allows localhost requests without redirecting to the canonical production domain", () => {
    const request = new NextRequest("http://localhost:3000/academy", {
      headers: {
        host: "localhost:3000",
      },
    })

    const response = proxy(request)
    expect(response.status).toBe(200)
  })
})
