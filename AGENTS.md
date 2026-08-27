# Instructions for coding agents

Read `README.md`, `docs/ARCHITECTURE.md`, `docs/AI_ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, `docs/ROADMAP.md` and `SECURITY.md` before making architectural changes.

## Non-negotiable constraints

- Preserve the application name, Advantcore Academy.
- Preserve the production path `/academy` unless the owner explicitly changes it.
- Do not expose `GROQ_API_KEY`, `GEMINI_API_KEY` or future service-role keys to client code.
- Do not commit `.env`, `.env.local` or provider credentials.
- Keep all AI provider calls in server-side modules under `lib/academy-ai`.
- Keep administrator approval as the final authority for pathway, project, source and character publication.
- Do not present simulated project experience as employment.
- Do not invent current certification rules. Use administrator-approved sources and mark information requiring verification.
- Keep the Academy domain model, prompts and product features independent from unrelated applications.

## Before committing

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Document new environment variables in `.env.example` and `docs/DEPLOYMENT.md`.
