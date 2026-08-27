import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Advantcore Academy",
  description: "AI-guided career learning and a realistic virtual workplace in one adaptive journey.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
  other: {
    "robots": "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai",
    "googlebot": "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai",
    "google-extended": "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai",
    "gptbot": "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai",
    "anthropic-ai": "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai",
    "claude-web": "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai",
    "CCBot": "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}</body></html>
}
