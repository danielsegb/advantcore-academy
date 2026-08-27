import type { ProjectStage, EvidenceItem } from "./types"

export const advantcoreProjectStages: ProjectStage[] = [
  {
    id: "stage-01",
    stageNumber: 1,
    title: "Initiate & Scope",
    code: "STG-1",
    status: "done",
    progressPercentage: 100,
    description: "Define project objectives, background context, scope boundaries, and project charter.",
    tasks: [
      {
        id: "task-01-01",
        stageId: "stage-01",
        taskNumber: "1.1",
        title: "Project Background & Problem Statement",
        description: "Analyze the current operational friction across enquiry qualification and project delivery hand-off.",
        deliverable: "Executive Problem Statement",
        requiredFormat: "Structured Document",
        acceptanceCriteria: [
          "Identifies 3 distinct pain points in the enquiry intake process",
          "Distinguishes business problems from premature technical solution assumptions",
          "Aligned with Sarah Mitchell's commercial priorities",
        ],
        assignedStakeholder: "Sarah Mitchell (Project Sponsor)",
        status: "done",
        evidenceId: "ev-01",
      },
      {
        id: "task-01-02",
        stageId: "stage-01",
        taskNumber: "1.2",
        title: "Project Charter & Scope Boundaries",
        description: "Document project scope, explicit exclusions, key milestones, and high-level risks.",
        deliverable: "Advantcore Project Charter",
        requiredFormat: "Formal Scope Document",
        acceptanceCriteria: [
          "Defines In-Scope and Out-of-Scope boundaries clearly",
          "Specifies dependencies on CRM and delivery tooling",
          "Approved by Project Sponsor",
        ],
        assignedStakeholder: "Sarah Mitchell (Project Sponsor)",
        status: "done",
        evidenceId: "ev-02",
      },
    ],
  },
  {
    id: "stage-02",
    stageNumber: 2,
    title: "Discover & Investigate",
    code: "STG-2",
    status: "done",
    progressPercentage: 100,
    description: "Identify stakeholders, map power-interest positions, conduct discovery interviews, and author discovery logs.",
    tasks: [
      {
        id: "task-02-01",
        stageId: "stage-02",
        taskNumber: "2.1",
        title: "Stakeholder Power-Interest Matrix & RACI",
        description: "Classify all key Advantcore stakeholders (Sarah Mitchell, Marcus Cole, Priya Shah, Helen Grant) and establish communication plans.",
        deliverable: "Stakeholder Engagement Plan",
        requiredFormat: "Matrix Table & Engagement Narrative",
        acceptanceCriteria: [
          "Positions 4 core stakeholders accurately on the Power-Interest grid",
          "Defines RACI roles across requirements, review, and approval activities",
          "Includes communication channel frequency for each role",
        ],
        assignedStakeholder: "Marcus Cole (BA Supervisor)",
        status: "done",
        evidenceId: "ev-03",
      },
      {
        id: "task-02-02",
        stageId: "stage-02",
        taskNumber: "2.2",
        title: "Discovery Interview Notes & Pain Point Synthesis",
        description: "Synthesize operational findings from discovery meetings with Priya Shah and operational staff.",
        deliverable: "Discovery Interview Synthesis",
        requiredFormat: "Structured Findings Log",
        acceptanceCriteria: [
          "Captures qualitative pain points regarding spreadsheet hand-offs",
          "Identifies data leakage between sales qualification and onboarding",
          "Cross-referenced with POPIT dimensions",
        ],
        assignedStakeholder: "Priya Shah (Operations Lead)",
        status: "done",
        evidenceId: "ev-04",
      },
    ],
  },
  {
    id: "stage-03",
    stageNumber: 3,
    title: "Analyse & Model Processes",
    code: "STG-3",
    status: "active",
    progressPercentage: 60,
    description: "Construct As-Is process swimlanes, identify bottlenecks and rework loops, and design the future-state To-Be workflow.",
    tasks: [
      {
        id: "task-03-01",
        stageId: "stage-03",
        taskNumber: "3.1",
        title: "As-Is Enquiry-to-Delivery Process Swimlane",
        description: "Map current end-to-end workflow across Sales, Operations, and Delivery swimlanes, highlighting delay bottlenecks.",
        deliverable: "As-Is Process Map & Friction Report",
        requiredFormat: "Swimlane Process Specification",
        acceptanceCriteria: [
          "Includes 3 distinct swimlanes (Enquiry Intake, Scoping, Mobilization)",
          "Highlights 4 specific manual hand-off bottlenecks",
          "Calculates average cycle time of 14 business days",
        ],
        assignedStakeholder: "Priya Shah (Operations Lead)",
        status: "done",
        evidenceId: "ev-05",
      },
      {
        id: "task-03-02",
        stageId: "stage-03",
        taskNumber: "3.2",
        title: "To-Be Target Operating Process Model",
        description: "Design streamlined future-state process eliminating manual re-entry and automating qualification routing.",
        deliverable: "To-Be Process Specification",
        requiredFormat: "Target State Process Document",
        acceptanceCriteria: [
          "Eliminates duplicate spreadsheet data entry",
          "Defines automated SLA triggers for lead qualification",
          "Targets reduction of cycle time from 14 days to 4 days",
        ],
        assignedStakeholder: "Marcus Cole (BA Supervisor)",
        status: "in_progress",
        evidenceId: "ev-06",
      },
    ],
  },
  {
    id: "stage-04",
    stageNumber: 4,
    title: "Requirements Catalogue",
    code: "STG-4",
    status: "locked",
    progressPercentage: 0,
    description: "Author comprehensive requirements catalogue, user stories, acceptance criteria, and MoSCoW prioritization.",
    tasks: [
      {
        id: "task-04-01",
        stageId: "stage-04",
        taskNumber: "4.1",
        title: "Functional & Non-Functional Requirements Catalogue",
        description: "Author precise, unambiguous requirements categorized by functional capability and quality attributes.",
        deliverable: "Requirements Catalogue (v1.0)",
        requiredFormat: "Structured Requirements Table",
        acceptanceCriteria: [
          "Contains minimum 12 functional requirements with MoSCoW priorities",
          "Includes 4 non-functional requirements (performance, security, usability)",
          "Traceable to business objectives in the Project Charter",
        ],
        assignedStakeholder: "Marcus Cole (BA Supervisor)",
        status: "todo",
      },
      {
        id: "task-04-02",
        stageId: "stage-04",
        taskNumber: "4.2",
        title: "Agile User Stories & Given-When-Then Acceptance Criteria",
        description: "Convert core requirements into user stories with testable acceptance criteria.",
        deliverable: "User Story Backlog",
        requiredFormat: "User Story Cards with Gherkin Scenarios",
        acceptanceCriteria: [
          "Follows 'As a... I want... So that...' format",
          "Includes Given-When-Then acceptance criteria for all Must-Have stories",
          "Satisfies INVEST criteria",
        ],
        assignedStakeholder: "Marcus Cole (BA Supervisor)",
        status: "todo",
      },
    ],
  },
  {
    id: "stage-05",
    stageNumber: 5,
    title: "Business Case & Appraisal",
    code: "STG-5",
    status: "locked",
    progressPercentage: 0,
    description: "Formulate options appraisal (Do Nothing, Minimum, Target), financial cost-benefit appraisal, and benefits realization plan.",
    tasks: [
      {
        id: "task-05-01",
        stageId: "stage-05",
        taskNumber: "5.1",
        title: "Options Appraisal & Cost-Benefit Analysis",
        description: "Evaluate delivery options against financial ROI, payback periods, and risk matrices.",
        deliverable: "Business Case Options Appraisal",
        requiredFormat: "Executive Business Case Document",
        acceptanceCriteria: [
          "Evaluates Option 1 (Do Nothing), Option 2 (CRM Workflow Automation), Option 3 (Custom Portal)",
          "Calculates tangible cost savings and financial payback within 12 months",
          "Includes risk log with proactive mitigations",
        ],
        assignedStakeholder: "Sarah Mitchell (Project Sponsor)",
        status: "todo",
      },
      {
        id: "task-05-02",
        stageId: "stage-05",
        taskNumber: "5.2",
        title: "Independent Evidence Audit & Portfolio Sign-off",
        description: "Submit complete deliverable portfolio for final independent assessment.",
        deliverable: "Assessed Portfolio Case Study",
        requiredFormat: "Verified Evidence Portfolio",
        acceptanceCriteria: [
          "All 5 stage deliverables verified and approved",
          "Complies with BCS Professional Standards",
          "Signed off by Independent Reviewer",
        ],
        assignedStakeholder: "Helen Grant (Independent Reviewer)",
        status: "todo",
      },
    ],
  },
]

export const initialEvidenceItems: EvidenceItem[] = [
  {
    id: "ev-01",
    taskId: "task-01-01",
    taskTitle: "Project Background & Problem Statement",
    stageNumber: 1,
    title: "Executive Problem Statement: Advantcore Enquiry Intake Friction",
    content: `# Executive Problem Statement: Advantcore Enquiry Intake Friction
**Project Code:** ADV-BA-001  
**Author:** Amanda Okafor (Lead BA Trainee)  
**Supervisor:** Marcus Cole  

## 1. Background & Context
Advantcore Ltd provides specialised consulting and professional services. Over the past 12 months, client inbound enquiries have expanded by 65%, causing severe operational bottlenecks in the qualification and onboarding lifecycle.

## 2. Core Problem Statements
1. **Unstructured Inbound Channels:** Enquiries arrive via disparate email inboxes, contact web forms, and direct partner phone calls without standardized qualification data.
2. **Spreadsheet Hand-Off Delays:** Inbound leads are manually copied into disconnected spreadsheets, causing an average lead response lag of 4.8 business days.
3. **Delivery Misalignment:** Crucial scoping details collected during initial sales calls are frequently omitted during hand-off to delivery teams, leading to rework and project mobilization delays.

## 3. Business Impact
- 18% of qualified enterprise prospects abandon the process due to slow initial response times.
- Delivery mobilization cycle time currently averages 14 business days against a corporate SLA target of 4 business days.`,
    version: 1,
    status: "approved",
    supervisorFeedback: "Excellent problem definition. Clearly separated the business pain points from solution assumptions.",
    reviewerDecision: {
      reviewerName: "Helen Grant (Independent Reviewer)",
      decision: "approved",
      comment: "Meets BCS problem framing criteria. Traceable and well evidenced.",
      timestamp: "2026-08-20T11:30:00Z",
    },
    updatedAt: "2026-08-20T11:30:00Z",
  },
  {
    id: "ev-03",
    taskId: "task-02-01",
    taskTitle: "Stakeholder Power-Interest Matrix & RACI",
    stageNumber: 2,
    title: "Stakeholder Engagement Matrix & RACI Governance",
    content: `# Stakeholder Engagement Matrix & RACI Governance
**Project Code:** ADV-BA-001  
**Project:** Enquiry-to-Delivery Process Transformation  

## 1. Power-Interest Grid Placement
- **Sarah Mitchell (Project Sponsor):** High Power / High Interest (Key Player) -> Manage Closely. Weekly 1:1 steering briefings.
- **Marcus Cole (BA Supervisor):** High Power / High Interest (Key Player) -> Daily standups and deliverable quality coaching.
- **Priya Shah (Operations Lead):** High Power / High Interest (Key Player) -> Bi-weekly process workshops and deep-dive discovery.
- **Helen Grant (Independent Reviewer):** High Power / Low Interest (Keep Satisfied) -> Formal gate stage submissions and audit trail reviews.

## 2. RACI Governance Matrix
| Deliverable | Sarah Mitchell | Marcus Cole | Priya Shah | Amanda Okafor (BA) | Helen Grant |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Project Charter | Accountable | Consulted | Consulted | Responsible | Informed |
| Process Swimlanes | Informed | Consulted | Accountable | Responsible | Informed |
| Requirements Catalogue | Consulted | Accountable | Consulted | Responsible | Informed |
| Business Case Sign-off | Accountable | Consulted | Consulted | Responsible | Informed |
| Portfolio Final Audit | Informed | Consulted | Informed | Responsible | Accountable |`,
    version: 1,
    status: "approved",
    supervisorFeedback: "The RACI matrix is unambiguous. Clear separation between operational accountability and independent governance.",
    reviewerDecision: {
      reviewerName: "Helen Grant (Independent Reviewer)",
      decision: "approved",
      comment: "RACI governance complies with BCS stakeholder analysis rubrics.",
      timestamp: "2026-08-22T14:15:00Z",
    },
    updatedAt: "2026-08-22T14:15:00Z",
  },
  {
    id: "ev-06",
    taskId: "task-03-02",
    taskTitle: "To-Be Target Operating Process Model",
    stageNumber: 3,
    title: "To-Be Future-State Enquiry Intake & Mobilisation Workflow",
    content: `# To-Be Future-State Process Specification
**Target Workflow:** Automated Intake, Dynamic Qualification & Instant Hand-off  

## 1. Process Streamlining Principles
- Eliminate manual duplicate entry between CRM and project mobilisation boards.
- Embed mandatory qualification checklist at intake (Budget, Authority, Need, Timeline - BANT).
- Automated notification trigger sent to Operations Lead upon qualified status.

## 2. Key Process Activities
1. **Intake Event:** Client submits structured web inquiry with automated SLA timestamp.
2. **Automated Triage:** System verifies company domain and assigns score.
3. **Qualification Call:** Sales consultant uses standardized dynamic script in CRM.
4. **Instant Mobilization Trigger:** When status changes to 'Contracted', automated webhook generates project workspace and assigns delivery lead.`,
    version: 2,
    status: "in_review",
    supervisorFeedback: "Very strong future-state draft. Please ensure you detail how legacy manual spreadsheets will be safely decommissioned.",
    updatedAt: "2026-08-27T10:00:00Z",
  },
]
