import type { NextConfig } from "next"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/academy"

const nextConfig: NextConfig = {
  basePath,
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(self), microphone=(self), display-capture=(self)" }
      ]
    }]
  }
}

export default nextConfig
