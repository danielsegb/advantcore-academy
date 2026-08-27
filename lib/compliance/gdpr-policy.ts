export interface RetentionScheduleItem {
  category: string
  purpose: string
  retentionPeriod: string
  lawfulBasis: string
  storageLocation: string
}

export const gdprRetentionSchedule: RetentionScheduleItem[] = [
  {
    category: "Learner Account & Identity",
    purpose: "Account administration, pathway assignment and verification",
    retentionPeriod: "3 years following account inactivity",
    lawfulBasis: "Contractual necessity (UK GDPR Art. 6(1)(b))",
    storageLocation: "Encrypted Supabase PostgreSQL (London eu-west-2)",
  },
  {
    category: "Assessed Workplace Evidence",
    purpose: "Academic integrity, independent review audits, and credential verification",
    retentionPeriod: "5 years following completion",
    lawfulBasis: "Legitimate interests (UK GDPR Art. 6(1)(f))",
    storageLocation: "Private Quarantine Storage / PostgreSQL",
  },
  {
    category: "Mock Exam & Quiz Logs",
    purpose: "Curriculum progression and mastery evaluation",
    retentionPeriod: "2 years following completion",
    lawfulBasis: "Contractual necessity (UK GDPR Art. 6(1)(b))",
    storageLocation: "Encrypted Supabase PostgreSQL (London eu-west-2)",
  },
  {
    category: "Meeting Transcripts & Minutes",
    purpose: "Simulated workplace learning and coaching feedback",
    retentionPeriod: "1 year following meeting conclusion",
    lawfulBasis: "Contractual necessity (UK GDPR Art. 6(1)(b))",
    storageLocation: "Encrypted Supabase PostgreSQL (London eu-west-2)",
  },
  {
    category: "Meeting Video & Audio Recordings",
    purpose: "Local learner presentation practice",
    retentionPeriod: "0 days (Processed locally in browser; no server retention during pilot)",
    lawfulBasis: "Explicit consent (UK GDPR Art. 6(1)(a))",
    storageLocation: "Client Device Only",
  },
  {
    category: "Security & Audit Event Logs",
    purpose: "System security, integrity protection, and fraud defense",
    retentionPeriod: "90 days rolling retention",
    lawfulBasis: "Legal obligation & Legitimate interests",
    storageLocation: "Immutable Audit Log Table",
  },
]

export interface DsarExportPackage {
  dataSubjectId: string
  exportDate: string
  controller: {
    legalEntity: string
    registration: string
    dpoContact: string
    jurisdiction: string
  }
  profile: {
    fullName: string
    email: string
    role: string
    accountStatus: string
  }
  pathwayEnrollments: {
    pathwayTitle: string
    enrolledAt: string
    estimatedGraduation: string
    paceStatus: string
  }[]
  learningProgress: {
    module: string
    passedQuizzes: number
    masteryScore: number
  }[]
  workplaceEvidence: {
    deliverableId: string
    title: string
    stage: string
    status: string
    approvedAt?: string
  }[]
  readinessSnapshot: {
    overallReadiness: number
    knowledgeMastery: number
    mockExamScore: number
    workplaceEvidenceScore: number
  }
  complianceNotice: string
}

export function buildDsarExportPackage(
  userId = "usr-demo-001",
  fullName = "Amanda Okafor",
  email = "amanda@advantcore.co"
): DsarExportPackage {
  return {
    dataSubjectId: userId,
    exportDate: new Date().toISOString(),
    controller: {
      legalEntity: "Advantcore Ltd",
      registration: "Registered in England & Wales",
      dpoContact: "privacy@advantcore.co",
      jurisdiction: "United Kingdom (UK GDPR / Data Protection Act 2018)",
    },
    profile: {
      fullName,
      email,
      role: "Learner",
      accountStatus: "Active",
    },
    pathwayEnrollments: [
      {
        pathwayTitle: "Business Analyst Career Accelerator (BCS Foundation)",
        enrolledAt: "2026-08-01",
        estimatedGraduation: "2026-10-30",
        paceStatus: "12 days ahead of schedule",
      },
    ],
    learningProgress: [
      { module: "Module 01: Business analysis foundations", passedQuizzes: 1, masteryScore: 92 },
      { module: "Module 02: Strategy analysis", passedQuizzes: 1, masteryScore: 94 },
      { module: "Module 03: Stakeholder analysis", passedQuizzes: 1, masteryScore: 90 },
      { module: "Module 04: Business systems modelling", passedQuizzes: 1, masteryScore: 95 },
    ],
    workplaceEvidence: [
      { deliverableId: "ev-001", title: "Project Charter Formulation", stage: "Stage 1", status: "approved", approvedAt: "2026-08-10" },
      { deliverableId: "ev-002", title: "Stakeholder RACI Matrix", stage: "Stage 2", status: "approved", approvedAt: "2026-08-18" },
      { deliverableId: "ev-003", title: "As-Is Process Swimlane Diagram", stage: "Stage 3", status: "in_review" },
    ],
    readinessSnapshot: {
      overallReadiness: 80,
      knowledgeMastery: 87,
      mockExamScore: 82,
      workplaceEvidenceScore: 68,
    },
    complianceNotice: "This certified export contains all personal and educational data processed by Advantcore Academy pursuant to UK GDPR Article 15 (Right of Access).",
  }
}
