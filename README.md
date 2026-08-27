# Advantcore Academy

Advantcore Academy is an AI-guided career learning and virtual workplace platform developed for Advantcore Ltd.

The first pathway combines preparation for the BCS Foundation Certificate in Business Analysis with a supervised, simulated Advantcore project. The product is designed to expand to additional careers, certifications, companies and educational partners.

## Current status

This repository contains the working front-end foundation and the first Academy AI service layer.

Available in this version:

- Responsive learner dashboard
- Business Analysis learning studio
- Lesson outcomes, mastery checks and quiz interaction
- BCS examination readiness indicators
- Advantcore virtual workplace
- Project stages, activities and evidence interface
- AI Project Sponsor, BA Supervisor, stakeholder and reviewer roles
- AI meeting conversation endpoint
- Browser text-to-speech
- Browser screen sharing and meeting recording
- Transcript and minutes interfaces
- Adaptive weekly planner
- Google Calendar event links
- Guided admin pathway builder
- User-approval and integration interface designs

The following production capabilities are planned but are not yet complete:

- Persistent user accounts and admin approval
- First-login password change
- Database-backed progress, projects, quizzes and schedules
- Secure document and recording storage
- Full document-grounded AI retrieval
- Google Calendar OAuth and two-way synchronisation
- Complete BCS course, question bank and full mock examinations
- Production readiness and job-readiness scoring
- Animated character avatars

See [Product Roadmap](docs/ROADMAP.md) for the recommended implementation order.

## Production address

The project is configured for:

```text
https://app.advantcore.co/academy
```

The `/academy` base path is configured in `next.config.ts` and `.env.example`.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI and vendored interface primitives
- Groq API as the first AI provider
- Google Gemini as the second AI provider
- Deterministic Academy rules as the no-key safety fallback
- Vercel deployment target
- Supabase recommended for the next authentication, PostgreSQL and storage milestone

## AI architecture

The Academy reuses only the useful provider-resilience patterns from Job AI Pro:

1. Try Groq using `GROQ_API_KEY`.
2. Fall back to Gemini using `GEMINI_API_KEY`.
3. Use the local Academy rule engine if neither provider is available.

All Academy prompts, roles and safeguards are separate from Job AI Pro. No CV tools, pages, authentication code or database models were copied.

Read [AI Architecture](docs/AI_ARCHITECTURE.md) before modifying providers, prompts or model behaviour.

## Requirements

- Node.js 22.13 or later
- npm 10 or later
- A GitHub account
- A Vercel account for deployment
- Optional Groq and Gemini API keys

The application remains usable without AI keys because it includes a restricted local fallback. Cloud AI is required for flexible, project-specific conversations.

## Local setup

1. Extract the ZIP and open the `advantcore-academy` folder.
2. Install dependencies:

```bash
npm install
```

3. Copy the environment template:

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS or Linux:

```bash
cp .env.example .env.local
```

4. Add the existing Job AI Pro provider keys to `.env.local` if required:

```env
NEXT_PUBLIC_BASE_PATH=/academy
GROQ_API_KEY=your_existing_groq_key
GEMINI_API_KEY=your_existing_gemini_key
```

5. Start development:

```bash
npm run dev
```

6. Open:

```text
http://localhost:3000/academy
```

## Quality checks

Run these before committing or deploying:

```bash
npm run typecheck
npm run lint
npm run build
```

## GitHub repository setup

Recommended repository name:

```text
advantcore-academy
```

Recommended destination:

```text
https://github.com/danielsegb/advantcore-academy
```

Create an empty repository on GitHub without adding a README, `.gitignore` or licence. Then initialise this folder:

```bash
git init
git add .
git commit -m "Initial Advantcore Academy application"
git branch -M main
git remote add origin https://github.com/danielsegb/advantcore-academy.git
git push -u origin main
```

If using Antigravity, ask it to:

```text
Open this folder as an existing Next.js project. Read AGENTS.md and all files in docs before editing. Initialise Git, create the first commit, connect the repository to https://github.com/danielsegb/advantcore-academy.git, and push the main branch. Do not expose or commit environment keys. Preserve the /academy base path.
```

## Vercel deployment summary

1. Import `danielsegb/advantcore-academy` into Vercel.
2. Keep the framework preset as Next.js.
3. Add `NEXT_PUBLIC_BASE_PATH=/academy`.
4. Add `GROQ_API_KEY` and `GEMINI_API_KEY` as encrypted environment variables.
5. Deploy.
6. Add `app.advantcore.co` as the custom domain.
7. Create the DNS record requested by Vercel.
8. Verify `https://app.advantcore.co/academy`.

Full instructions are in [Vercel and Domain Deployment](docs/DEPLOYMENT.md).

## Important limitations

- The sample learner, progress, project and administrator records are currently interface demonstration data.
- The in-memory API request limiter is suitable for a pilot, not a distributed production system.
- Browser recording is downloaded locally and is not uploaded or retained by the application.
- “Generate minutes” and several administrator actions currently represent designed workflows rather than completed persistent operations.
- The product must not describe simulated project experience as employment. Completion evidence should be issued only after human assessment and Advantcore approval.

## Repository structure

```text
app/
  api/academy-ai/       Academy AI route
  globals.css           Product visual system
  layout.tsx            Metadata and root layout
  page.tsx              Main application entry
components/
  academy-app.tsx       Main interactive product experience
  ui/                   Required interface primitives
docs/
  AI_ARCHITECTURE.md
  ARCHITECTURE.md
  DEPLOYMENT.md
  ROADMAP.md
lib/
  academy-ai/           Prompts, providers, types and fallback rules
public/                 Static assets
vendor/                 Vendored interface styles and licence
```

## Documentation

- [System Architecture](docs/ARCHITECTURE.md)
- [AI Architecture](docs/AI_ARCHITECTURE.md)
- [Vercel and Domain Deployment](docs/DEPLOYMENT.md)
- [Product Roadmap](docs/ROADMAP.md)
- [Security Guidance](SECURITY.md)
- [Contribution Guide](CONTRIBUTING.md)

## Ownership

Copyright © 2026 Advantcore Ltd. All rights reserved.

This source package is prepared for Advantcore Ltd development and deployment. No open-source licence is granted by this repository.

