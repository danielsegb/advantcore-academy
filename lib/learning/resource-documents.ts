export interface ResourceSection {
  id: string
  title: string
  content: string
}

export interface ResourceDocumentDetail {
  id: string
  title: string
  subtitle: string
  documentType: "Handbook" | "Study Guide" | "Toolkit" | "Playbook" | "Textbook"
  version: string
  description: string
  keyHighlights: string[]
  sections: ResourceSection[]
}

export const fullResourceDocuments: ResourceDocumentDetail[] = [
  {
    id: "doc-01",
    title: "01. Advantcore BA Programme Handbook",
    subtitle: "The 12-Week Business Analyst Programme (Learn, Deliver, Prove, Land)",
    documentType: "Handbook",
    version: "Version 1.0 | Advantcore Ltd Manchester",
    description: "Converts learning into verifiable evidence of business analysis capability. Governs the 12-week schedule, weekly study allocations (10-15 hrs/wk), project governance, and factual reference criteria.",
    keyHighlights: [
      "BCS Foundation Certificate in Business Analysis primary syllabus target",
      "Rigorous quality gates: Knowledge, Project, Conduct, and Portfolio gates",
      "Advantcore digital agency and bespoke software delivery operational model",
      "Strict distinction between simulated project experience and employment",
    ],
    sections: [
      {
        id: "hb-01",
        title: "1. Programme Promise & Operating Boundaries",
        content: `### 1. Programme Promise & Operating Boundaries

Advantcore Academy operates on a 4-pillar acceleration methodology: **LEARN, DELIVER, PROVE, LAND**.

1. **LEARN**: Master the official BCS Foundation in Business Analysis syllabus, grounded in the 4th Edition standard textbook.
2. **DELIVER**: Act as a Trainee Business Analyst on Advantcore's genuine *Enquiry-to-Delivery Process Transformation (ADV-BA-001)* project, authoring 10 professional deliverables.
3. **PROVE**: Validate capability through supervisor reviews (Marcus Cole), independent audit gates (Helen Grant), and two full timed 40-question mock exams.
4. **LAND**: Translate verified project evidence into high-converting CV bullet points, targeted UK job lanes, and defendable STAR interview stories.

> **CRITICAL COMPLIANCE NOTICE**:
> This programme provides supervised, simulated workplace project experience. It must never be presented to prospective employers or visa authorities as commercial employment. Advantcore provides factual completion letters confirming verified project competencies.`,
      },
      {
        id: "hb-02",
        title: "2. 12-Week Master Pathway Milestones & Review Gates",
        content: `### 2. 12-Week Master Pathway Milestones

| Phase | Weeks | Focus & Core Deliverables | Quality Review Gate |
|---|---|---|---|
| **Phase 1: Foundations & Strategy** | Weeks 1–3 | BA Lifecycle, Strategic Context (PESTLE, VMOST), Problem Statement, Project Charter | Gate 1: Problem Definition & Scope Approval |
| **Phase 2: Discovery & Process Analysis** | Weeks 4–6 | Stakeholder RACI, Discovery Interviews, As-Is Swimlanes, Gap Analysis, Options Appraisal | Gate 2: Stakeholder & Process Baseline Sign-off |
| **Phase 3: Requirements Engineering** | Weeks 7–9 | Requirements Catalogue, MoSCoW, User Stories with Given-When-Then, Data Dictionary | Gate 3: Requirements Baseline Approval |
| **Phase 4: Business Case & UAT** | Weeks 10–11 | Business Case (CapEx/OpEx, Payback, ROI), UAT Scenarios, Change Impact, Benefits Register | Gate 4: Investment & Acceptance Sign-off |
| **Phase 5: Certification & Job Landing** | Week 12 | Timed Mock Exams A & B (Target: 30/40+), Portfolio Case Study Assembly, STAR Interview Prep | Gate 5: Final Independent Portfolio Audit |`,
      },
      {
        id: "hb-03",
        title: "3. Simulated Client Context: Advantcore Ltd",
        content: `### 3. Simulated Client Context: Advantcore Ltd

**Company Background:**
Advantcore Ltd is a full-service digital agency and bespoke software development studio based in Manchester, UK. Over the past 12 months, client inbound enquiries have expanded by 65%, causing severe operational bottlenecks in the qualification and onboarding lifecycle.

**Core Project Mandate (ADV-BA-001):**
- **Sponsor:** Sarah Mitchell (Project Sponsor & Commercial Director)
- **Problem Statement:** Inbound enquiries arrive via disparate email inboxes and web forms without standardized qualification data. Leads are manually copied into disconnected spreadsheets [ADV-SOP-002], causing an average response lag of 4.8 business days and a total delivery cycle time of 14 business days.
- **Project Target:** Reduce delivery mobilization cycle time from 14 business days down to 4 business days, eliminate spreadsheet data re-entry, and establish automated qualification routing [ADV-DOC-001].`,
      },
      {
        id: "hb-04",
        title: "4. Stakeholder Roles & Governance",
        content: `### 4. Stakeholder Roles & Governance

1. **Sarah Mitchell — Project Sponsor:** Focuses on commercial payback (target < 12 months), cycle time reduction, client satisfaction, and board alignment.
2. **Marcus Cole — BA Supervisor:** Demanding but supportive mentor. Challenges unsupported assumptions, enforces BCS standards, and reviews draft deliverables.
3. **Priya Shah — Operations Lead:** Subject matter expert on daily spreadsheet friction, lead qualification delays, and team capacity constraints.
4. **Helen Grant — Independent Reviewer:** Objective external audit authority. Verifies deliverables against BCS rubrics and signs off gate milestones.`,
      },
    ],
  },
  {
    id: "doc-02",
    title: "02. BCS Foundation Study Guide & Timed Mocks",
    subtitle: "14-Module Syllabus Revision Notes, Practice Scenarios & Timed Mocks",
    documentType: "Study Guide",
    version: "Version 1.0 | BCS 4th Edition Aligned",
    description: "Structured revision guide matching the official BCS syllabus. Includes closed-book recall guidelines, 8-week certification plan, and two 40-question mock exams (Mock A and Mock B).",
    keyHighlights: [
      "Official BCS Examination: 40 questions, 60 minutes, 65% pass mark (26/40)",
      "Topic recall logs and scenario decision frameworks",
      "Strict distinction between business problems and technical solution assumptions",
      "Complete memory sheet for all core acronyms (PESTLE, VMOST, POPIT, RACI, MoSCoW)",
    ],
    sections: [
      {
        id: "sg-01",
        title: "1. Core Syllabus Notes: Modules 1 to 4",
        content: `### Module 1: What Business Analysis Is
- **Definition:** Business analysis enables change by defining needs and recommending solutions that create value.
- **Change Lifecycle:** 1. Alignment -> 2. Definition -> 3. Design -> 4. Implementation -> 5. Realisation.
- **6 Core Principles:** 1. Root causes over symptoms. 2. Business improvement over IT change. 3. Options over predetermined solutions. 4. Feasible requirements over meeting all requests. 5. Whole lifecycle over requirements definition only. 6. Negotiation over conflict avoidance.

### Module 2: BA Competencies
- **T-Shaped Profile:** Broad multi-disciplinary collaboration skills + deep domain/technical mastery.
- **3 Competency Areas:**
  - *Personal Qualities:* Communication, curiosity, critical thinking, relationship building, resilience, ethics.
  - *Business Knowledge:* Organisation structure, commercial finance, customer journeys, regulation.
  - *Professional Techniques:* Investigation, process modelling, requirements engineering, business cases, UAT.

### Module 3: Strategic Context
- **PESTLE (External):** Political, Economic, Social, Technological, Legal, Environmental macro scanning.
- **VMOST (Internal):** Vision (desired future), Mission (purpose), Objectives (SMART targets), Strategy (long-term plan), Tactics (operational actions).
- **Porter's Five Forces:** Industry rivalry, buyer power, supplier power, threat of new entrants, threat of substitutes.
- **SWOT Analysis:** Strengths, Weaknesses (Internal) vs Opportunities, Threats (External). Built *after* evidence gathering.

### Module 4: Business Analysis Service Framework (BASF)
- **6 Core Services:** 1. Situation investigation & problem analysis. 2. Feasibility assessment & business case. 3. Business process improvement. 4. Requirements definition. 5. Business acceptance testing. 6. Business change deployment.`,
      },
      {
        id: "sg-02",
        title: "2. Core Syllabus Notes: Modules 5 to 9",
        content: `### Module 5: Investigating Business Situations
- **Techniques:** Interviews (depth), Workshops (shared agreement), Observation (actual behaviour), Questionnaires (broad sample), Scenarios & Prototyping (resolving uncertainty), Rich Pictures (messy problems).
- **Triangulation:** Corroborating findings across multiple independent sources (e.g. compare interview notes with raw transaction logs).

### Module 6: Stakeholder Analysis & Management
- **Mendelow's Power-Interest Grid (9 Combinations):**
  - *High Power / High Interest:* Key Players -> Manage closely, active partnership.
  - *High Power / Low Interest:* Keep satisfied, monitor influence.
  - *Low Power / High Interest:* Keep informed, show consideration.
  - *Low Power / Low Interest:* Minimal effort, monitor via newsletters.
- **RACI Matrix:** Responsible (does work), Accountable (owns outcome - exactly 1 person), Consulted (2-way input), Informed (1-way updates).

### Module 7 & 8: Improving Processes & Defining Solutions
- **Process Hierarchy:** Enterprise -> Event-Response -> Actor-Task.
- **Swimlane Conventions:** Swimlanes represent roles/departments; diamonds represent decision points (always formulated as questions).
- **POPIT Gap Analysis:** People, Organisation, Process, Information, Technology.
- **Options Appraisal:** Must ALWAYS include **Option 1: Do Nothing (Business as Usual)** as the baseline benchmark.

### Module 9: Making the Business Case
- **Structure:** Executive summary, current situation, options appraisal, cost-benefit analysis, risk log, recommendation.
- **Financial Metrics:**
  - *Payback Period:* Time required for cumulative benefits to recover the initial capital investment.
  - *Simple ROI:* (Net Benefits / Total Costs) x 100%.`,
      },
      {
        id: "sg-03",
        title: "3. Core Syllabus Notes: Modules 10 to 14",
        content: `### Module 10: Establishing Requirements
- **Hierarchy:** Business Requirements -> Stakeholder/User Requirements -> Solution Requirements (Functional & Non-Functional).
- **Non-Functional Requirements (NFRs):** Performance, Security, Availability, Usability, Accessibility, Backup/Recovery, Scalability.
- **MoSCoW Prioritisation:**
  - **Must have:** Critical for delivery; project fails without it; no viable workaround. Requires documented consequence if omitted.
  - **Should have:** Highly desirable and valuable, but a temporary workaround exists.
  - **Could have:** Nice to have if extra time/budget permits.
  - **Won't have this time:** Explicitly out of scope for the current release.

### Module 11 & 12: Documenting, Modelling & Validating Requirements
- **User Story 3Cs:** Card (placeholder), Conversation (exploration of details), Confirmation (acceptance criteria).
- **Given-When-Then (GWT):** Given [initial context], When [action/trigger occurs], Then [observable verifiable outcome].
- **Traceability Matrix:** Links Business Objectives -> Requirements -> Process Models -> Solution Components -> UAT Test Cases -> Realised Benefits.

### Module 13 & 14: Delivering Requirements & Solutions
- **UAT (User Acceptance Testing):** Business users execute realistic operational scenarios to confirm business fitness.
- **Benefits Realisation:** Benefits are tracked by an assigned Operational Benefit Owner after go-live using baseline vs target KPI reviews.`,
      },
      {
        id: "sg-04",
        title: "4. Rapid Memory Sheet & Exam Recall Cues",
        content: `### 4. Rapid Memory Sheet

| Acronym | Full Form & Memory Cue | Core Exam Rule |
|---|---|---|
| **PESTLE** | Political, Economic, Social, Technological, Legal, Environmental | External macro scan. Every point must cite an observable fact, not opinion. |
| **VMOST** | Vision, Mission, Objectives, Strategy, Tactics | Internal strategic alignment. Objectives must be SMART (measurable). |
| **POPIT** | People, Organisation, Process, Information, Technology | Holistic system analysis. Technology is only one of 5 dimensions. |
| **RACI** | Responsible, Accountable, Consulted, Informed | Exactly one person Accountable per activity to prevent diffusion of responsibility. |
| **MoSCoW** | Must, Should, Could, Won't have this time | Every Must requires a defensible consequence if omitted. |
| **GWT** | Given, When, Then | Acceptance criteria must state observable, verifiable test conditions. |
| **ROI** | (Benefit - Cost) / Cost x 100% | Compare net financial return against total investment. |
| **CSF vs KPI** | Critical Success Factor vs Key Performance Indicator | CSF = what MUST go right. KPI = how we measure if it is going right. |`,
      },
    ],
  },
  {
    id: "doc-03",
    title: "03. Advantcore BA Work Experience & Portfolio Toolkit",
    subtitle: "Editable Delivery Templates & Verified Project Deliverables",
    documentType: "Toolkit",
    version: "Version 1.0 | Advantcore Delivery Workspace",
    description: "Standard delivery pack containing 10 verified templates used on Advantcore's Enquiry-to-Delivery Transformation project. Prepares learners for independent supervisor reviews.",
    keyHighlights: [
      "10 real deliverable templates with clear acceptance criteria",
      "Direct integration with Sarah Mitchell (Sponsor) and Helen Grant (Reviewer)",
      "Factual case study building for post-programme interviews",
    ],
    sections: [
      {
        id: "tk-01",
        title: "1. Stage 1: Problem Statement & Project Charter",
        content: `### Deliverable 1.1: Executive Problem Statement
- **Template Fields:** Business Context, Observed Failure Points, Quantitative Impact (Volume, Delay, Error rate), Desired Outcomes, Non-Assumed Solutions.
- **Advantcore Example:** Inbound leads arrive via unstructured emails with an average response lag of 4.8 business days, causing an 18% enterprise lead abandonment rate and a 14-day total delivery cycle time.

### Deliverable 1.2: Advantcore Project Charter (ADV-DOC-001)
- **Template Fields:** Project Title, Sponsor, Objectives, In-Scope Boundaries, Out-of-Scope Exclusions, Milestone Schedule, Key Constraints, Success Measures.
- **Acceptance Criteria:** Unambiguous in-scope/out-of-scope boundaries, dependencies identified, signed off by Project Sponsor (Sarah Mitchell).`,
      },
      {
        id: "tk-02",
        title: "2. Stage 2: Stakeholder Engagement & Discovery Log",
        content: `### Deliverable 2.1: Stakeholder Power-Interest Matrix & RACI
- **Template Fields:** Stakeholder Name, Role, Power (H/M/L), Interest (H/M/L), Strategic Quadrant, Engagement Action, RACI Activity Matrix.
- **Key Roles:** Sarah Mitchell (Sponsor), Marcus Cole (Supervisor), Priya Shah (Operations Lead), Helen Grant (Independent Reviewer).

### Deliverable 2.2: Discovery Findings & Pain Point Register
- **Template Fields:** Discovery ID, Process Step, Observed Pain Point, Source Evidence, Root Cause (5 Whys), POPIT Impact Dimension, Candidate Response.`,
      },
      {
        id: "tk-03",
        title: "3. Stage 3 & 4: Process Maps & Requirements Catalogue",
        content: `### Deliverable 3.1 & 3.2: As-Is vs To-Be Swimlane Models
- **As-Is Map:** Highlights 3 distinct swimlanes (Enquiry Intake, Sales Scoping, Mobilisation) and documents the 4.8-day delay bottleneck in 'Leads_2026.xlsx'.
- **To-Be Model:** Eliminates duplicate spreadsheet re-entry, introduces automated qualification triggers, and targets 4-day cycle time.

### Deliverable 4.1: Prioritised Requirements Catalogue
- **Template Fields:** Req ID, Requirement Statement, Category (Functional / Non-Functional / Constraint), Source, MoSCoW Priority, Acceptance Criteria, Traceability Link.

### Deliverable 4.2: User Story Backlog & Acceptance Criteria
- **Format:** As a [Role], I want [Capability], So that [Business Value].
- **Scenarios:** Given [Precondition], When [Trigger Action], Then [Expected Result].`,
      },
      {
        id: "tk-04",
        title: "4. Stage 5: Business Case & Portfolio Assembly",
        content: `### Deliverable 5.1: Business Case Options Appraisal
- **Options Compared:**
  - *Option 1:* Do Nothing (Business as Usual) — £0 CapEx, but £42,000/yr ongoing lost opportunity cost.
  - *Option 2:* CRM Workflow Automation & Dynamic Intake — £12,500 CapEx, £2,400/yr OpEx, Payback in 7.4 months, ROI of 145%.
  - *Option 3:* Custom Web Portal & Mobile App — £48,000 CapEx, £8,000/yr OpEx, Payback in 26 months.
- **Recommendation:** Option 2 based on strategic fit, rapid payback, and low disruption risk.

### Deliverable 5.2: Assessed Portfolio Case Study
- Complete 10-artefact evidence dossier formatted for independent verification and career presentation.`,
      },
    ],
  },
  {
    id: "doc-04",
    title: "04. Business Analyst Job Landing Playbook",
    subtitle: "Position Verified Experience, Target BA Lanes & Ace Technical Interviews",
    documentType: "Playbook",
    version: "Version 1.0 | Career Execution Guide",
    description: "Strategic career guide mapping verified project experience to the UK job market. Details 4 target BA lanes, CV bullet formulas, STAR interview scenarios, and recruiter positioning.",
    keyHighlights: [
      "4 distinct career lane positioning strategies",
      "Truth in simulation guidelines (ethical representation of simulated projects)",
      "Conversion tracking metrics (applications -> screening -> interviews -> offers)",
      "10 essential interview question STAR models",
    ],
    sections: [
      {
        id: "jp-01",
        title: "1. The 4 Target BA Career Lanes in the UK",
        content: `### 1. The 4 Target BA Career Lanes

1. **Digital / IT Business Analyst:** Focuses on software platforms, CRM/ERP integration, APIs, Agile user stories, and development sprint backlog refinement.
2. **Business Process Analyst:** Focuses on value streams, BPMN process mapping, bottleneck elimination, Lean Six Sigma metrics, and operating model redesign.
3. **Business Change Analyst:** Focuses on target operating models (TOM), POPIT change impact assessments, stakeholder readiness, communication, and training rollout.
4. **Product Business Analyst / Associate Product Manager:** Focuses on customer journey mapping, feature discovery, minimum viable products (MVPs), and backlog prioritisation.`,
      },
      {
        id: "jp-02",
        title: "2. Evidence-Backed CV Bullet Formulas",
        content: `### 2. Evidence-Backed CV Bullet Formulas

Use the **Action Verb + Context + Technique + Measurable Outcome** formula:

- *"Spearheaded business discovery for Advantcore's enquiry intake process, facilitating 4 stakeholder workshops and constructing As-Is BPMN swimlanes that isolated 3 major data-entry bottlenecks."*
- *"Authored a comprehensive 24-item Requirements Catalogue and Agile User Story backlog with Given-When-Then acceptance criteria, securing unanimous baseline sign-off from the Project Sponsor."*
- *"Developed a comprehensive Business Case evaluating 3 delivery options with cost-benefit analysis and payback period modeling, recommending a workflow automation solution delivering a projected 145% ROI and cycle time reduction from 14 to 4 days."*
- *"Formulated a POPIT change impact assessment and UAT test plan across 15 business scenarios, ensuring seamless operational transition and zero disruption to live client services."*`,
      },
      {
        id: "jp-03",
        title: "3. Top 5 BA Interview Scenarios & STAR Responses",
        content: `### 3. Top 5 BA Interview Scenarios & STAR Responses

#### Scenario 1: "Tell me about a time you handled conflicting stakeholder requirements."
- **Situation:** During the Advantcore enquiry intake project, the Sales Director wanted a 2-field rapid submission form, while the Delivery Lead insisted on a mandatory 15-field technical scoping checklist.
- **Task:** As the Business Analyst, I needed to resolve this conflict without delaying the project charter baseline.
- **Action:** I facilitated a focused discovery workshop using the RACI framework. We mapped the customer journey and agreed to introduce dynamic 2-stage progressive profiling.
- **Result:** Both stakeholders approved the solution. Qualification completeness improved to 94% without hurting initial inbound lead volume.

#### Scenario 2: "How do you distinguish between a business problem and a solution request?"
- **Situation:** A stakeholder requested that we immediately procure a new £30k CRM software package because 'leads were being lost'.
- **Task:** Investigate the root cause before committing capital expenditure.
- **Action:** Applied the 5 Whys and POPIT model. Analysis of enquiry logs revealed the CRM was functioning properly, but leads were stalling because of an undefined hand-off process between sales and delivery.
- **Result:** Recommended process restructuring and automated notification triggers, saving £30k in unnecessary software licensing.`,
      },
    ],
  },
  {
    id: "doc-05",
    title: "05. Official BCS 4th Edition Textbook Knowledge Guide",
    subtitle: "Business Analysis (Debra Paul, James Cadle, Malcolm Eva, Craig Rollason)",
    documentType: "Textbook",
    version: "4th Edition · Comprehensive Study Guide",
    description: "The definitive textbook for business analysis certification and practice. Cross-referenced throughout the Academy's 6 curriculum modules and AI tutoring responses.",
    keyHighlights: [
      "Debra Paul, James Cadle, Malcolm Eva, Craig Rollason, Jonathan Hunsley",
      "The authoritative reference standard for BCS Foundation exams",
      "14 complete chapter summaries with core definitions and diagrams",
    ],
    sections: [
      {
        id: "tb-01",
        title: "Chapters 1–3: Foundations, Competencies & Strategy",
        content: `### Chapter 1: What is Business Analysis?
- **Core Definition:** Business analysis is a specialized discipline that enables business change by identifying needs, analysing business systems holistically, and recommending viable options that deliver value.
- **The Holistic System View:** Every business system consists of Processes, People, Organisation, Information, and Technology (POPIT).
- **The 5-Stage Change Lifecycle:** Alignment -> Definition -> Design -> Implementation -> Realisation.

### Chapter 2: The Competencies of a Business Analyst
- **T-Shaped Professional:** Broad multi-disciplinary collaborative breadth + deep mastery in specific BA techniques.
- **3 Core Competency Domains:**
  1. *Personal Qualities:* Communication, critical thinking, active listening, relationship management, resilience.
  2. *Business Knowledge:* Commercial awareness, organizational structures, financial literacy, regulatory compliance.
  3. *Professional Techniques:* Elicitation, process modelling, requirements engineering, business cases, gap analysis.

### Chapter 3: The Strategic Context for Business Analysis
- **External Environmental Scanning (PESTLE):** Political, Economic, Socio-cultural, Technological, Legal, Environmental.
- **Industry Competitive Rivalry (Porter's Five Forces):** Threat of new entrants, Threat of substitutes, Bargaining power of buyers, Bargaining power of suppliers, Competitive rivalry among existing firms.
- **Internal Strategic Alignment (VMOST):** Vision (long-term aspiration), Mission (fundamental purpose), Objectives (SMART goals), Strategy (overall roadmap), Tactics (operational execution).
- **SWOT Synthesis:** Consolidates internal strengths/weaknesses with external opportunities/threats.`,
      },
      {
        id: "tb-02",
        title: "Chapters 4–7: Services, Investigation, Stakeholders & Process",
        content: `### Chapter 4: The Business Analysis Service Framework (BASF)
- The 6 standard BA services provided to modern organizations across the change lifecycle: Situation Investigation, Feasibility & Business Case, Process Improvement, Requirements Definition, Business Acceptance Testing, and Change Deployment.

### Chapter 5: Investigating the Business Situation
- **Investigation Techniques:**
  - *Interviews:* Qualitative depth; build rapport; uncover tacit knowledge.
  - *Workshops:* Collaborative consensus; resolve conflicting viewpoints rapidly.
  - *Observation:* Shadowing and protocol analysis; observe actual practice vs documented policy.
  - *Scenarios & Prototyping:* Expose hidden assumptions and test user interactions.
  - *Quantitative Sampling:* Activity sampling and document analysis for statistical validation.

### Chapter 6: Analysing & Managing Stakeholders
- **Stakeholder Categories:** Partners, suppliers, regulators, managers, employees, customers.
- **Mendelow's Power-Interest Grid (9 Strategy Combinations):** Key players (Manage closely), High power/low interest (Keep satisfied), Low power/high interest (Keep informed), Low power/low interest (Minimal effort / monitor).
- **RACI Charts:** Explicit definition of Responsible, Accountable, Consulted, and Informed roles.

### Chapter 7: Improving Business Services & Processes
- **Process Hierarchy:** Enterprise level -> Event-Response level -> Actor-Task level.
- **BPMN Swimlane Notation:** Swimlanes show actor/role responsibility. Arrows show sequence and hand-offs. Diamonds represent decision logic.`,
      },
      {
        id: "tb-03",
        title: "Chapters 8–11: Solution Options, Business Case & Requirements",
        content: `### Chapter 8: Defining the Solution
- **Gap Analysis:** Comparing As-Is baseline capability with To-Be target capability using the POPIT model.
- **Formulating Options:** Generate at least 3 distinct options: Do Nothing (BAU baseline), Do Minimum, and Do Something (Target Solution).

### Chapter 9: Making the Business Case
- **Structure:** Executive summary, current situation, options appraisal, cost-benefit analysis, risk assessment (RAID log), recommendations.
- **Costs & Benefits Matrix:** Immediate Tangible, Longer-term Tangible, Immediate Intangible, Longer-term Intangible.
- **Investment Appraisal:** Payback Period (breakeven point) and Return on Investment (ROI).

### Chapter 10: Establishing the Requirements
- **Requirements Engineering Framework:** Elicitation -> Analysis -> Specification -> Validation -> Management.
- **Requirements Taxonomy:** General Requirements (Policies, Standards, Legal), Technical Requirements (Hardware, Software, Infrastructure), Functional Requirements (Data entry, processing, reporting), Non-Functional Requirements (Performance, Security, Usability, Availability).
- **MoSCoW Prioritisation:** Must have, Should have, Could have, Won't have this time.

### Chapter 11: Documenting & Modelling Requirements
- **User Story 3Cs:** Card, Conversation, Confirmation.
- **Given-When-Then Acceptance Criteria:** Given [context/preconditions], When [event occurs], Then [observable result].`,
      },
      {
        id: "tb-04",
        title: "Chapters 12–14: Validation, Delivery & Benefits Realisation",
        content: `### Chapter 12: Validating & Managing Requirements
- **Validation Quality Checks:** Complete, consistent, clear, testable, traceable, feasible.
- **Traceability:** Horizontal (Objective <-> Requirement <-> Design <-> Test Case) and Vertical (Business Goal <-> System Function).
- **Requirements Baseline & Change Control:** Formal version control and impact assessment for all proposed changes.

### Chapter 13: Delivering the Requirements
- **Lifecycles:** Linear (Waterfall / V-Model) vs Evolutionary / Iterative (Agile Scrum / Kanban).
- **BA Role in Delivery:** Backlog refinement, sprint planning support, defect triage, acceptance criteria verification.

### Chapter 14: Delivering the Business Solution
- **POPIT Change Impact Assessment:** Managing transitions across People, Organisation, Process, Information, and Technology.
- **Business Acceptance (UAT):** Verifying that the delivered solution meets business needs in operational scenarios.
- **Benefits Realisation Plan:** Baseline metrics, target KPIs, assigned benefit owners, review frequency, and Post-Implementation Reviews (PIR).`,
      },
    ],
  },
]
