# Architecture Decision Records (ADRs)

This document formalises the architectural, security, and product decisions governing Advantcore Academy.

---

## ADR-001: Dedicated Base Path `/academy` and Multi-Zone Reverse Proxy

- **Status**: Accepted
- **Context**: Advantcore Academy is part of the Advantcore technology ecosystem and must reside under the unified domain `https://app.advantcore.co/academy`. It is also deployed on Vercel at `https://advantcore-academy.vercel.app/academy`.
- **Decision**: 
  1. Next.js is configured with `basePath: "/academy"`.
  2. The parent application hub at `app.advantcore.co` rewrites `/academy` and `/academy/:path*` to the Academy Vercel deployment.
  3. Automatic root redirects (`/` $\rightarrow$ `/academy`) are configured at both the Next.js and Vercel edge layers (`vercel.json`) to prevent 404 errors for direct domain visits.
- **Consequences**: All internal links, assets, API routes, and router calls must respect `basePath`. Assets load under `/academy/_next/`.

---

## ADR-002: Launch Mode Strategy — Invite-Only Pilot

- **Status**: Accepted
- **Context**: The product must ensure high pedagogical quality, controlled AI usage, and data confidentiality before general availability.
- **Decision**: The initial production deployment will be restricted to an invite-only pilot. Self-registration is disabled.
- **Consequences**: Only Administrators can create or invite learners. Accounts remain pending until explicitly activated by an Administrator.

---

## ADR-003: Strictly Free-Tier Service Policy

- **Status**: Accepted
- **Context**: The owner requires all production systems to operate without chargeable commitments or automatic paid conversions during development and initial pilot.
- **Decision**: 
  1. Rely exclusively on free tiers of established cloud providers (Vercel, Supabase, Groq, Google AI Studio).
  2. No infrastructure component may require a credit card or auto-scaling billing threshold.
  3. Implement strict client- and server-side rate limits, request batching, and in-memory/edge safeguards.
  4. Build a deterministic local rule engine fallback for all AI features when external cloud rate limits or outages occur.
- **Consequences**: System limits (storage, tokens, database size) must be documented in `docs/SERVICE_REGISTER.md` and monitored actively.

---

## ADR-004: Primary Data & Auth Platform — Supabase

- **Status**: Accepted
- **Context**: The platform requires relational data modelling (users, pathways, projects, tasks, evidence), authenticated user sessions, Row Level Security, and private document storage.
- **Decision**: Use Supabase as the unified backend platform (PostgreSQL database, Supabase Auth, Row Level Security, and private S3-compatible Storage Buckets).
- **Consequences**: Schema migrations must be version-controlled in `supabase/migrations/`. Privileged service-role keys remain strictly server-side.

---

## ADR-005: Two-Tier Platform Account Model with Pathway-Scoped Staff Roles

- **Status**: Accepted
- **Context**: Need a clear, auditable distinction between general platform administrators and simulated/human project staff.
- **Decision**:
  1. **Platform Account Types**:
     - `Admin`: Full governance, user onboarding, pathway/project creation, content publication, character management.
     - `Learner`: Enrolled in assigned pathways/projects, submits evidence, participates in learning and simulations. Temporary passwords must be changed upon first login.
  2. **Pathway/Project Staff Roles**:
     - `Project Sponsor`, `BA Supervisor`, `Operational Stakeholder`, `Independent Reviewer`.
     - These roles are **not** platform administrators. Their knowledge, actions, and permissions are strictly bounded to their assigned pathway/project.
     - Initially operate as AI characters configured per project, with the data model designed to support assigning human staff accounts to these roles without architectural changes.
- **Consequences**: Clean RBAC and RLS policies separating platform-wide governance from project-level activity.

---

## ADR-006: Server-Side Multi-Provider AI Waterfall

- **Status**: Accepted
- **Context**: AI interactions (meetings, quiz feedback, pathway structure, evidence review) must be resilient, private, and cost-free.
- **Decision**:
  1. Centralised server-side AI engine under `lib/academy-ai/`.
  2. Waterfall execution sequence:
     - Primary: Groq Cloud API (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`)
     - Secondary: Google Gemini API (`gemini-2.5-flash`, `gemini-2.0-flash`)
     - Fallback: Local deterministic rule engine (`academy-rule-engine-v1`)
  3. Zero client-side API keys. Zero provider SDKs exposed to browser code.
- **Consequences**: Total service availability even during external provider outages or rate limit exhaustion.

---

## ADR-007: Strict Anti-Indexing & Anti-AI Scraping Policy

- **Status**: Accepted
- **Context**: The platform is private and invite-only; content, simulations, and URLs must not be indexed by public search engines or crawled by AI model trainers.
- **Decision**:
  1. Edge HTTP headers: `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai` configured in `vercel.json` and `next.config.ts`.
  2. Dynamic and static `robots.txt` blocking all user agents (`User-agent: *`, `Disallow: /`) and specifically targeting AI scrapers (GPTBot, ClaudeBot, Google-Extended, etc.).
  3. HTML layout metadata with complete anti-crawling and anti-AI meta tags.
- **Consequences**: Zero discoverability on public search engines or AI data collection pipelines across all domains.

---

## ADR-008: Confidentiality & Media Handling Controls

- **Status**: Accepted
- **Context**: Learner documents, evidence submissions, audio, video, and screen recordings contain personal and confidential information.
- **Decision**:
  1. All uploaded files stored in private Supabase buckets with signed, time-limited download URLs.
  2. Screen capture and browser recording require explicit, per-session user consent with visible recording state indicators.
  3. Browser recordings are processed client-side and saved locally unless explicitly submitted to private project evidence.
  4. Data encrypted in transit (TLS 1.3) and at rest (AES-256).
- **Consequences**: Fully compliant with data protection principles, preventing unauthorized data exposure.

---

## ADR-009: Human Authority & Anti-Hallucination Safeguards

- **Status**: Accepted
- **Context**: Certification standards (e.g. BCS Business Analysis) and student portfolios must remain strictly truthful and verifiable.
- **Decision**:
  1. All AI prompts must follow strict guardrails: British English, stay within supplied approved source context, never invent facts, never claim simulation is employment.
  2. AI output is assistive only; human Administrator approval is mandatory before any pathway, curriculum, or character is published.
  3. Evidence sign-off requires authorized supervisory review.
- **Consequences**: Eliminates hallucinations and protects professional assessment credibility.
