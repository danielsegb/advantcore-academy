import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Advantcore Academy",
  description: "AI-guided career learning and a realistic virtual workplace in one adaptive journey.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}</body></html>
}
