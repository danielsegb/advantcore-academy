import { NextRequest, NextResponse } from "next/server"

const CANONICAL_DOMAIN = "app.advantcore.co"
const BASE_PATH = "/academy"

export function proxy(request: NextRequest) {
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").toLowerCase()
  const { pathname, search } = request.nextUrl

  // Ignore local development hosts
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.includes(":3000")

  // Check if request is hitting a vercel.app domain or non-canonical domain in production
  if (!isLocal && (host.endsWith(".vercel.app") || (host && host !== CANONICAL_DOMAIN))) {
    // Ensure base path is present in the target destination
    const cleanPath = pathname.startsWith(BASE_PATH) ? pathname : `${BASE_PATH}${pathname === "/" ? "" : pathname}`
    const destination = `https://${CANONICAL_DOMAIN}${cleanPath}${search}`

    return NextResponse.redirect(destination, {
      status: 308, // Permanent Redirect
      headers: {
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai",
      },
    })
  }

  // If hitting the root "/" on canonical domain or local, redirect to base path "/academy"
  if (pathname === "/" || pathname === "") {
    const url = request.nextUrl.clone()
    url.pathname = BASE_PATH
    return NextResponse.redirect(url, { status: 307 })
  }

  return NextResponse.next()
}

// Keep middleware export for compatibility
export const middleware = proxy

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
}
