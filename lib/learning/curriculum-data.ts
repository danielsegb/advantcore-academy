import type { CourseModule } from "./types"

export const fullCurriculum: CourseModule[] = [
  {
    id: "mod-01",
    moduleNumber: "01",
    title: "Business analysis foundations",
    description: "Role of the business analyst, professional competencies, strategic context and lifecycle stages.",
    progressPercentage: 0,
    status: "active",
    lessons: [
      {
        id: "les-01-01",
        moduleId: "mod-01",
        lessonNumber: "1.1",
        title: "The role and competencies of a Business Analyst",
        estimatedMinutes: 20,
        intro: "Understand the core responsibilities of a BA, advisory boundaries, and the distinction between business analysts, project managers, and solution architects.",
        outcomes: [
          "Explain the primary purpose of business analysis in organizational change",
          "Distinguish business advisory responsibilities from technical solution design",
          "Identify essential behavioral, business knowledge, and professional competencies",
        ],
        concepts: [
          { number: "01", title: "Investigate", description: "Identify root business problems and opportunities rather than accepting pre-packaged solutions." },
          { number: "02", title: "Evaluate", description: "Assess organizational feasibility, impacts, options, and business cases." },
          { number: "03", title: "Specify", description: "Define clear, unambiguous requirements and business rules to guide change." },
        ],
        workplaceConnection: {
          title: "Advantcore Engagement Scoping",
          description: "Clarify whether Advantcore needs process re-engineering or simply new tooling before committing resources.",
          actionText: "Open project charter",
        },
        bodyContent: [
          {
            heading: "What is a Business Analyst?",
            paragraphs: [
              "A Business Analyst (BA) is an internal change agent who investigates business situations, identifies improvements, and defines requirements for new systems or processes. Unlike project managers — who focus on delivery timelines and resources — or solution architects — who design technical systems — the BA bridges the gap between business problems and viable solutions.",
              "According to the BCS definition, business analysis is \"the practice of enabling change in an organisational context, by defining needs and recommending solutions that deliver value to stakeholders.\" This definition contains three core activities: enabling change, defining needs, and recommending solutions.",
            ],
          },
          {
            heading: "The BA Competency Framework",
            paragraphs: [
              "The BCS competency model groups BA skills into three categories: Behavioural (interpersonal, leadership, communication), Business Knowledge (domain understanding, commercial awareness), and Professional (analytical thinking, attention to detail, ethical conduct).",
              "In practice, a BA must be equally comfortable facilitating a boardroom workshop, reviewing financial spreadsheets, and writing clear, testable requirements. This breadth is what makes the role challenging and commercially valuable.",
            ],
          },
          {
            heading: "The BA Lifecycle — Investigate, Evaluate, Specify",
            paragraphs: [
              "Investigate: Before proposing any solution, the BA investigates the current business situation. This involves interviewing stakeholders, observing operations, and reviewing documents to understand root causes rather than surface symptoms. A common mistake is accepting a pre-defined solution (\"we need a new CRM\") without first questioning whether the problem diagnosis is correct.",
              "Evaluate: The BA then evaluates options — including the \"do nothing\" baseline — against business objectives, assessing feasibility, risk, and expected return. This stage produces the Options Appraisal.",
              "Specify: Finally, the BA specifies requirements in a format that solution designers and developers can implement and test. Requirements must be unambiguous, testable, and traceable to business objectives.",
            ],
          },
          {
            heading: "BCS Textbook Reference",
            paragraphs: [
              "For authoritative detail, refer to Chapter 1 (What is Business Analysis?) and Chapter 2 (The Competencies of a Business Analyst) of the BCS Official Textbook: Business Analysis, 4th Edition by Debra Paul, James Cadle, Malcolm Eva, Craig Rollason and Jonathan Hunsley.",
            ],
          },
        ],
        questions: [
          {
            id: "q-1-1",
            prompt: "What is the primary role of a business analyst within an organization?",
            explanation: "The BA acts as an internal consultant and advisory agent investigating business situations and defining requirements for holistic business improvements.",
            options: [
              { key: "a", text: "To write low-level software code and configure database tables", isCorrect: false },
              { key: "b", text: "To investigate business situations and identify holistic options for improvement", isCorrect: true },
              { key: "c", text: "To manage daily sprint assignments and approve developer timesheets", isCorrect: false },
              { key: "d", text: "To replace executive stakeholders in making commercial decisions", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "mod-02",
    moduleNumber: "02",
    title: "Strategy analysis",
    description: "External environment analysis, internal capability evaluation, and SWOT / TOWS synthesis.",
    progressPercentage: 0,
    status: "locked",
    lessons: [
      {
        id: "les-02-01",
        moduleId: "mod-02",
        lessonNumber: "2.1",
        title: "External environmental analysis: PESTLE and Five Forces",
        estimatedMinutes: 25,
        intro: "Examine external macro-environmental factors and industry competitive forces that influence organizational strategy.",
        outcomes: [
          "Apply the PESTLE framework to analyze external political, economic, and technological drivers",
          "Evaluate industry competitive pressures using Porter's Five Forces model",
          "Synthesize external findings into strategic threats and opportunities",
        ],
        concepts: [
          { number: "01", title: "Scan", description: "Gather external macro data across political, economic, socio-cultural, and tech dimensions." },
          { number: "02", title: "Analyze", description: "Evaluate competitive rivalry, buyer power, supplier power, and threat of substitutes." },
          { number: "03", title: "Synthesize", description: "Translate external findings into clear SWOT opportunities and threats." },
        ],
        workplaceConnection: {
          title: "Advantcore Market Context",
          description: "Analyze how regulatory changes and enterprise SaaS competitors impact Advantcore's service offerings.",
          actionText: "Review market report",
        },
        bodyContent: [
          {
            heading: "PESTLE Analysis — Scanning the External Environment",
            paragraphs: [
              "PESTLE stands for Political, Economic, Socio-cultural, Technological, Legal, and Environmental. BAs use it to map the macro-level forces that a business cannot control but must respond to. For example, a change in data privacy law (Legal) may require Advantcore to redesign its client intake forms and CRM processes — creating a genuine project need that a BA must define.",
              "The key discipline is separating observable facts from interpretations. A PESTLE entry should state a trend (e.g., \"UK inflation at 4.2%, reducing client discretionary spend\"), not a generic concern (e.g., \"economic uncertainty\").",
            ],
          },
          {
            heading: "Porter's Five Forces — Industry Competitive Pressure",
            paragraphs: [
              "Porter's model analyses five structural forces that determine industry profitability: (1) Threat of New Entrants — how easily can competitors enter the market? (2) Bargaining Power of Buyers — can clients easily switch to a competitor? (3) Bargaining Power of Suppliers — how much leverage do technology or talent providers hold? (4) Threat of Substitutes — could clients solve the problem without engaging Advantcore at all? (5) Competitive Rivalry — how intense is direct competition?",
              "For a digital agency like Advantcore, Buyer Power is typically high because many competing agencies exist. This makes service differentiation and relationship management strategically critical — themes a BA would surface during a strategic context investigation.",
            ],
          },
          {
            heading: "Synthesising into SWOT",
            paragraphs: [
              "Once PESTLE and Five Forces are complete, the BA synthesises findings into a SWOT (Strengths, Weaknesses, Opportunities, Threats). External findings (PESTLE, Five Forces) inform Opportunities and Threats. Internal findings (resource audit, value chain) inform Strengths and Weaknesses.",
              "BCS Textbook Reference: Chapter 3 — Strategy Analysis, Business Analysis 4th Edition.",
            ],
          },
        ],
        questions: [
          {
            id: "q-2-1",
            prompt: "Which framework is most suitable for analyzing macroeconomic factors outside an organization?",
            explanation: "PESTLE analyzes Political, Economic, Socio-cultural, Technological, Legal, and Environmental external factors.",
            options: [
              { key: "a", text: "PESTLE analysis", isCorrect: true },
              { key: "b", text: "Resource Audit", isCorrect: false },
              { key: "c", text: "VRIO framework", isCorrect: false },
              { key: "d", text: "Boston Box", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "mod-03",
    moduleNumber: "03",
    title: "Stakeholder analysis",
    description: "Stakeholder identification, power-interest mapping, RACI matrices, and tailored engagement planning.",
    progressPercentage: 0,
    status: "locked",
    lessons: [
      {
        id: "les-03-04",
        moduleId: "mod-03",
        lessonNumber: "3.4",
        title: "Managing stakeholder relationships",
        estimatedMinutes: 25,
        intro: "Select engagement approaches that reflect stakeholder influence, interest, attitudes, and information needs.",
        outcomes: [
          "Explain stakeholder management and communication strategy",
          "Apply the power-interest grid to position stakeholders accurately",
          "Recommend suitable communication approaches for key players, meet-their-needs, and keep-informed groups",
        ],
        concepts: [
          { number: "01", title: "Analyse", description: "Assess power, interest, attitude, and impact using objective evidence." },
          { number: "02", title: "Position", description: "Map each stakeholder while recognising that positions and attitudes evolve over time." },
          { number: "03", title: "Engage", description: "Choose communication channels and frequency that fit the stakeholder's decision rights." },
        ],
        workplaceConnection: {
          title: "Apply this to the Advantcore project",
          description: "Classify Sarah Mitchell, Marcus Cole, Priya Shah, and Helen Grant, then justify how you will engage each person during discovery.",
          actionText: "Open project task",
        },
        bodyContent: [
          {
            heading: "Identifying Stakeholders",
            paragraphs: [
              "A stakeholder is any individual, group, or organisation with an interest in the outcome of a project — whether they support it, are affected by it, or have decision-making authority over it. For the Advantcore BA programme, your key stakeholders are: Sarah Mitchell (Project Sponsor, high power/high interest), Marcus Cole (BA Supervisor, high power/high interest), Priya Shah (Operations Lead, high power/moderate interest), and Helen Grant (Independent Reviewer, low power/high interest).",
            ],
          },
          {
            heading: "The Power-Interest Grid",
            paragraphs: [
              "The Power-Interest Grid (Mendelow's Matrix) positions each stakeholder across two axes: their power to influence the project outcome and their interest in its progress. This creates four quadrants: (1) Key Players (high power, high interest) — manage closely; (2) Meet Their Needs (high power, low interest) — keep satisfied; (3) Show Consideration (low power, high interest) — keep informed; (4) Minimal Effort (low power, low interest) — monitor only.",
              "The grid is not a static ranking. Stakeholder positions evolve as the project progresses. A regulator who starts as \"minimal effort\" may become a \"key player\" the moment a compliance question arises.",
            ],
          },
          {
            heading: "RACI Matrix — Clarifying Decision Rights",
            paragraphs: [
              "The RACI matrix (Responsible, Accountable, Consulted, Informed) defines who does what for each project deliverable. Responsible: the person doing the work. Accountable: the single decision-maker (only one per deliverable). Consulted: those whose input is sought before decisions. Informed: those notified of outcomes.",
              "A well-constructed RACI prevents scope creep and stakeholder conflict by making decision rights explicit upfront. BCS Textbook Reference: Chapter 6 — Stakeholder Analysis and Management.",
            ],
          },
        ],
        questions: [
          {
            id: "q-3-1",
            prompt: "What is the primary purpose of a stakeholder power-interest grid?",
            explanation: "The grid helps tailor communication and engagement strategies to each stakeholder's influence and interest level.",
            options: [
              { key: "identify", text: "To identify every person in the organization", isCorrect: false },
              { key: "manage", text: "To determine an appropriate engagement and communication approach", isCorrect: true },
              { key: "rank", text: "To rank stakeholders strictly by hierarchical seniority", isCorrect: false },
              { key: "replace", text: "To replace the need for stakeholder discovery interviews", isCorrect: false },
            ],
          },
          {
            id: "q-3-2",
            prompt: "How should a stakeholder with high power and high interest (Key Player) be managed?",
            explanation: "High power, high interest stakeholders must be managed closely with regular collaboration and partnership.",
            options: [
              { key: "a", text: "Keep informed with occasional mass email newsletters", isCorrect: false },
              { key: "b", text: "Manage closely and partner actively on key decisions", isCorrect: true },
              { key: "c", text: "Ignore until final user acceptance testing", isCorrect: false },
              { key: "d", text: "Provide minimal contact to avoid overwhelming them", isCorrect: false },
            ],
          },
          {
            id: "q-3-3",
            prompt: "Which matrix is used to define Responsible, Accountable, Consulted, and Informed roles?",
            explanation: "RACI matrix clarifies the specific responsibilities across project deliverables.",
            options: [
              { key: "a", text: "RACI matrix", isCorrect: true },
              { key: "b", text: "SWOT matrix", isCorrect: false },
              { key: "c", text: "Ansoff matrix", isCorrect: false },
              { key: "d", text: "McKinsey 7S framework", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "mod-04",
    moduleNumber: "04",
    title: "Business systems modelling",
    description: "POPIT holistic analysis, Business Activity Models (BAM), and swimlane process modelling.",
    progressPercentage: 0,
    status: "locked",
    lessons: [
      {
        id: "les-04-01",
        moduleId: "mod-04",
        lessonNumber: "4.1",
        title: "Holistic systems thinking and the POPIT model",
        estimatedMinutes: 30,
        intro: "Explore how Processes, People, Organization, Information, and Technology interact to deliver sustainable business change.",
        outcomes: [
          "Apply the POPIT model to prevent one-dimensional technology-only solutions",
          "Construct Business Activity Models representing conceptual business actions",
          "Map As-Is and To-Be processes using standard swimlane conventions",
        ],
        concepts: [
          { number: "01", title: "People & Org", description: "Evaluate skills, motivation, culture, and reporting hierarchies." },
          { number: "02", title: "Process", description: "Map end-to-end value streams, hand-offs, bottlenecks, and rework loops." },
          { number: "03", title: "Info & Tech", description: "Verify information availability, data integrity, and supporting software systems." },
        ],
        workplaceConnection: {
          title: "Advantcore Hand-off Analysis",
          description: "Model the hand-off between qualification and project mobilization using POPIT to uncover information leakage.",
          actionText: "Open process modeler",
        },
        bodyContent: [
          {
            heading: "Why Holistic Thinking Matters",
            paragraphs: [
              "Most failed change projects fail not because of bad technology, but because they addressed technology while ignoring people, process, or organisational culture. The POPIT model — People, Organisation, Process, Information/Technology — prevents this by forcing analysts to consider all four dimensions before recommending solutions.",
              "In the Advantcore project, the root cause of the 14-day enquiry-to-delivery delay was not a missing CRM system. Investigation revealed manual spreadsheet re-entry across three departments (Process), unclear handoff ownership between qualification and mobilisation teams (Organisation), and a lack of shared client record standards (Information). Technology was a factor, but not the primary one.",
            ],
          },
          {
            heading: "The POPIT Model in Practice",
            paragraphs: [
              "People: Assess skills, capacity, motivation, and training needs. Are staff equipped to execute the new process? Organisation: Examine reporting lines, governance structures, culture, and decision rights. Process: Map As-Is (current state) processes using swimlane diagrams to expose hand-offs, bottlenecks, duplication, and rework loops. Then define the To-Be target state.",
              "Information/Technology: Evaluate whether data is available when needed, accurate, and in the correct format. Assess whether existing systems support the new process or require replacement. BCS Textbook Reference: Chapter 7 — Modelling Business Processes.",
            ],
          },
        ],
        questions: [
          {
            id: "q-4-1",
            prompt: "What does the POPIT model stand for in holistic business analysis?",
            explanation: "POPIT represents People, Organization, Process, and Information Technology (or Information & Technology).",
            options: [
              { key: "a", text: "People, Organization, Process, Information / Technology", isCorrect: true },
              { key: "b", text: "Planning, Operations, Performance, Integration, Testing", isCorrect: false },
              { key: "c", text: "Policies, Objectives, Projects, Initiatives, Tasks", isCorrect: false },
              { key: "d", text: "Procurement, Outsourcing, Personnel, IT, Training", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "mod-05",
    moduleNumber: "05",
    title: "Requirements engineering",
    description: "Elicitation techniques, functional vs non-functional requirements, user stories, and MoSCoW prioritization.",
    progressPercentage: 0,
    status: "locked",
    lessons: [
      {
        id: "les-05-01",
        moduleId: "mod-05",
        lessonNumber: "5.1",
        title: "Requirements elicitation, categories and user stories",
        estimatedMinutes: 35,
        intro: "Master elicitation techniques (interviews, workshops, observation) and specify clear functional, non-functional, and constraint requirements.",
        outcomes: [
          "Select optimal elicitation techniques based on stakeholder availability and domain uncertainty",
          "Categorize requirements into Functional, Non-functional, General, and Technical constraints",
          "Author precise User Stories with acceptance criteria in Given-When-Then format",
        ],
        concepts: [
          { number: "01", title: "Elicit", description: "Extract tacit knowledge and business rules through structured interviews and workshops." },
          { number: "02", title: "Specify", description: "Format requirements with unambiguous test criteria and MoSCoW priorities." },
          { number: "03", title: "Validate", description: "Ensure traceability from business objectives through to verified solution deliverables." },
        ],
        workplaceConnection: {
          title: "Advantcore Requirements Catalogue",
          description: "Author user stories for the enquiry intake workflow and submit them for Marcus Cole's supervisory review.",
          actionText: "Open requirements log",
        },
        bodyContent: [
          {
            heading: "Requirements Elicitation Techniques",
            paragraphs: [
              "Elicitation is the process of drawing out requirements from stakeholders. Key techniques include: Interviews (structured, semi-structured, or unstructured — best for individual expert knowledge), Workshops (group sessions that surface conflicting requirements and build shared understanding), Observation (shadowing users in their actual work environment to discover tacit knowledge not stated in interviews), and Document Analysis (reviewing existing reports, forms, and procedures).",
              "Technique selection depends on stakeholder availability, domain complexity, and whether requirements are stable or volatile. For the Advantcore enquiry-to-delivery process, interviews with Priya Shah and a workshop with the qualification team were used to surface the manual re-entry bottleneck.",
            ],
          },
          {
            heading: "Categorising Requirements",
            paragraphs: [
              "Functional requirements define what the system must do (e.g., \"The system shall allow a project manager to assign a delivery team within 30 minutes of client approval\"). Non-functional requirements (NFRs) define quality attributes (e.g., performance, security, usability). General constraints are external limits such as legal compliance or budget. Technical constraints are imposed by the existing technology environment.",
              "MoSCoW Prioritisation: Must Have (legally or operationally critical — the project fails without it), Should Have (high value but not critical for launch), Could Have (desirable if budget and time allow), Won’t Have (explicitly out of scope for this release).",
            ],
          },
          {
            heading: "User Stories in Given-When-Then Format",
            paragraphs: [
              "A user story describes a requirement from the user’s perspective: \"As a [role], I want [capability] so that [benefit].\" Acceptance criteria are written in Given-When-Then (GWT) format: Given [initial state], When [user action], Then [expected outcome]. GWT makes requirements directly testable and unambiguous.",
              "BCS Textbook Reference: Chapters 10 and 11 — Establishing, Documenting and Modelling Requirements.",
            ],
          },
        ],
        questions: [
          {
            id: "q-5-1",
            prompt: "Which category does 'The system must respond to search queries within 2 seconds' belong to?",
            explanation: "Performance and response time criteria are Non-Functional (Quality attribute) requirements.",
            options: [
              { key: "a", text: "Non-functional requirement", isCorrect: true },
              { key: "b", text: "Functional requirement", isCorrect: false },
              { key: "c", text: "General business policy", isCorrect: false },
              { key: "d", text: "Legal constraint", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "mod-06",
    moduleNumber: "06",
    title: "Business cases",
    description: "Options evaluation, cost-benefit appraisal (tangible vs intangible), payback periods, and risk management.",
    progressPercentage: 0,
    status: "locked",
    lessons: [
      {
        id: "les-06-01",
        moduleId: "mod-06",
        lessonNumber: "6.1",
        title: "Developing and evaluating the business case",
        estimatedMinutes: 30,
        intro: "Build compelling business cases evaluating 'Do nothing', 'Do minimum', and 'Do something' options with clear financial payback metrics.",
        outcomes: [
          "Structure a complete Business Case including problem statement, options, costs, benefits, and risks",
          "Quantify tangible financial benefits and articulate intangible strategic advantages",
          "Calculate Payback Period and explain Net Present Value (NPV) and Discounted Cash Flow (DCF)",
        ],
        concepts: [
          { number: "01", title: "Options", description: "Evaluate feasible delivery options against strategic business goals." },
          { number: "02", title: "Appraisal", description: "Compare capital expenditure (CapEx) and operational costs (OpEx) against quantifiable ROI." },
          { number: "03", title: "Risk", description: "Identify risks, likelihood, impact, and proactive mitigation plans." },
        ],
        workplaceConnection: {
          title: "Advantcore Recommendation Pitch",
          description: "Present your business case options appraisal to Sarah Mitchell (Project Sponsor) in the simulated boardroom.",
          actionText: "Prepare business case",
        },
        bodyContent: [
          {
            heading: "Structure of a Business Case",
            paragraphs: [
              "A formal business case includes: (1) Executive Summary — a concise statement of the problem, recommended option, and financial justification. (2) Problem Statement — the quantified business problem. For Advantcore, this is a 14-day enquiry-to-delivery cycle causing an estimated £120,000 annual revenue leakage through lost repeat business. (3) Options Appraisal — evaluation of at least three options including Do Nothing as the baseline. (4) Cost-Benefit Analysis — comparing CapEx and OpEx investment against projected financial and strategic returns. (5) Risk Assessment — key risks, likelihood, impact, and mitigations. (6) Recommendation — the preferred option with clear justification.",
            ],
          },
          {
            heading: "Options Appraisal — Always Start with Do Nothing",
            paragraphs: [
              "Every credible business case evaluates the 'Do Nothing' (Business as Usual) baseline first. This establishes what happens if no action is taken and creates the benchmark against which other options are measured. Skipping Do Nothing is a common BA mistake that weakens the case for change.",
              "For Advantcore: Do Nothing (BAU) — revenue leakage continues. Do Minimum — add a shared spreadsheet tracker (low cost, partial improvement). Do Something — implement a lightweight project management workflow with a digital handoff tool (recommended: 12-month payback, eliminates manual re-entry).",
            ],
          },
          {
            heading: "Financial Metrics — Payback, NPV, ROI",
            paragraphs: [
              "Payback Period: The time taken for cumulative financial benefits to equal the cost of investment. For the Advantcore recommendation, the £18,500 implementation cost is recovered within 12 months through efficiency savings and recovered revenue. Net Present Value (NPV): Adjusts future cash flows to today's value to account for the time value of money. A positive NPV confirms the investment creates value. Return on Investment (ROI) = (Net Benefit / Investment Cost) × 100.",
              "Intangible benefits (brand trust, staff morale, client satisfaction) are real but cannot be directly quantified. They must be articulated clearly alongside financial metrics. BCS Textbook Reference: Chapter 9 — Making a Business Case.",
            ],
          },
        ],
        questions: [
          {
            id: "q-6-1",
            prompt: "What is always the baseline option in any formal business case options appraisal?",
            explanation: "The 'Do nothing' (or business as usual) option is always evaluated to establish the benchmark for comparison.",
            options: [
              { key: "a", text: "Do nothing (Business as Usual)", isCorrect: true },
              { key: "b", text: "Outsource all development immediately", isCorrect: false },
              { key: "c", text: "Purchase the most expensive enterprise software", isCorrect: false },
              { key: "d", text: "Re-organize executive management", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
]
