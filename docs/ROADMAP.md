# Product Roadmap

The current release is the interactive product foundation. The sequence below reduces rework and keeps every milestone deployable.

## Phase 1, repository and deployment

- Push the supplied package to `danielsegb/advantcore-academy`.
- Deploy on Vercel.
- Configure `app.advantcore.co`.
- Add Groq and Gemini environment variables.
- Verify `/academy` and the AI meeting endpoint.

Completion gate: the supplied interface is stable on the final HTTPS address.

## Phase 2, identity and persistent data

- Create Supabase project.
- Implement secure user registration or administrator invitation.
- Add pending and approved states.
- Require password change or secure invitation completion.
- Add learner and administrator roles.
- Persist profiles, pathways, projects, tasks and progress.
- Add Row Level Security and audit fields.

Completion gate: one learner can be approved, sign in and retain progress across devices.

## Phase 3, admin content builder

- Persist career pathways and versions.
- Add certification records and verification dates.
- Upload syllabuses, textbooks, mock papers and company resources.
- Add source status, version, owner and publication approval.
- Generate draft modules, lessons and project structures for administrator review.
- Add character creation and approval.

Completion gate: an administrator can build and publish a new draft pathway without editing code.

## Phase 4, complete BA learning environment

- Add the administrator-approved BCS syllabus structure.
- Add complete lesson content and learning outcomes.
- Add topic, mixed and full question banks.
- Store attempts, answers, rationales and mastery status.
- Implement retake and answer-release policy.
- Add two 40-question, 60-minute full mock exams.
- Add transparent examination readiness calculations.

Completion gate: a learner can complete the full BA course and receive an evidence-backed readiness report.

## Phase 5, workplace project engine

- Persist project stages, dependencies and evidence gates.
- Add stakeholder interviews, workshops and review meetings.
- Add document-grounded character context.
- Add templates for stakeholder analysis, process models, requirements, traceability, UAT and business cases.
- Add supervisor and independent reviewer decisions.
- Add portfolio export and completion evidence.

Completion gate: a learner completes an assessed Advantcore project with traceable evidence.

## Phase 6, meetings and media

- Store meeting records, messages and minutes.
- Add user recording consent.
- Add audio transcription service or an approved local model.
- Store recordings with retention controls.
- Generate minutes and actions from the transcript.
- Add character voices and approved animated avatars.
- Add presentation and document context to the meeting.

Completion gate: a meeting produces an authorised recording, transcript, minutes and follow-up activities.

## Phase 7, calendar and adaptive planning

- Add Google OAuth.
- Create, update and remove calendar events.
- Support one event or whole-week synchronisation.
- Model task and lesson dependencies.
- Propose schedule realignment after early completion or rescheduling.
- Protect fixed deadlines and require user approval.

Completion gate: Academy and Google Calendar remain synchronised and schedule changes are auditable.

## Phase 8, career readiness

- Add portfolio, CV and LinkedIn preparation.
- Add targeted application tracking.
- Reuse a supported link to Job AI Pro rather than copying its CV functions.
- Add BA interview simulation and scoring.
- Separate certification, practical and job readiness.

Completion gate: the learner receives a transparent job-readiness report and action plan.

## Phase 9, multi-pathway and institutional release

- Add organisation tenancy.
- Add company and institution branding configuration.
- Add cohort management and reviewer assignment.
- Add reporting and exports.
- Add pathway templates for additional careers.
- Add institutional privacy, retention and service documentation.

Completion gate: another organisation can operate an isolated Academy programme with its own approved content.

