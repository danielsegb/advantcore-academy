# Academy AI Architecture

## Design goal

The Academy uses one server-side AI service for meetings, learning feedback, pathway recommendations and evidence review. New features should add an Academy action and prompt, rather than creating separate provider integrations.

## Core AI service patterns

The AI service uses these patterns:

- Groq as the first provider
- Gemini as the second provider
- A deterministic local fallback
- Central prompt construction
- Server-side provider keys
- Input sanitisation and request limits

The AI layer is limited to Academy-specific prompts, actions and safeguards. Unrelated product services and data models are outside this repository.

## Provider sequence

```text
Academy request
  │
  ├─ Groq model 1
  ├─ Groq model 2
  │
  ├─ Gemini model 1
  ├─ Gemini model 2
  │
  └─ Academy local rule engine
```

The current configured models are defined in `lib/academy-ai/engine.ts`. Model availability changes over time. Verify models against official provider documentation before changing or publishing them.

## Environment variables

```env
GROQ_API_KEY=
GEMINI_API_KEY=
```

These are server-only values. Do not prefix them with `NEXT_PUBLIC_` and do not access them from client components.

## Files

```text
lib/academy-ai/types.ts
  Request actions, payload and provider result types.

lib/academy-ai/prompts.ts
  Role-specific instructions, grounding rules and output requirements.

lib/academy-ai/engine.ts
  Provider calls, timeout handling and fallback sequence.

lib/academy-ai/local-fallback.ts
  Restricted, deterministic responses when cloud AI is unavailable.

app/api/academy-ai/route.ts
  Server endpoint, sanitisation, action validation and pilot rate limiting.
```

## Current actions

### `meetingReply`

Generates a context-aware response for an approved project character.

Inputs can include:

- Character name, role and behaviour
- Project name, company, objective and stage
- Approved project context
- User message

### `quizFeedback`

Scores an answer against expected concepts. The local fallback uses transparent concept matching. Cloud output is requested as JSON.

### `pathwayRecommendation`

Recommends a pathway outline while labelling information that needs current external verification and administrator approval.

### `evidenceReview`

Reviews submitted text against an approved rubric. It must not approve evidence when no assessment standard is available.

## Prompt rules

All Academy actions inherit these controls:

- Use natural British English.
- Remain within approved project, pathway and source context.
- Do not invent company facts, learner evidence or certification rules.
- Identify missing information.
- Do not claim the simulation is employment.
- Do not replace required human sign-off.

## Adding a new action

1. Add the action to `AcademyAIAction` in `types.ts`.
2. Define the request fields.
3. Add a prompt branch in `prompts.ts`.
4. Add a deterministic response in `local-fallback.ts`.
5. Add the action to `validActions` in the API route.
6. Add schema validation for structured output.
7. Add tests for success, missing context and no-key fallback.
8. Document the action here.

Do not create a new Groq or Gemini client inside a page or feature route.

## Production improvements

Before wider deployment:

- Replace the in-memory rate limiter with a distributed limiter.
- Add schema validation with Zod for every action.
- Add authenticated user and organisation checks.
- Store prompt template versions.
- Record provider, model, latency, token count and fallback state without storing sensitive prompt text in logs.
- Add per-organisation usage limits.
- Add retrieval from approved documents with source citations.
- Add prompt-injection controls for uploaded content.
- Add output moderation and administrator review for generated curriculum.
- Add provider circuit breaking to avoid repeatedly calling an unavailable service.

## Document-grounded conversations

The recommended retrieval process is:

1. Upload a source to private object storage.
2. Extract text on the server.
3. Retain source ID, version, page or section and owner.
4. Split text into bounded chunks.
5. Generate embeddings using an approved model.
6. Retrieve only records authorised for the user and project.
7. Supply retrieved text to the prompt as untrusted evidence.
8. Require the AI to cite the supplied source identifiers.
9. Keep administrator publication and reviewer approval separate from AI output.

## Character architecture

Each character should have:

- Stable ID
- Display name and role
- Behavioural instruction
- Project membership
- Knowledge access scope
- Objectives and decision rights
- Escalation boundaries
- Approved visual asset
- Version and administrator approval state

Shared project facts should be stored once. Character prompts should reference those facts and add role-specific perspective without duplicating provider integrations.
