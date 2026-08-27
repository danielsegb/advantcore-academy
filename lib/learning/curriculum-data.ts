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
        intro: "Master the definition of business analysis, the 5-stage change lifecycle, the 6 core professional principles, and the T-shaped competency model.",
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
        bodyContent: [
          {
            heading: "What is Business Analysis? (BCS Syllabus Module 1)",
            paragraphs: [
              "Business analysis is a specialised professional practice that enables business change by defining needs, investigating problem situations holistically, and recommending viable options that deliver value to stakeholders.",
              "A business analyst acts as an internal advisor who bridges the gap between business leadership, operational users, and technical delivery teams. The BA does not write low-level software code or make executive commercial decisions; instead, the BA investigates the root causes of business friction and designs the target operating requirements to resolve them.",
            ],
          },
          {
            heading: "The 5-Stage Business Change Lifecycle",
            paragraphs: [
              "1. Alignment: Ensuring that any change initiative directly supports the organisation's strategic goals, vision, and key performance indicators (KPIs).",
              "2. Definition: Investigating the current situation, identifying pain points, evaluating solution options, and building the formal business case.",
              "3. Design: Specifying detailed functional, non-functional, data, and process requirements, and collaborating with architects and designers.",
              "4. Implementation: Supporting development, facilitating user acceptance testing (UAT), and managing operational change readiness.",
              "5. Realisation: Tracking post-implementation performance metrics against original business case baselines to confirm genuine value creation.",
            ],
          },
          {
            heading: "The 6 Core Principles of Business Analysis (Must Know)",
            paragraphs: [
              "Principle 1: Root causes not symptoms — Never accept a surface symptom (e.g. 'leads are slow') at face value; investigate the underlying structural cause using the 5 Whys and POPIT model.",
              "Principle 2: Business improvement not IT change — A technology purchase is not always the answer. Many business problems are solved through process re-engineering, training, or policy clarification.",
              "Principle 3: Options not predetermined solutions — Challenge the immediate assumption that a specific vendor tool is required. Always evaluate multiple feasible options, including the mandatory 'Do Nothing' baseline.",
              "Principle 4: Feasible, contributing requirements, not meeting all requests — A BA must protect project feasibility by challenging unfeasible requests and establishing clear, defensible MoSCoW priorities.",
              "Principle 5: The entire business change lifecycle not just requirements — The BA's responsibility begins before requirements elicitation (during strategy and problem analysis) and continues through UAT, change deployment, and benefits realisation.",
              "Principle 6: Negotiation not avoidance — Conflicting stakeholder priorities must be surfaced and resolved collaboratively using objective evidence rather than passive avoidance.",
            ],
          },
          {
            heading: "The T-Shaped Competency Framework (BCS Syllabus Module 2)",
            paragraphs: [
              "A modern business analyst requires a T-shaped profile: broad collaborative breadth across multiple disciplines plus deep technical capability in core analysis techniques.",
              "The 3 Core Competency Domains are:",
              "• Personal Qualities: Critical thinking, communication, active listening, relationship management, curiosity, and ethical conduct.",
              "• Business Knowledge: Commercial awareness, organizational structure, customer journeys, financial metrics (CapEx, OpEx, ROI), and regulation.",
              "• Professional Techniques: Elicitation (interviews, workshops, observation), process modelling (BPMN swimlanes), gap analysis, requirements engineering (user stories, GWT), and business case appraisal.",
            ],
          },
          {
            heading: "Advantcore Workplace Application",
            paragraphs: [
              "On the Advantcore enquiry-to-delivery transformation project (ADV-BA-001), inbound leads currently suffer a 4.8-day response lag. Rather than prematurely buying expensive CRM plugins, the BA applies these principles to investigate the manual spreadsheet hand-offs between Sales and Mobilisation, producing an evidenced Problem Statement and Project Charter.",
            ],
          },
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
            explanation: "The BA acts as an advisory agent investigating business situations and defining requirements for holistic business improvements.",
            options: [
              { key: "a", text: "To write low-level software code and configure database tables", isCorrect: false },
              { key: "b", text: "To investigate business situations and identify holistic options for improvement", isCorrect: true },
              { key: "c", text: "To manage daily sprint assignments and approve developer timesheets", isCorrect: false },
              { key: "d", text: "To replace executive stakeholders in making commercial decisions", isCorrect: false },
            ],
          },
          {
            id: "q-1-2",
            prompt: "What is the correct chronological sequence of the five stages in the Business Change Lifecycle?",
            explanation: "The lifecycle progresses through Alignment -> Definition -> Design -> Implementation -> Realisation.",
            options: [
              { key: "a", text: "Alignment -> Definition -> Design -> Implementation -> Realisation", isCorrect: true },
              { key: "b", text: "Design -> Implementation -> Realisation -> Alignment -> Definition", isCorrect: false },
              { key: "c", text: "Definition -> Coding -> Testing -> UAT -> Go-Live", isCorrect: false },
              { key: "d", text: "Strategy -> Procurement -> Rollout -> Audit -> Closure", isCorrect: false },
            ],
          },
          {
            id: "q-1-3",
            prompt: "A project sponsor insists that a specific vendor CRM must be purchased immediately to fix lost leads. What should the BA do first according to core BA principles?",
            explanation: "Principle 1 & 3 dictate that the BA must first investigate the root cause of the lost leads and evaluate options rather than accepting a predetermined IT purchase.",
            options: [
              { key: "a", text: "Write technical requirements for the sponsor's requested CRM", isCorrect: false },
              { key: "b", text: "Investigate the underlying causes of lost leads before evaluating solution options", isCorrect: true },
              { key: "c", text: "Ask procurement to issue an immediate RFP to the CRM vendor", isCorrect: false },
              { key: "d", text: "Refuse to work on the project due to sponsor bias", isCorrect: false },
            ],
          },
          {
            id: "q-1-4",
            prompt: "What does a 'T-shaped' competency profile mean for a professional Business Analyst?",
            explanation: "A T-shaped professional combines broad collaborative breadth across related disciplines with deep expertise in specialized BA techniques.",
            options: [
              { key: "a", text: "Deep technical programming knowledge with no business awareness", isCorrect: false },
              { key: "b", text: "Broad collaborative capability across disciplines combined with deep expertise in BA techniques", isCorrect: true },
              { key: "c", text: "Focusing solely on Project Management and executive budget sign-offs", isCorrect: false },
              { key: "d", text: "Equal surface-level familiarity with all topics without any specialization", isCorrect: false },
            ],
          },
          {
            id: "q-1-5",
            prompt: "Which service in the Business Analysis Service Framework (BASF) evaluates whether a proposed business change is financially and operationally worth pursuing?",
            explanation: "Feasibility assessment and business case development evaluates viability and options before significant investment is committed.",
            options: [
              { key: "a", text: "Business Acceptance Testing", isCorrect: false },
              { key: "b", text: "Feasibility assessment and business case development", isCorrect: true },
              { key: "c", text: "Business Change Deployment", isCorrect: false },
              { key: "d", text: "Software Sprint Retrospective", isCorrect: false },
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
        bodyContent: [
          {
            heading: "Strategic Context for Business Analysis (BCS Syllabus Module 3)",
            paragraphs: [
              "Strategy connects the organization's high-level purpose with operational execution. A project that is technically perfect but strategically misaligned will fail to deliver commercial value. Strategy analysis consists of external macro scanning (PESTLE), competitive industry analysis (Porter's Five Forces), internal alignment (VMOST), and evidence synthesis (SWOT).",
            ],
          },
          {
            heading: "PESTLE Macro-Environmental Analysis",
            paragraphs: [
              "PESTLE scans the external macro environment across six dimensions. Every entry must be stated as an observable fact with specific business implications, not unsupported personal opinion:",
              "• Political: Government initiatives, regional policy shifts, tax incentives, trade agreements.",
              "• Economic: Inflation rates, interest rates, disposable income, currency volatility, resource costs.",
              "• Socio-cultural: Demographic shifts, changing consumer preferences, remote working trends.",
              "• Technological: Emerging automation, AI, mobile platforms, cloud adoption, cybersecurity standards.",
              "• Legal: Employment law, UK GDPR / Data Protection Act 2018, consumer rights, industry regulations.",
              "• Environmental: Carbon reduction targets, energy consumption, waste management, sustainability policies.",
            ],
          },
          {
            heading: "Porter's Five Forces Framework",
            paragraphs: [
              "Michael Porter's Five Forces assesses the competitive intensity and profitability of an industry sector:",
              "1. Threat of New Entrants: How easily new competitors can enter the market (barriers to entry, capital requirements, economies of scale).",
              "2. Threat of Substitutes: Alternative products or services that satisfy the same customer need (e.g. self-service portals replacing agency calls).",
              "3. Bargaining Power of Buyers: The leverage customers hold (buyer concentration, low switching costs, price sensitivity).",
              "4. Bargaining Power of Suppliers: The leverage suppliers hold (supplier uniqueness, high switching costs, lack of substitutes).",
              "5. Industry Rivalry: The intensity of competition among existing firms (market growth rate, brand loyalty, exit barriers).",
            ],
          },
          {
            heading: "Internal Alignment: VMOST & Performance Measurement",
            paragraphs: [
              "• Vision: The inspirational long-term desired future state of the organization.",
              "• Mission: The core fundamental purpose — who we serve and what value we provide today.",
              "• Objectives: SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) translating vision into concrete targets.",
              "• Strategy: The overarching long-term plan of action to achieve the objectives.",
              "• Tactics: Specific short-term operational activities and project tasks.",
              "Critical Success Factors (CSFs) state what must go well for the organization to succeed. Key Performance Indicators (KPIs) provide the measurable threshold to verify whether performance is on target.",
            ],
          },
          {
            heading: "Advantcore Strategic Context Example",
            paragraphs: [
              "Advantcore's strategic objective is to achieve a 12-month commercial payback while scaling client delivery capacity by 40%. The PESTLE scan highlights UK GDPR compliance requirements for storing client enquiry data, while the VMOST alignment links the enquiry intake automation directly to Sarah Mitchell's target of reducing cycle time from 14 to 4 days.",
            ],
          },
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
          {
            id: "q-2-2",
            prompt: "In Porter's Five Forces model, under which condition is the Bargaining Power of Buyers highest?",
            explanation: "Buyer power is highest when there are many substitute choices and switching costs between suppliers are low.",
            options: [
              { key: "a", text: "When switching costs to alternative suppliers are zero and product choice is abundant", isCorrect: true },
              { key: "b", text: "When there is only one sole supplier of a proprietary technology", isCorrect: false },
              { key: "c", text: "When the industry has massive capital barriers to entry", isCorrect: false },
              { key: "d", text: "When buyers are small, fragmented, and unaligned", isCorrect: false },
            ],
          },
          {
            id: "q-2-3",
            prompt: "In the VMOST strategic alignment model, which element must be explicitly quantifiable and time-bound?",
            explanation: "Objectives are SMART goals that provide measurable targets with defined completion dates.",
            options: [
              { key: "a", text: "Vision", isCorrect: false },
              { key: "b", text: "Mission", isCorrect: false },
              { key: "c", text: "Objectives", isCorrect: true },
              { key: "d", text: "Strategy only", isCorrect: false },
            ],
          },
          {
            id: "q-2-4",
            prompt: "What is the primary difference between a Critical Success Factor (CSF) and a Key Performance Indicator (KPI)?",
            explanation: "A CSF identifies an area/condition that must succeed, whereas a KPI provides the measurable metric to evaluate performance against it.",
            options: [
              { key: "a", text: "A CSF is a numerical metric; a KPI is a qualitative vision statement", isCorrect: false },
              { key: "b", text: "A CSF states what must go well; a KPI measures how well it is going", isCorrect: true },
              { key: "c", text: "There is no difference; the terms are interchangeable in BCS terminology", isCorrect: false },
              { key: "d", text: "A CSF only applies to IT software; KPIs apply to human resources", isCorrect: false },
            ],
          },
          {
            id: "q-2-5",
            prompt: "When should a SWOT analysis be constructed during a strategic business analysis study?",
            explanation: "SWOT is a synthesis tool that should only be built after gathering verified internal and external evidence (PESTLE, VMOST, Resource Audit), not before.",
            options: [
              { key: "a", text: "Before gathering any project evidence to set early assumptions", isCorrect: false },
              { key: "b", text: "After completing internal and external environmental research", isCorrect: true },
              { key: "c", text: "Only after user acceptance testing has finished", isCorrect: false },
              { key: "d", text: "In place of interviewing any business stakeholders", isCorrect: false },
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
        bodyContent: [
          {
            heading: "Stakeholder Analysis & Engagement (BCS Syllabus Module 6)",
            paragraphs: [
              "A stakeholder is any individual, group, or organization who is affected by, can affect, or possesses knowledge about a proposed change initiative.",
              "The BA must identify all stakeholder categories early using a stakeholder wheel (managers, staff, customers, suppliers, regulators, partners) to avoid critical omissions.",
            ],
          },
          {
            heading: "Mendelow's Power-Interest Grid (The 9 Strategy Positions)",
            paragraphs: [
              "Stakeholders are mapped across Power (the ability to exert influence or block change) and Interest (the extent to which their daily work or concerns are affected):",
              "1. High Power / High Interest (Key Players): Must be managed closely. Involve them actively in governance, decision gates, and steering committees (e.g. Sarah Mitchell, Project Sponsor).",
              "2. High Power / Low Interest: Keep satisfied. Provide concise executive updates, ensure no regulatory or commercial red lines are breached (e.g. Helen Grant, Independent Reviewer).",
              "3. Low Power / High Interest: Keep informed & show consideration. These operational users are heavily impacted but lack formal authority. Consult them through workshops to prevent passive resistance (e.g. Priya Shah & operational staff).",
              "4. Low Power / Low Interest: Minimal effort. Monitor periodically via general project newsletters.",
            ],
          },
          {
            heading: "RACI & RASCI Decision Rights Governance",
            paragraphs: [
              "A RACI matrix clarifies exact responsibilities across deliverables to prevent confusion:",
              "• Responsible (R): The role who actually does the work to produce the deliverable (e.g. BA writes the Problem Statement).",
              "• Accountable (A): The single individual who owns the final outcome and has ultimate approval authority. Exactly ONE person must be Accountable per deliverable.",
              "• Consulted (C): Subject matter experts who provide two-way information and feedback before work is finalized.",
              "• Informed (I): Stakeholders who receive one-way notifications upon deliverable completion.",
            ],
          },
          {
            heading: "Investigation & Elicitation Triangulation (BCS Syllabus Module 5)",
            paragraphs: [
              "To obtain a reliable, unbiased view of the business situation, the BA applies investigation triangulation (checking findings across multiple sources):",
              "• Interviews: One-on-one sessions to uncover tacit knowledge, individual concerns, and process details.",
              "• Facilitated Workshops: Multi-stakeholder sessions to resolve conflicting priorities and build consensus.",
              "• Observation: Shadowing staff to observe actual working behaviour vs written policy.",
              "• Scenarios & Prototyping: Testing user situations to surface hidden assumptions and edge cases.",
            ],
          },
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
              { key: "a", text: "To identify every person in the organization", isCorrect: false },
              { key: "b", text: "To determine an appropriate engagement and communication approach", isCorrect: true },
              { key: "c", text: "To rank stakeholders strictly by hierarchical seniority", isCorrect: false },
              { key: "d", text: "To replace the need for stakeholder discovery interviews", isCorrect: false },
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
            prompt: "In a RACI matrix, what is the mandatory governance rule for the 'Accountable' role?",
            explanation: "There should normally be exactly one Accountable individual per task to avoid diffusion of responsibility.",
            options: [
              { key: "a", text: "Every team member must be Accountable for every task", isCorrect: false },
              { key: "b", text: "Exactly one role or person should be Accountable for each deliverable", isCorrect: true },
              { key: "c", text: "The Business Analyst is automatically Accountable for all project budgets", isCorrect: false },
              { key: "d", text: "Accountable roles only exist after software deployment", isCorrect: false },
            ],
          },
          {
            id: "q-3-4",
            prompt: "Which investigation technique is best suited for uncovering the difference between documented operating procedures and actual daily staff practices?",
            explanation: "Observation (work shadowing) directly exposes workarounds and actual behaviour that interviews or documents may conceal.",
            options: [
              { key: "a", text: "Observation", isCorrect: true },
              { key: "b", text: "Online Questionnaire", isCorrect: false },
              { key: "c", text: "Document Analysis only", isCorrect: false },
              { key: "d", text: "Reviewing company marketing brochures", isCorrect: false },
            ],
          },
          {
            id: "q-3-5",
            prompt: "What is the primary benefit of conducting a facilitated stakeholder workshop over individual interviews?",
            explanation: "Workshops bring conflicting viewpoints together in real time to build shared consensus and collaborative agreement.",
            options: [
              { key: "a", text: "To avoid documenting requirements in writing", isCorrect: false },
              { key: "b", text: "To surface conflicting perspectives and negotiate shared consensus in real time", isCorrect: true },
              { key: "c", text: "To eliminate the need for project sponsor sign-off", isCorrect: false },
              { key: "d", text: "To calculate precise financial ROI without data", isCorrect: false },
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
        bodyContent: [
          {
            heading: "Holistic Systems Thinking & POPIT (BCS Syllabus Module 7 & 8)",
            paragraphs: [
              "A business system is more than just software. The POPIT model provides a holistic 5-dimension lens for investigating problems, structuring gap analysis, and designing solutions:",
              "1. Processes: Are workflows efficient, clearly defined, and measurable? Are there bottlenecks, duplicate data entry, or excessive hand-offs?",
              "2. People: Do staff have the required skills, training, and motivation? Do they understand their performance targets?",
              "3. Organisation: Are roles, management structures, policies, and culture aligned to support collaboration?",
              "4. Information: Do decision-makers and operational staff have accurate, timely, and secure data when needed?",
              "5. Technology: Do software applications, infrastructure, and tools support the operational process without creating cumbersome workarounds?",
            ],
          },
          {
            heading: "Process Modelling with Swimlane Diagrams",
            paragraphs: [
              "Process models represent how work flows across roles and departments:",
              "• Process Boundary: Clear trigger event (start) and verified outcome (end).",
              "• Swimlanes: Horizontal or vertical lanes representing distinct actors, roles, or departments.",
              "• Activity Boxes: Action verbs indicating specific tasks (e.g. 'Validate Lead Budget').",
              "• Decision Diamonds: Expressed as closed questions (e.g. 'Is budget > £10k?').",
              "• Hand-offs & Rework Loops: Transitions between swimlanes where delays and information loss frequently occur.",
            ],
          },
          {
            heading: "Gap Analysis: As-Is vs To-Be",
            paragraphs: [
              "Gap analysis compares the current baseline ('As-Is') with the target future state ('To-Be'):",
              "• As-Is Model: Captures actual observed practice, including informal workarounds, manual spreadsheets, and delay queues.",
              "• Pain Point Identification: Classifies friction using the 5 Whys to isolate root causes.",
              "• To-Be Model: Streamlines value streams, eliminates non-value-adding steps, embeds automated triggers, and establishes quality controls.",
            ],
          },
          {
            heading: "Advantcore Process Redesign",
            paragraphs: [
              "Advantcore's As-Is map exposes that enquiries sit in general inboxes for 1.5 days before being manually re-typed into 'Leads_2026.xlsx' (taking 3.3 days). The future-state To-Be design replaces manual spreadsheet transfers with structured web intake and automated webhook triage, reducing total cycle time from 14 days down to 4 days.",
            ],
          },
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
          {
            id: "q-4-2",
            prompt: "What is the primary value of using swimlane notation in business process modelling?",
            explanation: "Swimlanes make departmental responsibilities, cross-functional hand-offs, and delay points visually explicit.",
            options: [
              { key: "a", text: "To calculate code complexity metrics", isCorrect: false },
              { key: "b", text: "To make actor responsibilities and cross-role hand-offs visible", isCorrect: true },
              { key: "c", text: "To replace the need for written requirements", isCorrect: false },
              { key: "d", text: "To assign salaries to project participants", isCorrect: false },
            ],
          },
          {
            id: "q-4-3",
            prompt: "In standard process modelling conventions, how should decision diamonds always be formulated?",
            explanation: "Decision diamonds must be formulated as closed questions with explicit branching outcomes (e.g. Yes/No).",
            options: [
              { key: "a", text: "As broad, open-ended paragraphs", isCorrect: false },
              { key: "b", text: "As closed questions with explicit conditional outgoing paths", isCorrect: true },
              { key: "c", text: "As software code algorithms", isCorrect: false },
              { key: "d", text: "As department names", isCorrect: false },
            ],
          },
          {
            id: "q-4-4",
            prompt: "What is the primary objective of Gap Analysis when defining target business solutions?",
            explanation: "Gap analysis compares current capability (As-Is) against required capability (To-Be) across all POPIT dimensions.",
            options: [
              { key: "a", text: "To identify the gap between As-Is baseline capability and target To-Be capability", isCorrect: true },
              { key: "b", text: "To measure the physical distance between office desks", isCorrect: false },
              { key: "c", text: "To eliminate all stakeholders with low interest", isCorrect: false },
              { key: "d", text: "To write technical database migration scripts", isCorrect: false },
            ],
          },
          {
            id: "q-4-5",
            prompt: "Which of the following is an example of a Business Rule?",
            explanation: "A business rule defines or constrains some aspect of business policy (e.g. qualification preconditions).",
            options: [
              { key: "a", text: "The form background is coloured navy blue", isCorrect: false },
              { key: "b", text: "An enquiry cannot be qualified until budget range and decision-maker authority are recorded", isCorrect: true },
              { key: "c", text: "The discovery interview lasts 45 minutes", isCorrect: false },
              { key: "d", text: "The analyst uses Microsoft Word", isCorrect: false },
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
        intro: "Master elicitation techniques, functional vs non-functional requirements taxonomy, MoSCoW prioritisation, and Given-When-Then user stories.",
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
        bodyContent: [
          {
            heading: "Requirements Engineering Framework (BCS Syllabus Modules 10, 11 & 12)",
            paragraphs: [
              "Requirements express a needed capability or quality that delivers business value. The RE framework encompasses five stages: Elicitation -> Analysis -> Documentation / Modelling -> Validation -> Management (Traceability & Change Control).",
            ],
          },
          {
            heading: "Requirements Taxonomy: Types of Requirements",
            paragraphs: [
              "1. General Requirements: High-level business policies, legal constraints (UK GDPR), brand standards, sustainability guidelines.",
              "2. Technical Requirements: Infrastructure constraints, supported browsers, hardware specifications, data retention limits.",
              "3. Functional Requirements: Specific system behaviours, actions, data input, calculations, workflows, and reporting.",
              "4. Non-Functional Requirements (NFRs / Quality Attributes): Performance (response times), Security (authentication, role-based access), Availability (99.9% uptime), Usability (accessibility, WCAG compliance), Backup/Recovery, Scalability.",
            ],
          },
          {
            heading: "MoSCoW Prioritisation Rules (Must Know)",
            paragraphs: [
              "• Must Have: Critical core capability. The project CANNOT go live without it; there is no viable workaround. Every Must requirement MUST have a documented, defensible consequence if omitted.",
              "• Should Have: Highly important capability with significant business value, but a temporary workaround exists for initial go-live.",
              "• Could Have: Desirable capability that will be delivered only if excess time and budget permit.",
              "• Won't Have (This Time): Explicitly agreed to be out of scope for the current release, protecting scope boundaries.",
            ],
          },
          {
            heading: "Agile User Stories & Given-When-Then Acceptance Criteria",
            paragraphs: [
              "User Story 3Cs Principle: Card (concise statement), Conversation (ongoing stakeholder refinement), Confirmation (testable acceptance criteria).",
              "Standard User Story Format: As a [User Role], I want [Capability / Feature], So that [Measurable Business Value].",
              "Given-When-Then (GWT / Gherkin) Acceptance Criteria:",
              "• Given [Initial precondition or system state]",
              "• When [Action or trigger event occurs]",
              "• Then [Expected verifiable outcome]",
              "Example: Given an inbound enquiry with missing contact email, When the consultant clicks Submit, Then submission is blocked and the missing field is highlighted in red.",
            ],
          },
          {
            heading: "End-to-End Traceability",
            paragraphs: [
              "A Requirements Traceability Matrix connects every Business Objective -> Requirement ID -> User Story -> Process Model -> Test Case -> Realised Benefit. Traceability prevents scope creep and ensures no orphan requirements exist.",
            ],
          },
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
            explanation: "Performance, response times, and quality attributes are Non-Functional Requirements (NFRs).",
            options: [
              { key: "a", text: "Non-functional requirement", isCorrect: true },
              { key: "b", text: "Functional requirement", isCorrect: false },
              { key: "c", text: "General business policy", isCorrect: false },
              { key: "d", text: "Legal constraint", isCorrect: false },
            ],
          },
          {
            id: "q-5-2",
            prompt: "Under the MoSCoW prioritisation technique, what is mandatory to justify assigning a 'Must Have' priority?",
            explanation: "Every Must requirement must have a clear, documented failure consequence explaining why the project cannot launch without it.",
            options: [
              { key: "a", text: "The request came from the most senior director", isCorrect: false },
              { key: "b", text: "A defensible failure consequence demonstrating the project fails without it", isCorrect: true },
              { key: "c", text: "The requirement requires more than 50 lines of code", isCorrect: false },
              { key: "d", text: "It was requested by an external marketing consultant", isCorrect: false },
            ],
          },
          {
            id: "q-5-3",
            prompt: "Which of the following user stories contains an explicit and testable business value statement?",
            explanation: "A complete user story defines Role, Capability, and Value ('so that planning starts without clarification delays').",
            options: [
              { key: "a", text: "As a user, I want a modern web form.", isCorrect: false },
              { key: "b", text: "The system shall capture lead data in SQL.", isCorrect: false },
              { key: "c", text: "As a Delivery Lead, I want complete scoping criteria so that project mobilization begins without clarification delays.", isCorrect: true },
              { key: "d", text: "Create an enquiry screen for sales consultants.", isCorrect: false },
            ],
          },
          {
            id: "q-5-4",
            prompt: "What is the primary benefit of structuring Acceptance Criteria in Given-When-Then (GWT) format?",
            explanation: "GWT format establishes unambiguous, observable preconditions and expected outcomes that support direct verification.",
            options: [
              { key: "a", text: "It eliminates the need for software developers", isCorrect: false },
              { key: "b", text: "It defines observable, testable conditions for verifying requirement fulfilment", isCorrect: true },
              { key: "c", text: "It automatically calculates project ROI", isCorrect: false },
              { key: "d", text: "It avoids the need for stakeholder approval", isCorrect: false },
            ],
          },
          {
            id: "q-5-5",
            prompt: "A change request affects 4 functional requirements and 2 acceptance test cases. Which artefact most directly exposes these relationships?",
            explanation: "A Requirements Traceability Matrix connects objectives to requirements, process models, test cases, and benefits.",
            options: [
              { key: "a", text: "PESTLE analysis", isCorrect: false },
              { key: "b", text: "Requirements Traceability Matrix", isCorrect: true },
              { key: "c", text: "Stakeholder Power-Interest Grid", isCorrect: false },
              { key: "d", text: "Business Model Canvas", isCorrect: false },
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
        bodyContent: [
          {
            heading: "Making the Business Case (BCS Syllabus Module 9)",
            paragraphs: [
              "A business case is a decision-support document that justifies investment in business change. It establishes whether an initiative is strategically aligned, commercially viable, and operationally achievable.",
              "Core Business Case Structure: 1. Executive Summary. 2. Current Business Situation & Problem Diagnosis. 3. Options Appraisal. 4. Cost-Benefit Analysis. 5. Risk Assessment (RAID log). 6. Recommendations & Implementation Milestones.",
            ],
          },
          {
            heading: "Options Appraisal: The Mandatory 'Do Nothing' Baseline",
            paragraphs: [
              "An options appraisal must compare at least three credible options:",
              "• Option 1: Do Nothing (Business as Usual - BAU). This is the mandatory baseline that calculates the cost, lost revenue, and operational degradation if no investment is made.",
              "• Option 2: Do Minimum. The lowest-cost intervention that addresses only critical compliance or failure points (e.g. standard operating checklists).",
              "• Option 3: Do Something (Target Solution). The proposed optimal solution providing full automation and strategic value.",
            ],
          },
          {
            heading: "Cost-Benefit & Investment Appraisal Metrics",
            paragraphs: [
              "Costs and Benefits are categorized across two dimensions: Immediate vs Longer-term, and Tangible (monetary/numerical) vs Intangible (qualitative reputation/morale):",
              "• Simple ROI Formula: ROI = ((Total Benefits - Total Costs) / Total Costs) x 100%.",
              "  Example: If a solution costs £10,000 and generates £15,000 in net benefit over Year 1, ROI = ((15,000 - 10,000) / 10,000) x 100 = 50%.",
              "• Payback Period: The exact time required for cumulative cash inflows from benefits to equal the initial capital expenditure (CapEx).",
              "• Intangible Benefits Rule: Every intangible benefit (e.g. 'improved client experience') must still have an associated evidence measurement plan and assigned owner.",
            ],
          },
          {
            heading: "UAT Acceptance & Benefits Realisation (BCS Syllabus Modules 13 & 14)",
            paragraphs: [
              "• Business Acceptance Testing (UAT): Operational business users execute realistic test scenarios to verify business fitness. Defects are triaged and formally resolved before go-live sign-off.",
              "• Benefits Realisation: Benefits do not automatically appear at go-live; they require sustained adoption. A Benefits Register defines each benefit metric, baseline value, target threshold, review frequency, and designated Operational Benefit Owner.",
            ],
          },
          {
            heading: "Advantcore Business Case Recommendation",
            paragraphs: [
              "For Advantcore Ltd, Option 2 (CRM Workflow Automation) costs £12,500 CapEx with £2,400/yr OpEx. It recovers £28,000 in saved consultant time and recovered lead revenue annually, delivering an estimated 145% ROI and a payback period of 7.4 months, fully satisfying Sarah Mitchell's 12-month commercial hurdle.",
            ],
          },
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
          {
            id: "q-6-2",
            prompt: "A business change project incurs a total cost of £20,000 and delivers £30,000 in measurable financial benefits over Year 1. What is the Simple ROI?",
            explanation: "Simple ROI = ((Benefits - Costs) / Costs) * 100 = ((30,000 - 20,000) / 20,000) * 100 = 50%.",
            options: [
              { key: "a", text: "25%", isCorrect: false },
              { key: "b", text: "33.3%", isCorrect: false },
              { key: "c", text: "50%", isCorrect: true },
              { key: "d", text: "150%", isCorrect: false },
            ],
          },
          {
            id: "q-6-3",
            prompt: "What is the definition of the 'Payback Period' in business case investment appraisal?",
            explanation: "The payback period is the time required for cumulative benefits/cash inflows to equal and recover the initial investment cost.",
            options: [
              { key: "a", text: "The length of time required for cumulative benefits to recover the initial investment", isCorrect: true },
              { key: "b", text: "The date when the development team is paid their final bonus", isCorrect: false },
              { key: "c", text: "The total duration of the user acceptance testing phase", isCorrect: false },
              { key: "d", text: "The warranty period provided by a third-party software vendor", isCorrect: false },
            ],
          },
          {
            id: "q-6-4",
            prompt: "A project proposes an intangible benefit of 'enhanced client brand perception'. What is required to make this valid in a formal business case?",
            explanation: "Intangible benefits must still have an associated evidence measurement plan (e.g. CSAT score), a baseline, a target, and an assigned owner.",
            options: [
              { key: "a", text: "It must be deleted immediately because it cannot be given a pound value", isCorrect: false },
              { key: "b", text: "It must have an evidence measurement indicator, target review date, and assigned owner", isCorrect: true },
              { key: "c", text: "It only requires the CEO's verbal endorsement", isCorrect: false },
              { key: "d", text: "It can be left completely unmeasured", isCorrect: false },
            ],
          },
          {
            id: "q-6-5",
            prompt: "What is the primary purpose of User Acceptance Testing (UAT) in the business change lifecycle?",
            explanation: "UAT confirms that the delivered business system meets business needs in realistic operational scenarios before go-live sign-off.",
            options: [
              { key: "a", text: "To check the syntax and formatting of source code files", isCorrect: false },
              { key: "b", text: "To confirm that the solution supports business use in realistic operational scenarios", isCorrect: true },
              { key: "c", text: "To replace the need for an approved business case", isCorrect: false },
              { key: "d", text: "To select which software vendor to invite to pitch", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
]
