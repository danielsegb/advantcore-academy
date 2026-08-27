# Service and Integration Register

This register details all external cloud services, internal engines, free-tier limits, quotas, and fallback strategies utilised by Advantcore Academy.

---

## 1. Hosting, Edge & Deployment

### Vercel (Production & Preview Hosting)
- **Role**: Edge routing, Next.js serverless compute, asset delivery.
- **Tier**: Free / Hobby Tier.
- **Limits & Quotas**:
  - Bandwidth: 100 GB / month.
  - Serverless Function Execution: 100 GB-hours / month.
  - Edge Middleware / Redirects: Generous free allowance.
  - Max function duration: 30 seconds (configured in `vercel.json`).
- **Cost Risk**: Zero automatic billing; builds pause if free limits are reached.
- **Failover / Fallback**: Standalone Docker container / self-hostable Next.js build.

---

## 2. Data, Authentication & Storage

### Supabase (Database, Auth, Object Storage)
- **Role**: Primary relational database, Row Level Security, user authentication, and private file storage.
- **Tier**: Free Tier.
- **Limits & Quotas**:
  - Database Storage: 500 MB (PostgreSQL).
  - File Object Storage: 1 GB.
  - Monthly Active Users (MAU): Up to 50,000.
  - Auth emails: Rate-limited on free SMTP (recommend custom SMTP or Admin-generated invite codes for pilot).
  - Inactivity pause: Projects pause after 1 week of inactivity (can be restored with one click).
- **Cost Risk**: No automatic charges.
- **Safeguards**:
  - Store binary media (recordings, PDFs) in storage buckets, never in database rows.
  - Enforce file size caps (max 10MB per document).
  - Purge temporary or draft evidence periodically.

---

## 3. Artificial Intelligence Providers

### Groq Cloud API (Primary AI Provider)
- **Role**: Fast conversational AI responses for meeting simulations, quiz coaching, and evidence analysis.
- **Tier**: Free Developer Tier.
- **Configured Models**:
  - `llama-3.3-70b-versatile`
  - `llama-3.1-8b-instant`
- **Limits & Quotas**:
  - Rate limits: 30 Requests / Min (RPM), ~6,000 Tokens / Min (TPM) depending on model.
- **Safeguards & Fallback**:
  - Server-side caching and prompt trimming (max 700 output tokens).
  - Automatic waterfall fallback to Gemini on HTTP 429 / 5xx / timeout.

### Google Gemini API (Secondary AI Provider)
- **Role**: Secondary conversational provider, structured schema extraction, and future document embeddings.
- **Tier**: Google AI Studio Free Tier.
- **Configured Models**:
  - `gemini-2.5-flash`
  - `gemini-2.0-flash`
- **Limits & Quotas**:
  - 15 RPM / 1,500 RPD on free tier.
- **Safeguards & Fallback**:
  - Waterfall fallback to local rule engine if Groq and Gemini are both unavailable.

### Academy Local Rule Engine (Deterministic Safety Fallback)
- **Role**: 100% resilient, offline-capable rule engine providing structured responses, transparent concept matching, and template-based coaching.
- **Tier**: Self-hosted (zero external dependency, 0ms latency, zero cost).
- **Engine Identifiers**:
  - `academy-rule-engine-v1` (Meeting conversation coaching)
  - `academy-mastery-engine-v1` (Quiz scoring and concept validation)
  - `academy-pathway-rules-v1` (Curriculum structure recommendations)
  - `academy-evidence-rules-v1` (Evidence review rubrics)
- **Limits**: Unlimited.

---

## 4. Browser Native APIs (Zero Cloud Cost)

| API | Purpose | Cost | Notes |
| --- | --- | --- | --- |
| **Web Speech API** (`SpeechSynthesis`) | Reads AI character responses aloud | Free | Uses browser native text-to-speech engine |
| **Screen Capture API** (`getDisplayMedia`) | Share slides, process maps, or UI in meeting room | Free | Client-side only; requires explicit user permission |
| **MediaStream Recording** (`MediaRecorder`) | Capture meeting simulations | Free | Generates `.webm` video/audio downloaded directly to user's device |
| **Google Calendar Link Generator** | Add study sessions and meetings to calendar | Free | Uses client-side URL parameter templates (`calendar.google.com/render?action=TEMPLATE`); requires zero API keys or OAuth quota |

---

## 5. Security & Secret Management

- **Client-Side Exposure**: `NEXT_PUBLIC_BASE_PATH` only.
- **Server-Side Only**: `GROQ_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Step 2).
- **Environment Policy**: Stored in `.env.local` for development, configured in Vercel Project Settings for production. Never committed to Git.
