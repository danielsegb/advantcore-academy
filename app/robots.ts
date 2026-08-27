import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "Anthropic-ai",
          "Claude-Web",
          "ClaudeBot",
          "cohere-ai",
          "CCBot",
          "Bytespider",
          "FacebookBot",
          "Amazonbot",
          "Applebot-Extended",
          "Omgilibot",
          "Diffbot",
          "PerplexityBot",
          "YouBot",
          "TurnitinBot",
        ],
        disallow: "/",
      },
    ],
  }
}
