# Feature Matrix and Capability Audit

This matrix provides a detailed, evidence-based audit of every screen, view, modal, button, and service in Advantcore Academy, classifying its current prototype status versus its target production implementation.

---

## 1. Status Classifications

- **Working**: Fully operational, client/server connected, and verifiable.
- **Demonstration**: Visual UI present with static or client-side mock data; not persistent across page refreshes.
- **Partial**: Operational in basic form (e.g. client-side only or in-memory) but requires server-side persistence, validation, or security hardening.
- **Absent**: Visual placeholder or button present, but underlying functionality is not yet wired.

---

## 2. Comprehensive Feature Matrix

### 2.1 Navigation & Shell

| Feature / Element | Current State | Target State | Target Milestone | Notes |
| --- | --- | --- | --- | --- |
| **Sidebar Navigation** | Working | Working | Step 1 | Switches between Dashboard, Learning, Workplace, Meetings, Planner, Admin |
| **Brand Header** | Working | Working | Step 1 | Returns to Dashboard |
| **User Profile in Footer** | Demonstration | Working | Step 2 | Currently hardcoded as "Daniel (DE)"; will reflect authenticated user |
| **Top Bar Pathway Selector** | Demonstration | Working | Step 3 | Hardcoded to "Business Analysis"; will dynamically switch active pathways |
| **Search (⌘K)** | Demonstration | Working | Step 4 | Currently triggers visual button; will open command palette search |
| **Notifications Bell** | Demonstration | Working | Step 7 | Static indicator; will display scheduled activity & reviewer updates |
| **Guided Tour Modal** | Working | Working | Step 1 | Full 3-step interactive onboarding modal |

---

### 2.2 Learner Dashboard

| Feature / Element | Current State | Target State | Target Milestone | Notes |
| --- | --- | --- | --- | --- |
| **Welcome Banner & Status** | Demonstration | Working | Step 2 | Hardcoded "Good morning, Daniel", "On track"; will calculate dynamically from real data |
| **Readiness Ring (Overall)** | Demonstration | Working | Step 4 / 8 | Displays 68%; will aggregate Knowledge, Exam, Workplace, and Reviewer scores |
| **Stat Cards (4)** | Demonstration | Working | Step 4 / 5 | Course (67%), Workplace (58%), Exam (74%), Evidence (8) — will bind to database |
| **Today's Priorities List** | Demonstration | Working | Step 7 | Clicking items navigates to relevant views; will bind to dynamic adaptive task list |
| **Next Live Simulation Panel**| Demonstration | Working | Step 6 | Hardcoded to "Stakeholder discovery interview"; "Enter room" jumps to Meetings |
| **Add to Google Calendar** | Working | Working | Step 7 | Generates standard Google Calendar URL with date and event details |
| **Readiness Trajectory (3 Rings)**| Demonstration | Working | Step 4 / 8 | Exam (74%), Career (61%), Consistency (82%) — will bind to snapshot calculations |
| **Virtual Team Board** | Demonstration | Working | Step 5 | Displays Sarah, Marcus, Priya, Helen; will reflect configured project staff/characters |

---

### 2.3 Learning Studio

| Feature / Element | Current State | Target State | Target Milestone | Notes |
| --- | --- | --- | --- | --- |
| **Course Map (6 Modules)** | Demonstration | Working | Step 4 | Module list (01-06) with completion state; will bind to persistent curriculum table |
| **Exam Facts Panel** | Working | Working | Step 4 | BCS facts: 40 questions, 60 mins, 65% pass mark, 90% Academy mastery target |
| **Lesson Content Panel** | Demonstration | Working | Step 4 | Displays Module 3 Lesson 4 content; will render dynamic markdown lesson bodies |
| **Learning Outcomes Box** | Demonstration | Working | Step 4 | Displays lesson objectives; will bind to database curriculum schema |
| **Lesson Quiz Dialog** | Partial | Working | Step 4 | Interactive 3-question knowledge check with radio selection, instant scoring, and retake; will persist attempts in Supabase |
| **Mock Practice Card** | Absent | Working | Step 4 | "Practise" button present; will launch full 40-question mock exam engine |
| **Resources Button** | Absent | Working | Step 4 | Button present; will open syllabus and approved learning references |

---

### 2.4 Virtual Workplace

| Feature / Element | Current State | Target State | Target Milestone | Notes |
| --- | --- | --- | --- | --- |
| **Project Selector** | Demonstration | Working | Step 5 | Dropdown with "Enquiry-to-delivery transformation" (active) and locked project |
| **Project Summary & Facts** | Demonstration | Working | Step 5 | ADV-BA-001 dates, stakeholder count, evidence items, 58% discovery progress |
| **5-Stage Delivery Track** | Demonstration | Working | Step 5 | Initiate (done), Discover (active), Analyse, Design, Validate |
| **Current Sprint Task List** | Partial | Working | Step 5 | Tasks with progress bars and action buttons; will link to persistent project tasks |
| **Evidence Locker** | Demonstration | Working | Step 8 | Lists 4 documents (Project charter, Stakeholder register, Discovery plan, Minutes) |
| **Evidence Upload Button** | Demonstration | Working | Step 8 | Button present; will open file upload dialog to private Supabase storage |
| **Team Character Cards (4)** | Partial | Working | Step 5 | Displays Sponsor, Supervisor, Lead, Reviewer with roles; "Talk" button jumps to AI meeting |

---

### 2.5 AI Meeting Room

| Feature / Element | Current State | Target State | Target Milestone | Notes |
| --- | --- | --- | --- | --- |
| **Live Conversation Stream** | Working | Working | Step 6 | Real-time interactive AI chat with Marcus Cole (Supervisor); connected to `/api/academy-ai` |
| **Multi-Provider AI Waterfall** | Working | Working | Step 6 | Server calls Groq $\rightarrow$ Gemini $\rightarrow$ Local fallback engine seamlessly |
| **Text-to-Speech (Audio)** | Working | Working | Step 6 | Web Speech API reads character dialogue aloud with toggle mute control |
| **Screen Sharing** | Working | Working | Step 6 | Browser `getDisplayMedia` allows presenting documents/tabs within simulation |
| **Video & Audio Recording** | Working | Working | Step 6 | MediaRecorder captures meeting stream and downloads `.webm` locally to user's device |
| **Live Transcript Scroll** | Working | Working | Step 6 | Formatted chat history showing character avatar, timestamp, role, and message |
| **Add Meeting to Google Cal** | Working | Working | Step 7 | Generates standard Google Calendar meeting invitation URL |
| **Download Transcript** | Absent | Working | Step 6 | Button present; will export transcript as `.txt` / `.pdf` |
| **Generate Minutes** | Absent | Working | Step 6 | Button present; will call AI endpoint with `meetingMinutes` action |

---

### 2.6 Adaptive Plan & Calendar

| Feature / Element | Current State | Target State | Target Milestone | Notes |
| --- | --- | --- | --- | --- |
| **Weekly Kanban Board (5 Days)**| Demonstration | Working | Step 7 | Displays planned learning, workplace, and meeting activities across Mon-Fri |
| **Week Summary Stats** | Demonstration | Working | Step 7 | Planned hours (8h 20m), Complete (3/11), Forecast finish (30 Oct vs 13 Nov) |
| **Add Activity Button** | Demonstration | Working | Step 7 | Visual button; will open task creation dialog |
| **Realign Plan Button** | Demonstration | Working | Step 7 | Visual button; will trigger dependency recalculation modal |
| **Add Week to Google Calendar** | Working | Working | Step 7 | Generates recurring weekly calendar event template |
| **Dependency Viewer Button** | Absent | Working | Step 7 | Button present; will open visual schedule dependency DAG |

---

### 2.7 Admin Studio

| Feature / Element | Current State | Target State | Target Milestone | Notes |
| --- | --- | --- | --- | --- |
| **Admin Metric Cards (4)** | Demonstration | Working | Step 3 | Live pathways (1), Active projects (1), AI colleagues (4), Pending users (2) |
| **5-Step Pathway Builder** | Partial | Working | Step 3 | Step 1 (Pathway info, duration, mastery %) with interactive AI recommendation switch; Steps 2-5 need persistence |
| **Knowledge & Resources Tab** | Demonstration | Working | Step 3 | Upload landing state for syllabuses, textbooks, policies; will connect to document ingestion |
| **Users & Approvals Tab** | Demonstration | Working | Step 3 | Table listing 3 mock users (Amanda, Lewis, Nina) with "Review" / "Manage" buttons; will connect to Supabase Auth & user approval engine |
| **Integrations Tab** | Working | Working | Step 3 | Status grid for Browser speech (ready), Screen capture (ready), Google Calendar (ready), Supabase (setup) |

---

### 2.8 Server API & AI Services

| Service / Endpoint | Current State | Target State | Target Milestone | Notes |
| --- | --- | --- | --- | --- |
| **`POST /api/academy-ai`** | Working | Working | Step 1 / 6 | Validates action, sanitizes inputs, applies in-memory IP rate limiter |
| **`meetingReply` Action** | Working | Working | Step 6 | Context-aware prompt generation for project character dialogue |
| **`quizFeedback` Action** | Working | Working | Step 4 | JSON scoring (0-100), mastery evaluation, missing concepts feedback |
| **`pathwayRecommendation` Action**| Working | Working | Step 3 | AI suggestions for curriculum, duration, and project stages |
| **`evidenceReview` Action** | Working | Working | Step 8 | Rubric-based evidence analysis and gap identification |
| **Local Deterministic Fallback** | Working | Working | Step 1 / 6 | 4 offline rule engines for 100% continuous uptime |
