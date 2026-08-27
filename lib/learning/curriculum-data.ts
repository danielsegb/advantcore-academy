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
