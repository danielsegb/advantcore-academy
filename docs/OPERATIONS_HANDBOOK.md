# Advantcore Academy — Operations Handbook & Incident Response Runbook

## 1. System Architecture Summary

```text
Client Browser (Next.js 16 App Router / React 19)
    │
    ├── Base Path: /academy
    ├── Auth & RLS: Supabase Auth + JWT
    │
    ├── Serverless API Routes (/academy/api/*)
    │     ├── /api/academy-ai (Groq -> Gemini -> Fallback)
    │     ├── /api/learning/* (Progress & 40-Q Mock Exam Engine)
    │     ├── /api/workplace/evidence (Deliverables & Review Decisions)
    │     ├── /api/meetings (Session Minutes & Transcripts)
    │     ├── /api/planner/schedule (12-Week Adaptive Scheduler)
    │     ├── /api/compliance/* (Magic-Byte Uploads & DSAR Export)
    │     └── /api/health (Live Diagnostic Health Probes)
    │
    └── PostgreSQL Database (Supabase eu-west-2, London UK)
```

---

## 2. Incident Response Runbooks

### Runbook A: Cloud AI Provider Outage (Groq / Gemini Down)
1. **Detection:** High error rate or degraded status returned by `/api/health`.
2. **Behavior:** The AI Waterfall automatically falls back to `lib/academy-ai/local-fallback.ts`. The platform remains fully functional in deterministic mode.
3. **Action:**
   - Verify API status at `status.groq.com` and `status.cloud.google.com`.
   - Rotate API keys in Vercel Environment Variables if quota is exhausted.

### Runbook B: Suspected Compromised Key
1. **Immediate Revocation:**
   - In Supabase Dashboard: Go to **Settings > API**, generate a new Anon / Service-Role key.
   - In Groq Console / Google AI Studio: Revoke existing keys and generate new tokens.
2. **Deploy Secrets:**
   - Update Vercel Environment Variables.
   - Trigger a redeployment in Vercel.

### Runbook C: Malicious File Upload Detected
1. **Isolation:** Uploads failing magic-byte inspection are rejected with 400 Bad Request.
2. **Investigation:** Inspect the `audit_events` table for action `DOCUMENT_UPLOAD_QUARANTINED`.
3. **Action:** If an account repeatedly attempts prohibited uploads, suspend the account via **Admin Studio > User Management**.

---

## 3. Disaster Recovery & Backup Plan

- **Database Backups:** Daily automated backups managed by Supabase in West Europe (eu-west-2). Point-in-time recovery (PITR) available.
- **Application Code:** Redundant Git version history hosted on GitHub (`danielsegb/advantcore-academy`).
- **Recovery Time Objective (RTO):** < 15 minutes via instant Vercel rollback.
