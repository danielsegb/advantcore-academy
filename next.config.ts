import type { NextConfig } from "next"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/academy"

const nextConfig: NextConfig = {
  basePath,
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://app.advantcore.co/academy",
        basePath: false,
        permanent: true,
      },
    ]
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(self), microphone=(self), display-capture=(self)" },
        { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai" },
      ],
    }]
  },
}

export default nextConfig
