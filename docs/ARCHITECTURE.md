# System Architecture

## Product purpose

Advantcore Academy joins two experiences in one adaptive career pathway:

1. A structured learning environment for knowledge and certification readiness.
2. A supervised virtual workplace for practical activities, evidence and feedback.

Business Analysis is the first pathway. The domain must remain extensible to other careers, certifications, companies and institutions.

## Current architecture

```text
Browser
  ├─ Learner dashboard
  ├─ Learning studio
  ├─ Virtual workplace
  ├─ AI meeting room
  ├─ Adaptive planner
  └─ Admin studio
        │
        ▼
Next.js application
  ├─ React user interface
  └─ /api/academy-ai
        │
        ▼
Academy AI service
  ├─ Prompt builder
  ├─ Groq provider
  ├─ Gemini provider
  └─ Local safety fallback
```

The current interface uses demonstration data. The next production layer should introduce Supabase authentication, PostgreSQL and storage without moving AI secrets into the browser.

## Recommended production layers

### Presentation layer

- `app/` contains routes, metadata and server endpoints.
- `components/academy-app.tsx` contains the current interactive experience.
- `components/ui/` contains the required interface primitives.
- `app/globals.css` contains the Academy design system and responsive behaviour.

As the product grows, split the main component by domain:

```text
components/
  academy-shell/
  dashboard/
  learning/
  workplace/
  meetings/
  planner/
  admin/
```

### Application service layer

Create server-side services for:

- User approval and onboarding
- Pathway generation and publication
- Project creation and rescheduling
- Content ingestion and source versioning
- Quiz and mock-exam scoring
- Readiness calculation
- Meetings, transcripts and minutes
- Evidence submission and reviewer decisions
- Notifications and calendar synchronisation

UI components should call services through route handlers or server actions. They should not access service credentials directly.

### Data layer

Supabase is the recommended first production data platform because one project can provide PostgreSQL, authentication and object storage.

Recommended initial entities:

```text
organisations
companies
profiles
user_approvals
career_pathways
pathway_versions
certifications
source_documents
course_modules
lessons
question_banks
questions
quiz_attempts
projects
project_versions
project_memberships
characters
meetings
meeting_messages
meeting_minutes
tasks
schedule_dependencies
evidence_items
reviews
readiness_snapshots
notifications
```

Every user-owned table should include ownership or organisation scope and use Row Level Security.

### File layer

Store document, image, audio and recording bytes in object storage. Store searchable metadata and permissions in PostgreSQL.

Recommended storage groups:

- `knowledge-sources`
- `project-resources`
- `user-evidence`
- `meeting-recordings`
- `character-assets`
- `exports`

Do not store large file bodies in database text fields.

## Main domain boundaries

### Identity and approval

The administrator can create or invite a user. A new user must remain pending until approved. The production authentication milestone should support:

- Invitation or administrator-created account
- Default or temporary credential delivered securely
- Mandatory password change at first login
- Pending, active, suspended and archived states
- Learner, reviewer and administrator roles
- Organisation-level membership for future institutional customers

Do not store plain-text passwords or send permanent passwords by email.

### Learning

A career pathway contains a versioned curriculum. A curriculum contains modules, lessons, outcomes, activities and assessment rules.

Important rules:

- State lesson objectives and outcomes before content.
- Store every attempt, not only the best score.
- Use the administrator-defined mastery threshold, initially 90%.
- Withhold detailed answers until the configured attempt policy permits them.
- Separate Academy readiness targets from the official certification pass mark.
- Version certification rules and record their source and verification date.

### Workplace

A project belongs to a company and career pathway. Each project should define:

- Business context
- Objective and success measures
- Scope and exclusions
- Stages and dependencies
- Stakeholder roles
- Required evidence
- Review gates
- Approved knowledge sources
- Completion conditions

Project characters should share project context while retaining separate role instructions and access boundaries.

### Meetings

A meeting includes participants, purpose, agenda, project context, messages, transcript, minutes, recording metadata and follow-up tasks.

The browser may capture audio, video or screen content only after explicit user permission. Production recording requires clear consent, a visible recording state, retention rules and access control.

### Scheduling

Tasks and events should use explicit dependencies instead of only calendar dates.

When an activity changes:

1. Identify its dependent activities.
2. Calculate the smallest valid date adjustment.
3. Protect fixed deadlines and human-approved meetings.
4. Present the proposed changes.
5. Apply only after user confirmation.
6. Record the schedule revision.

### Readiness

Keep separate measures for:

- Knowledge mastery
- Mock-exam performance
- Workplace evidence completion
- Reviewer approval
- Practical skill performance
- Portfolio completeness
- Application and interview readiness

Do not reduce readiness to one opaque AI opinion. Store the factors and calculation version behind every score.

## Extensibility

Avoid Business Analysis-specific columns in general pathway tables. Put pathway-specific rubrics, templates and character instructions in versioned configuration or child tables.

The same core should support:

- Project Management
- Data Analysis
- Cyber Security
- Software Testing
- Education and teaching pathways
- Company onboarding simulations
- Institution-specific programmes

## Observability

Before public launch, add:

- Structured server logs without document contents or secrets
- AI latency, provider and fallback metrics
- Request and error counts
- Schedule recalculation audit events
- Administrator publication audit history
- User-facing error references
- Alerts for repeated provider failures

## Testing strategy

Add tests at three levels:

- Unit tests for scoring, schedule dependency and AI fallback rules
- Integration tests for API routes, authentication and persistence
- End-to-end tests for onboarding, learning, meeting and project completion flows

