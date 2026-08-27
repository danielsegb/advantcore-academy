import { describe, it, expect } from "vitest"
import { proxy } from "@/proxy"
import { NextRequest } from "next/server"

describe("Canonical Domain & Vercel Redirect Proxy", () => {
  it("redirects vercel.app domains permanently (308) to https://app.advantcore.co/academy", () => {
    const request = new NextRequest("https://advantcore-academy.vercel.app/academy/learning", {
      headers: {
        host: "advantcore-academy.vercel.app",
      },
    })

    const response = proxy(request)
    expect(response.status).toBe(308)
    expect(response.headers.get("location")).toBe("https://app.advantcore.co/academy/learning")
  })

  it("redirects root vercel.app visits to https://app.advantcore.co/academy", () => {
    const request = new NextRequest("https://advantcore-academy.vercel.app/", {
      headers: {
        host: "advantcore-academy.vercel.app",
      },
    })

    const response = proxy(request)
    expect(response.status).toBe(308)
    expect(response.headers.get("location")).toBe("https://app.advantcore.co/academy")
  })

  it("allows localhost requests without redirecting to the canonical production domain", () => {
    const request = new NextRequest("http://localhost:3000/academy", {
      headers: {
        host: "localhost:3000",
      },
    })

    const response = proxy(request)
    // Next response proceeds (status 200)
    expect(response.status).toBe(200)
  })

  it("redirects root / on canonical domain to /academy", () => {
    const request = new NextRequest("https://app.advantcore.co/", {
      headers: {
        host: "app.advantcore.co",
      },
    })

    const response = proxy(request)
    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toContain("/academy")
  })
})
