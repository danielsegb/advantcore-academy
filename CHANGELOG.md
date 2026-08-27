# Changelog

## 0.2.0, 27 August 2026

- Refactored monolithic application into domain modules (`academy-shell`, `dashboard`, `learning`, `workplace`, `meetings`, `planner`, `admin`).
- Added typed environment configuration and API payload validation using Zod.
- Added structured JSON server logging with request ID tracking and PII sanitisation.
- Added comprehensive unit and component test harness using Vitest and React Testing Library.
- Added Playwright end-to-end smoke test suite.
- Added GitHub Actions CI pipeline for automated typecheck, lint, test, and build validation.
- Added Dependabot configuration and pull request template.
- Added edge and application-level root redirects (`/` -> `/academy`) and strict multi-layer anti-indexing rules.

## 0.1.0, 27 August 2026

- Added Advantcore Academy learner dashboard.
- Added Business Analysis learning studio and mastery quiz interaction.
- Added Advantcore virtual workplace and project evidence interface.
- Added simulated AI project team and meeting room.
- Added browser speech, screen sharing and recording controls.
- Added adaptive planning and Google Calendar event links.
- Added guided administration interface.
- Added shared Groq, Gemini and local fallback AI architecture.
- Added GitHub, Vercel and `/academy` deployment configuration.


