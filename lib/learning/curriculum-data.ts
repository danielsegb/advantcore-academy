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
        estimatedMinutes: 25,
        intro: "Master the official BCS definition of business analysis, the 5-stage change lifecycle, the 6 core professional principles, and the T-shaped competency framework.",
        outcomes: [
          "Explain the primary purpose of business analysis in organizational change",
          "Distinguish business advisory responsibilities from technical solution design",
          "Identify essential behavioral, business knowledge, and professional competencies",
          "Navigate the 6 core services of the Business Analysis Service Framework (BASF)",
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
              "Business analysis is a specialised professional practice that enables business change by identifying organizational needs, investigating problem situations holistically, and recommending viable options that deliver measurable value to stakeholders.",
              "A business analyst acts as an internal advisor who bridges the gap between executive leadership, operational staff, and technical delivery teams. The BA does not write low-level code or make executive budget approvals; rather, the BA investigates the root causes of operational friction, evaluates solution feasibility, and specifies target operating requirements.",
            ],
          },
          {
            heading: "The 5-Stage Business Change Lifecycle",
            paragraphs: [
              "1. Alignment: Ensuring that any change initiative directly supports the organisation's strategic goals, vision, and key performance indicators (KPIs).",
              "2. Definition: Investigating the current situation, diagnosing root causes, evaluating feasible solution options, and formulating the business case.",
              "3. Design: Specifying detailed functional, non-functional, data, and process requirements in collaboration with architects and designers.",
              "4. Implementation: Supporting delivery teams, facilitating user acceptance testing (UAT), and managing operational change readiness.",
              "5. Realisation: Tracking post-implementation performance metrics against original business case baselines to confirm genuine value creation.",
            ],
          },
          {
            heading: "The 6 Core Principles of Business Analysis (Must Know)",
            paragraphs: [
              "Principle 1: Root causes not symptoms — Never accept a surface symptom (e.g. 'leads are dropping') at face value; investigate the underlying structural causes using the 5 Whys and POPIT model.",
              "Principle 2: Business improvement not IT change — A software purchase is not always the answer. Many problems are resolved through process re-engineering, policy changes, or staff training.",
              "Principle 3: Options not predetermined solutions — Challenge the immediate assumption that a specific vendor tool is required. Always evaluate multiple feasible options, including the mandatory 'Do Nothing' baseline.",
              "Principle 4: Feasible, contributing requirements, not meeting all requests — A BA must protect project feasibility by challenging unfeasible requests and establishing defensible MoSCoW priorities.",
              "Principle 5: The entire business change lifecycle not just requirements — The BA's responsibility begins during strategy and problem analysis and continues through UAT, change rollout, and benefits realisation.",
              "Principle 6: Negotiation not avoidance — Conflicting stakeholder priorities must be surfaced and resolved collaboratively using objective evidence rather than passive avoidance.",
            ],
          },
          {
            heading: "The T-Shaped Competency Framework (BCS Syllabus Module 2)",
            paragraphs: [
              "A modern business analyst requires a T-shaped profile: broad collaborative breadth across related business disciplines plus deep technical mastery in core analysis techniques.",
              "The 3 Core Competency Domains are:",
              "• Personal Qualities: Critical thinking, communication, active listening, relationship management, curiosity, and ethical conduct.",
              "• Business Knowledge: Commercial awareness, organizational structure, customer journeys, financial metrics (CapEx, OpEx, ROI), and regulation.",
              "• Professional Techniques: Elicitation (interviews, workshops, observation), process modelling (BPMN swimlanes), gap analysis, requirements engineering (user stories, GWT), and business case appraisal.",
            ],
          },
          {
            heading: "The Business Analysis Service Framework (BASF)",
            paragraphs: [
              "The BASF defines the 6 standard services provided by a BA practice across the change lifecycle: 1. Situation investigation. 2. Feasibility assessment & business case. 3. Business process improvement. 4. Requirements definition. 5. Business acceptance testing. 6. Business change deployment.",
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
          {
            id: "q-1-6",
            prompt: "According to BA Principle 2 ('Business improvement not IT change'), which of the following is an example of an effective non-IT business solution?",
            explanation: "Streamlining hand-off protocols and re-aligning staff roles improves business efficiency without necessarily purchasing new software.",
            options: [
              { key: "a", text: "Purchasing a new server cluster without consulting users", isCorrect: false },
              { key: "b", text: "Streamlining hand-off procedures, re-defining roles, and training staff", isCorrect: true },
              { key: "c", text: "Writing 5,000 lines of custom microservice code", isCorrect: false },
              { key: "d", text: "Migrating from one cloud vendor to another without altering workflows", isCorrect: false },
            ],
          },
          {
            id: "q-1-7",
            prompt: "Under BA Principle 4 ('Feasible, contributing requirements'), what should a BA do when an executive stakeholder requests a feature that contradicts the project charter objectives?",
            explanation: "The BA must challenge unfeasible or misaligned requests and evaluate their contribution against the charter objectives.",
            options: [
              { key: "a", text: "Accept it immediately and mark it as a Must Have", isCorrect: false },
              { key: "b", text: "Challenge the request and evaluate its contribution and feasibility against project objectives", isCorrect: true },
              { key: "c", text: "Silently remove it from the backlog without telling the stakeholder", isCorrect: false },
              { key: "d", text: "Immediately cancel the entire project", isCorrect: false },
            ],
          },
          {
            id: "q-1-8",
            prompt: "What is the role of the Skills Framework for the Information Age (SFIA) in business analysis professional development?",
            explanation: "SFIA defines standardized levels of responsibility, skills, and competencies across digital and IT disciplines.",
            options: [
              { key: "a", text: "It provides standardized descriptions of professional skill levels and competency stages", isCorrect: true },
              { key: "b", text: "It is a proprietary programming language for financial analysts", isCorrect: false },
              { key: "c", text: "It dictates the exact price of software consulting contracts", isCorrect: false },
              { key: "d", text: "It replaces the need for any BCS qualifications", isCorrect: false },
            ],
          },
          {
            id: "q-1-9",
            prompt: "How does the primary focus of a Business Analyst differ from that of a Project Manager?",
            explanation: "The BA focuses on diagnosing problems and ensuring the right solution is defined, while the PM focuses on delivery timelines, budget, and resources.",
            options: [
              { key: "a", text: "The BA manages team salaries; the PM writes user stories", isCorrect: false },
              { key: "b", text: "The BA ensures the solution solves the business problem; the PM manages delivery schedule, scope, and resources", isCorrect: true },
              { key: "c", text: "There is no difference; the two roles are identical in agile teams", isCorrect: false },
              { key: "d", text: "The PM reports directly to the BA on all corporate governance", isCorrect: false },
            ],
          },
          {
            id: "q-1-10",
            prompt: "What is the primary activity carried out during the 'Realisation' stage of the Business Change Lifecycle?",
            explanation: "During Realisation, post-implementation reviews evaluate whether planned business benefits are being achieved against the business case baseline.",
            options: [
              { key: "a", text: "Writing initial project charters and stakeholder registers", isCorrect: false },
              { key: "b", text: "Monitoring operational performance to evaluate whether business case benefits were achieved", isCorrect: true },
              { key: "c", text: "Conducting initial discovery interviews with operational staff", isCorrect: false },
              { key: "d", text: "Drafting the software database schema", isCorrect: false },
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
          "Distinguish Critical Success Factors (CSFs) from Key Performance Indicators (KPIs)",
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
              "Strategy connects an organization's high-level purpose with operational execution. A project that is technically well-executed but strategically misaligned will fail to deliver commercial value. Strategy analysis consists of external macro scanning (PESTLE), competitive industry analysis (Porter's Five Forces), internal alignment (VMOST), and evidence synthesis (SWOT/TOWS).",
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
            heading: "Internal Capability Audits & Balanced Scorecard",
            paragraphs: [
              "A Resource Audit assesses internal physical, financial, human, and intangible intellectual assets.",
              "The Balanced Scorecard evaluates organizational health across 4 balanced perspectives: Financial, Customer, Internal Business Processes, and Learning & Growth.",
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
          {
            id: "q-2-6",
            prompt: "In Porter's Five Forces model, when is the Bargaining Power of Suppliers highest?",
            explanation: "Supplier power is high when the supplier provides a unique or proprietary product and switching costs are prohibitively high.",
            options: [
              { key: "a", text: "When there are hundreds of interchangeable commodity suppliers", isCorrect: false },
              { key: "b", text: "When switching costs are high and the supplier's product is unique or proprietary", isCorrect: true },
              { key: "c", text: "When buyers purchase in massive wholesale volumes", isCorrect: false },
              { key: "d", text: "When there is no intellectual property protection in the sector", isCorrect: false },
            ],
          },
          {
            id: "q-2-7",
            prompt: "What is the primary purpose of a TOWS Matrix in strategic synthesis?",
            explanation: "A TOWS matrix combines internal strengths/weaknesses with external opportunities/threats to generate specific strategic options (e.g. SO, ST, WO, WT strategies).",
            options: [
              { key: "a", text: "To pair strengths and weaknesses with opportunities and threats to generate strategic actions", isCorrect: true },
              { key: "b", text: "To draw BPMN swimlane process maps", isCorrect: false },
              { key: "c", text: "To replace financial accounting records", isCorrect: false },
              { key: "d", text: "To assign daily programming tasks to software engineers", isCorrect: false },
            ],
          },
          {
            id: "q-2-8",
            prompt: "In the Boston Box (BCG Matrix), which quadrant represents business units with high market share in a mature, low-growth market?",
            explanation: "Cash Cows have high market share in mature markets and generate steady cash flows to fund new growth areas.",
            options: [
              { key: "a", text: "Stars", isCorrect: false },
              { key: "b", text: "Cash Cows", isCorrect: true },
              { key: "c", text: "Wild Cats / Problem Children", isCorrect: false },
              { key: "d", text: "Dogs", isCorrect: false },
            ],
          },
          {
            id: "q-2-9",
            prompt: "What are the four perspectives evaluated in Kaplan and Norton's Balanced Scorecard?",
            explanation: "The Balanced Scorecard measures Financial, Customer, Internal Business Processes, and Learning & Growth.",
            options: [
              { key: "a", text: "Financial, Customer, Internal Business Processes, Learning & Growth", isCorrect: true },
              { key: "b", text: "People, Organisation, Process, Technology", isCorrect: false },
              { key: "c", text: "Political, Economic, Social, Technological", isCorrect: false },
              { key: "d", text: "Hardware, Software, Data, Infrastructure", isCorrect: false },
            ],
          },
          {
            id: "q-2-10",
            prompt: "A Business Analyst conducts an internal Resource Audit. Which of the following is an example of an 'Intangible' organizational resource?",
            explanation: "Brand reputation, employee know-how, and proprietary intellectual property are intangible resources.",
            options: [
              { key: "a", text: "Office desktop computers and server racks", isCorrect: false },
              { key: "b", text: "Brand reputation, employee tacit knowledge, and client relationships", isCorrect: true },
              { key: "c", text: "Bank account cash balance", isCorrect: false },
              { key: "d", text: "Company warehouse real estate", isCorrect: false },
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
          "Apply elicitation triangulation to reconcile conflicting stakeholder inputs",
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
          {
            id: "q-3-6",
            prompt: "How should a stakeholder categorized as 'High Power / Low Interest' (e.g. Helen Grant, Independent Reviewer) be managed?",
            explanation: "High power, low interest stakeholders must be kept satisfied with concise executive summaries and adherence to compliance rules.",
            options: [
              { key: "a", text: "Keep satisfied with concise governance reports and early risk escalations", isCorrect: true },
              { key: "b", text: "Require them to attend daily 2-hour technical standups", isCorrect: false },
              { key: "c", text: "Exclude them from all communications", isCorrect: false },
              { key: "d", text: "Delegate project sponsorship authority to them", isCorrect: false },
            ],
          },
          {
            id: "q-3-7",
            prompt: "What is the difference between 'Consulted' and 'Informed' in a RACI matrix?",
            explanation: "Consulted involves two-way dialogue to obtain expert advice before completion; Informed is one-way notification of status or completion.",
            options: [
              { key: "a", text: "Consulted is two-way input prior to completion; Informed is one-way notification of results", isCorrect: true },
              { key: "b", text: "Consulted roles have veto power; Informed roles write the software code", isCorrect: false },
              { key: "c", text: "There is no difference between Consulted and Informed", isCorrect: false },
              { key: "d", text: "Informed stakeholders must sign off the deliverable", isCorrect: false },
            ],
          },
          {
            id: "q-3-8",
            prompt: "What is 'Tacit Knowledge' in the context of stakeholder investigation?",
            explanation: "Tacit knowledge is intuitive, unwritten know-how that people possess but struggle to verbalize without practical demonstration.",
            options: [
              { key: "a", text: "Written company policy published on an intranet", isCorrect: false },
              { key: "b", text: "Intuitive know-how and habitual practices that stakeholders perform but may not articulate in interviews", isCorrect: true },
              { key: "c", text: "Published regulatory laws and statutes", isCorrect: false },
              { key: "d", text: "Financial spreadsheets with audited figures", isCorrect: false },
            ],
          },
          {
            id: "q-3-9",
            prompt: "During discovery, interview notes state that enquiry qualification takes 10 minutes, but system logs show an average turnaround of 4.8 days. What should the BA do?",
            explanation: "The BA must triangulate the data to investigate why operational friction or wait times cause the discrepancy between perception and reality.",
            options: [
              { key: "a", text: "Accuse the stakeholder of lying and cancel future meetings", isCorrect: false },
              { key: "b", text: "Triangulate the data by investigating queue times, hand-offs, and batching delays", isCorrect: true },
              { key: "c", text: "Delete the system logs and use only the interview notes", isCorrect: false },
              { key: "d", text: "Ignore the finding because it does not affect software coding", isCorrect: false },
            ],
          },
          {
            id: "q-3-10",
            prompt: "Which question style is most effective during the initial open-exploration phase of a discovery interview?",
            explanation: "Open questions (What, How, Why) encourage stakeholders to explain workflows, friction points, and context in their own words.",
            options: [
              { key: "a", text: "Closed questions that only permit Yes/No answers", isCorrect: false },
              { key: "b", text: "Open-ended questions that encourage broad descriptions of process and challenges", isCorrect: true },
              { key: "c", text: "Leading questions that steer the stakeholder to a pre-chosen software tool", isCorrect: false },
              { key: "d", text: "Multiple choice questions with only technical jargon", isCorrect: false },
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
          "Identify process bottlenecks, rework loops, and hand-off delays",
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
          {
            id: "q-4-6",
            prompt: "What are the three levels of the standard business process hierarchy?",
            explanation: "The hierarchy progresses from Enterprise level (value chain) to Event-Response level to Actor-Task level.",
            options: [
              { key: "a", text: "Enterprise level -> Event-Response level -> Actor-Task level", isCorrect: true },
              { key: "b", text: "Database -> Backend -> Frontend", isCorrect: false },
              { key: "c", text: "Strategy -> Tactics -> Payroll", isCorrect: false },
              { key: "d", text: "Waterfall -> Agile -> Kanban", isCorrect: false },
            ],
          },
          {
            id: "q-4-7",
            prompt: "What is a Business Activity Model (BAM) in business systems modelling?",
            explanation: "A BAM is a conceptual model showing the business activities needed to achieve a particular business perspective, independent of current IT systems.",
            options: [
              { key: "a", text: "A technical database entity relationship diagram", isCorrect: false },
              { key: "b", text: "A conceptual model of activities necessary to achieve a business perspective", isCorrect: true },
              { key: "c", text: "A project Gantt chart showing developer work schedules", isCorrect: false },
              { key: "d", text: "A marketing wireframe mockup", isCorrect: false },
            ],
          },
          {
            id: "q-4-8",
            prompt: "In process modelling, where do operational bottlenecks and communication failures most frequently occur?",
            explanation: "Friction occurs most often at swimlane boundaries where hand-offs between different teams take place.",
            options: [
              { key: "a", text: "Inside single-step automated script executions", isCorrect: false },
              { key: "b", text: "At hand-off points and transitions between different swimlanes or departments", isCorrect: true },
              { key: "c", text: "In the title header of the diagram", isCorrect: false },
              { key: "d", text: "Only during night shifts", isCorrect: false },
            ],
          },
          {
            id: "q-4-9",
            prompt: "What is an end-to-end 'Value Stream' in business process improvement?",
            explanation: "A value stream represents the complete sequence of activities that starts with a customer trigger and delivers a verified outcome/value.",
            options: [
              { key: "a", text: "A financial cash flow statement for investors", isCorrect: false },
              { key: "b", text: "The sequence of activities triggered by a customer request that delivers a valuable business outcome", isCorrect: true },
              { key: "c", text: "A list of software programming languages", isCorrect: false },
              { key: "d", text: "An HR employee performance appraisal cycle", isCorrect: false },
            ],
          },
          {
            id: "q-4-10",
            prompt: "How does the '5 Whys' root-cause technique assist process analysis?",
            explanation: "The 5 Whys drills past surface symptoms (e.g. 'intake is slow') to uncover the underlying systemic process failure.",
            options: [
              { key: "a", text: "It repeatedly asks 'why' to drill beneath symptoms to the underlying systemic cause", isCorrect: true },
              { key: "b", text: "It asks 5 different stakeholders the same multiple-choice question", isCorrect: false },
              { key: "c", text: "It estimates the project budget by multiplying by 5", isCorrect: false },
              { key: "d", text: "It limits the project scope to exactly 5 user stories", isCorrect: false },
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
          "Construct and manage an End-to-End Requirements Traceability Matrix",
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
            heading: "End-to-End Traceability & Data Dictionaries",
            paragraphs: [
              "A Requirements Traceability Matrix connects every Business Objective -> Requirement ID -> User Story -> Process Model -> Test Case -> Realised Benefit. Traceability prevents scope creep and ensures no orphan requirements exist.",
              "A Data Dictionary defines the business meaning, format, validation rules, and authoritative source for every data field in the system.",
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
          {
            id: "q-5-6",
            prompt: "Under MoSCoW, what differentiates a 'Should Have' requirement from a 'Must Have' requirement?",
            explanation: "A Should Have is highly important and valuable, but a temporary workaround exists for go-live, whereas a Must Have has no viable workaround.",
            options: [
              { key: "a", text: "A Should Have is critical; a Must Have is optional", isCorrect: false },
              { key: "b", text: "A Should Have has high business value, but a viable workaround exists for initial launch", isCorrect: true },
              { key: "c", text: "A Should Have is always delivered in the second year of operations", isCorrect: false },
              { key: "d", text: "A Should Have does not require testing", isCorrect: false },
            ],
          },
          {
            id: "q-5-7",
            prompt: "In Agile requirements engineering, what do the '3Cs' stand for in User Story development?",
            explanation: "The 3Cs represent Card (placeholder), Conversation (ongoing collaboration), and Confirmation (testable acceptance criteria).",
            options: [
              { key: "a", text: "Card, Conversation, Confirmation", isCorrect: true },
              { key: "b", text: "Code, Compile, Commit", isCorrect: false },
              { key: "c", text: "Customer, Cost, Contract", isCorrect: false },
              { key: "d", text: "Charter, Criteria, Change", isCorrect: false },
            ],
          },
          {
            id: "q-5-8",
            prompt: "Which requirement quality criteria states that a requirement must be demonstrable through an observable test or inspection?",
            explanation: "Testability (or Verifiability) ensures that unambiguous criteria exist to confirm whether the requirement has been met.",
            options: [
              { key: "a", text: "Ambiguity", isCorrect: false },
              { key: "b", text: "Testability / Verifiability", isCorrect: true },
              { key: "c", text: "Redundancy", isCorrect: false },
              { key: "d", text: "Volatility", isCorrect: false },
            ],
          },
          {
            id: "q-5-9",
            prompt: "What is the primary purpose of maintaining a project Data Dictionary?",
            explanation: "A data dictionary provides a single authoritative definition of data items, field types, validation constraints, and business meanings.",
            options: [
              { key: "a", text: "To define the business meaning, data formats, and validation rules for all system data fields", isCorrect: true },
              { key: "b", text: "To store employee home addresses for HR payroll", isCorrect: false },
              { key: "c", text: "To translate English words into foreign languages", isCorrect: false },
              { key: "d", text: "To log software bug tickets for developers", isCorrect: false },
            ],
          },
          {
            id: "q-5-10",
            prompt: "What does establishing a 'Requirements Baseline' signify in requirements management governance?",
            explanation: "A baseline represents the formal sign-off of agreed scope, after which all proposed additions or changes must pass through formal change control.",
            options: [
              { key: "a", text: "That no further software development is allowed", isCorrect: false },
              { key: "b", text: "The formal approval of agreed scope, with subsequent changes governed by change control", isCorrect: true },
              { key: "c", text: "That all project team members must resign", isCorrect: false },
              { key: "d", text: "That testing has failed", isCorrect: false },
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
          "Establish an operational Benefits Realisation Plan with designated benefit owners",
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
              "• Net Present Value (NPV): Evaluates future cash flows by discounting them against an interest rate to account for the time value of money.",
              "• Intangible Benefits Rule: Every intangible benefit (e.g. 'improved client experience') must still have an associated evidence measurement plan and assigned owner.",
            ],
          },
          {
            heading: "UAT Acceptance & Benefits Realisation (BCS Syllabus Modules 13 & 14)",
            paragraphs: [
              "• Business Acceptance Testing (UAT): Operational business users execute realistic test scenarios to verify business fitness. Defects are triaged and formally resolved before go-live sign-off.",
              "• Benefits Realisation: Benefits do not automatically appear at go-live; they require sustained adoption. A Benefits Register defines each benefit metric, baseline value, target threshold, review frequency, and designated Operational Benefit Owner.",
              "• Post-Implementation Review (PIR): Formal evaluation conducted months after deployment to measure actual versus projected benefits and capture lessons learned.",
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
          {
            id: "q-6-6",
            prompt: "Why is Net Present Value (NPV) considered a more sophisticated investment appraisal metric than simple payback period?",
            explanation: "NPV accounts for the time value of money by discounting projected future cash inflows back to their present value.",
            options: [
              { key: "a", text: "It accounts for the time value of money by discounting future cash flows", isCorrect: true },
              { key: "b", text: "It ignores all project costs and only counts revenues", isCorrect: false },
              { key: "c", text: "It does not require any mathematical calculations", isCorrect: false },
              { key: "d", text: "It guarantees that a project will never fail", isCorrect: false },
            ],
          },
          {
            id: "q-6-7",
            prompt: "Which of the following is an example of an 'Intangible Cost' in a business case?",
            explanation: "Temporary loss of staff morale, customer friction during learning curves, and productivity dips during transition are intangible costs.",
            options: [
              { key: "a", text: "The monthly invoice for cloud database hosting", isCorrect: false },
              { key: "b", text: "Temporary staff disruption and productivity dip during initial transition", isCorrect: true },
              { key: "c", text: "The purchase price of 10 laptop computers", isCorrect: false },
              { key: "d", text: "The fee paid to an external training contractor", isCorrect: false },
            ],
          },
          {
            id: "q-6-8",
            prompt: "Who is an 'Operational Benefit Owner' in benefits realisation governance?",
            explanation: "The benefit owner is an operational manager accountable for realizing and tracking a specific business benefit post-deployment.",
            options: [
              { key: "a", text: "The software programmer who wrote the application code", isCorrect: false },
              { key: "b", text: "A designated business manager accountable for tracking and realizing a specific operational benefit", isCorrect: true },
              { key: "c", text: "The external recruitment agent who hired the team", isCorrect: false },
              { key: "d", text: "The hardware supplier who shipped the servers", isCorrect: false },
            ],
          },
          {
            id: "q-6-9",
            prompt: "What is the primary purpose of a Post-Implementation Review (PIR)?",
            explanation: "A PIR evaluates whether planned business case benefits were achieved, assesses project performance, and captures lessons learned.",
            options: [
              { key: "a", text: "To assess whether projected business case benefits were achieved and document lessons learned", isCorrect: true },
              { key: "b", text: "To begin writing initial user stories for the first time", isCorrect: false },
              { key: "c", text: "To conduct initial discovery interviews", isCorrect: false },
              { key: "d", text: "To negotiate software vendor contract pricing", isCorrect: false },
            ],
          },
          {
            id: "q-6-10",
            prompt: "What are the four components of a project RAID Log?",
            explanation: "A RAID log tracks Risks, Assumptions, Issues, and Dependencies.",
            options: [
              { key: "a", text: "Risks, Assumptions, Issues, Dependencies", isCorrect: true },
              { key: "b", text: "Requirements, Architecture, Implementation, Delivery", isCorrect: false },
              { key: "c", text: "Revenue, Assets, Investment, Debt", isCorrect: false },
              { key: "d", text: "Roles, Accounts, Interfaces, Data", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
]
