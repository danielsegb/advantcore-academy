export interface GroundedSource {
  sourceId: string
  title: string
  docType: string
  version: string
  section: string
  content: string
  applicableRoles: string[] // e.g. ["all", "BA Supervisor", "Project Sponsor", "Operations Lead", "Independent Reviewer"]
}

export const approvedProjectSources: GroundedSource[] = [
  {
    sourceId: "ADV-DOC-001",
    title: "Advantcore Enquiry-to-Delivery Project Charter",
    docType: "Project Charter",
    version: "v1.0",
    section: "Scope & Objectives",
    content: "Project ADV-BA-001 aims to reduce the client lead qualification and delivery mobilization cycle time from an average of 14 business days down to 4 business days. Excluded from scope: developing a proprietary billing engine or replacing the accounting ledger.",
    applicableRoles: ["all"],
  },
  {
    sourceId: "ADV-SOP-002",
    title: "Advantcore Client Intake Standard Operating Procedure",
    docType: "Standard Operating Procedure",
    version: "v2.0",
    section: "Operational Pain Points & CRM Gaps",
    content: "Client enquiries arrive via disparate email inboxes and web forms. Operations staff manually transfer details into disconnected spreadsheets, causing an average initial response lag of 4.8 business days and frequent omissions of critical client scoping requirements.",
    applicableRoles: ["Operations Lead", "BA Supervisor", "Project Sponsor"],
  },
  {
    sourceId: "BCS-BA-001",
    title: "BCS Foundation Certificate in Business Analysis Official Syllabus",
    docType: "Accredited Syllabus",
    version: "v4.2",
    section: "Professional Standards & Requirements Engineering",
    content: "Business Analysts must investigate situations using structured techniques (POPIT, BAM, Swimlanes), elicit functional and non-functional requirements without pre-judging solution design, maintain traceability, and formulate options appraisals based on sound business cases.",
    applicableRoles: ["all"],
  },
  {
    sourceId: "ADV-RACI-003",
    title: "Advantcore Governance & RACI Framework",
    docType: "Governance Matrix",
    version: "v1.1",
    section: "Role Accountabilities & Review Gates",
    content: "Sarah Mitchell is Accountable for commercial project charter sign-off and business case approval. Marcus Cole is Accountable for coaching deliverable rigor and BA standards. Priya Shah is Accountable for operational workflow accuracy. Helen Grant is Accountable for independent assessment audit sign-off.",
    applicableRoles: ["all"],
  },
]

/**
 * Retrieves verified sources for a given project code and character role.
 * Formats context with untrusted-data delimiters to prevent prompt injection.
 */
export function retrieveGroundedContext(
  projectCode = "ADV-BA-001",
  characterRole?: string
): { formattedContext: string; sources: { sourceId: string; title: string; section: string }[] } {
  // Filter sources applicable to project and character role
  const matchedSources = approvedProjectSources.filter(src => {
    if (!characterRole || characterRole === "all") return true
    return src.applicableRoles.includes("all") || src.applicableRoles.some(r => characterRole.toLowerCase().includes(r.toLowerCase()))
  })

  const sourcesList = matchedSources.map(s => ({
    sourceId: s.sourceId,
    title: s.title,
    section: s.section,
  }))

  const formattedDocs = matchedSources
    .map(
      s => `<source id="${s.sourceId}" title="${s.title}" section="${s.section}" version="${s.version}">
${s.content}
</source>`
    )
    .join("\n\n")

  const formattedContext = `<approved_project_sources project="${projectCode}">
${formattedDocs}
</approved_project_sources>`

  return { formattedContext, sources: sourcesList }
}
