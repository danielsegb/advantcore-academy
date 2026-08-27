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
    sourceId: "ADV-HDBK-01",
    title: "Advantcore BA Programme Handbook",
    docType: "Programme Handbook",
    version: "v1.0 (August 2026)",
    section: "12-Week Roadmap & Outcome Standards",
    content: "The 12-Week Business Analyst Programme follows 6 linked stages: learn the profession, prepare for certification, deliver genuine work, collect verified evidence, position evidence for the market, and run a disciplined job campaign. Duration: 10 to 15 hours weekly. Primary certification: BCS Foundation Certificate in Business Analysis. Primary project: Advantcore Client Enquiry-to-Delivery Improvement.",
    applicableRoles: ["all"],
  },
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
    sourceId: "ADV-TKT-03",
    title: "Advantcore BA Work Experience & Portfolio Toolkit",
    docType: "Delivery Toolkit",
    version: "v1.0",
    section: "10 Verified Project Deliverables & Review Gates",
    content: "Deliverables required for completion: 1. Executive Problem Statement; 2. Project Charter; 3. RACI Governance Matrix; 4. As-Is Process Swimlane Diagram; 5. Gap Analysis & Options Appraisal; 6. Formal Requirements Catalogue; 7. To-Be Target Process Model; 8. Business Case & ROI; 9. UAT Test Plan & Traceability; 10. Change Impact Assessment. Governed by Sponsor Sarah Mitchell and Reviewer Helen Grant.",
    applicableRoles: ["all"],
  },
  {
    sourceId: "BCS-STG-02",
    title: "BCS Foundation Study Guide & Timed Mocks",
    docType: "Study Guide",
    version: "v1.0",
    section: "14 Modules & 8-Week Certification Schedule",
    content: "Official BCS Foundation Exam format: 40 multiple-choice questions, 60 minutes, 65% pass mark (26/40). Covers 14 syllabus modules: Business Analysis Process Model, Strategy Analysis (SWOT/PESTLE/VMOST), Investigation Techniques, Stakeholder Management & Power/Interest Matrix, Process Modelling (BPMN), Options Appraisal, Business Cases, and Requirements Engineering.",
    applicableRoles: ["all"],
  },
  {
    sourceId: "BCS-TBK-05",
    title: "Business Analysis 4th Edition Official Textbook (Debra Paul & James Cadle)",
    docType: "Accredited Textbook",
    version: "4th Edition (BCS Publishing)",
    section: "Core Principles & Technique Taxonomy",
    content: "Authors: Debra Paul, James Cadle, Malcolm Eva, Craig Rollason, Jonathan Hunsley. Establishes the authoritative taxonomy for business analysis: POPIT (People, Organisation, Process, Information, Technology), Business Activity Models (BAM), CATWOE, RACI, Functional vs Non-Functional requirements, MoSCoW prioritisation, and Investment Appraisal (Payback, DCF, IRR).",
    applicableRoles: ["all"],
  },
  {
    sourceId: "ADV-JOB-04",
    title: "Business Analyst Job Landing Playbook",
    docType: "Career Playbook",
    version: "v1.0",
    section: "Target BA Lanes & STAR Interview Preparation",
    content: "Maps verified Advantcore project experience to 4 UK job market lanes: Digital/IT BA, Business/Process BA, Change/Project Analyst, and Product Analyst. Focuses on articulating verified deliverables, defending design decisions with evidence, and adhering to strict non-employment truth standards.",
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
    return src.applicableRoles.includes("all") || src.applicableRoles.includes(characterRole)
  })

  // Format into delimiter-encapsulated XML string
  const sourcePayloads = matchedSources.map(s => {
    return `<source id="${s.sourceId}" doc_type="${s.docType}" version="${s.version}" section="${s.section}">\n${s.content}\n</source>`
  })

  const formattedContext = `<approved_project_sources project_code="${projectCode}">\n${sourcePayloads.join("\n\n")}\n</approved_project_sources>`

  return {
    formattedContext,
    sources: matchedSources.map(s => ({ sourceId: s.sourceId, title: s.title, section: s.section })),
  }
}
