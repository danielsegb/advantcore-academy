# Advantcore Academy — Production Deployment & Operations Guide

## Target Environment

```text
Repository: https://github.com/danielsegb/advantcore-academy
Production Domain: https://app.advantcore.co/academy
Hosting: Vercel (Edge & Serverless Node.js Runtime)
Database: Supabase PostgreSQL (London / West Europe eu-west-2)
```

---

## 1. Environment Variables Specification

Configure the following variables in Vercel Project Settings under **Settings > Environment Variables**:

| Variable | Scope | Sensitive | Purpose | Example / Default |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_BASE_PATH` | All | No | Base path prefix | `/academy` |
| `NEXT_PUBLIC_SUPABASE_URL` | All | No | Supabase Project URL | `https://[project-ref].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Yes | Supabase public anonymous key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Critical | Admin bypass service-role key | `eyJhbGciOi...` |
| `GROQ_API_KEY` | Server Only | Critical | Primary AI provider key (`llama-3.3-70b-versatile`) | `gsk_...` |
| `GEMINI_API_KEY` | Server Only | Critical | Secondary AI fallback key (`gemini-2.5-flash`) | `AIzaSy...` |

> [!CAUTION]
> `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, and `GEMINI_API_KEY` must **never** be prefixed with `NEXT_PUBLIC_` or imported into client components.

---

## 2. Supabase Production Database Setup (West Europe eu-west-2)

1. Sign in to the Supabase Dashboard and create a project in region **London (eu-west-2)**.
2. In the SQL Editor or using the Supabase CLI, run all SQL migrations from `supabase/migrations/`:
   ```bash
   supabase db push
   ```
3. Verify Row Level Security (RLS) is active on all tables:
   - `profiles`, `user_approvals`, `career_pathways`, `modules`, `evidence_items`, `meetings`, `readiness_snapshots`, `audit_events`.
4. Copy the API URL, Anon Key, and Service-Role Key into your Vercel Project Settings.

---

## 3. Custom Domain & DNS Mapping

To host Advantcore Academy at `https://app.advantcore.co/academy`:

1. In Vercel Project Settings, navigate to **Domains**.
2. Add `app.advantcore.co`.
3. In your DNS manager for `advantcore.co`, create the following CNAME record:
   - **Type:** `CNAME`
   - **Name:** `app`
   - **Target:** `cname.vercel-dns.com`
   - **TTL:** `60` (or automatic)
4. Once DNS propagates, Vercel will automatically provision a valid SSL/TLS certificate.
5. All traffic will seamlessly route to the Next.js application with base path `/academy`.

---

## 4. Search Engine & Anti-AI Scraping Protection

Advantcore Academy is an invite-only professional platform. The following protections are active in production:
- `X-Robots-Tag: noindex, nofollow, noarchive, noimageindex` header returned across all responses.
- `robots.txt` disallows all user agents (`User-agent: * Disallow: /`).
- Explicit root path redirect enforcing `/academy` entry point.

---

## 5. Live Production Health Monitoring

A real-time health probe is available for uptime monitors (e.g. BetterStack, Datadog):

```http
GET https://app.advantcore.co/academy/api/health
```

Expected response (`200 OK`):
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "uptimeSeconds": 3600,
  "subsystems": {
    "database": { "connected": true, "latencyMs": 14 },
    "aiEngine": { "primaryProvider": "groq", "fallbackReady": true },
    "securityQuarantine": { "active": true }
  }
}
```

---

## 6. Pre-Flight Verification Checklist

Before opening invitations to learners, run the pre-flight checks:

```bash
npm run typecheck   # 0 TypeScript errors
npm run lint        # 0 ESLint warnings/errors
npm test            # 71+ Unit, Component & E2E Integration tests pass
npm run build       # Turbopack clean production bundle
```

---

## 7. Rollback Procedures

If an incident occurs in production:
1. **Instant Vercel Rollback:** Navigate to Vercel Deployments, locate the previous known-good deployment, and click **Promote to Production**.
2. **Git Rollback:**
   ```bash
   git checkout main
   git revert HEAD
   git push origin main
   ```
