import { NextRequest, NextResponse } from "next/server"

const CANONICAL_HOST = "app.advantcore.co"

export function proxy(request: NextRequest) {
  const forwardedHost = (request.headers.get("x-forwarded-host") || "").toLowerCase()
  const host = (request.headers.get("host") || "").toLowerCase()

  // If the request was forwarded for app.advantcore.co or is accessing app.advantcore.co, it is canonical
  const isCanonical = forwardedHost.includes(CANONICAL_HOST) || host.includes(CANONICAL_HOST)
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || forwardedHost.includes("localhost")

  // If directly accessing via vercel.app in browser (not reverse-proxied through app.advantcore.co)
  if (!isCanonical && !isLocal && (host.endsWith(".vercel.app") || forwardedHost.endsWith(".vercel.app"))) {
    return NextResponse.redirect(`https://${CANONICAL_HOST}/academy`, {
      status: 308,
      headers: {
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai",
      },
    })
  }

  return NextResponse.next()
}

export const middleware = proxy

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
}
