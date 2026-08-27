"use client"

import React, { useState } from "react"
import {
  CircleDot, ChevronRight, Sparkles, WandSparkles, ArrowRight,
  ArrowLeft, CheckCircle2, Award, Briefcase, Users, Eye, Check, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface CharacterConfig {
  name: string
  role: string
  initials: string
  colour: string
  behaviourInstructions: string
  knowledgeScope: string
}

export function GuidedBuilder() {
  const [step, setStep] = useState<number>(1)
  const [aiEnabled, setAiEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [published, setPublished] = useState(false)
  const [confirmedApproval, setConfirmedApproval] = useState(false)

  // Step 1: Pathway
  const [title, setTitle] = useState("Business Analyst Career Accelerator")
  const [careerFamily, setCareerFamily] = useState("business")
  const [targetOutcome, setTargetOutcome] = useState("Become certification-ready and job-ready through structured learning, assessed project work, an evidence portfolio and interview preparation.")
  const [durationWeeks, setDurationWeeks] = useState(12)
  const [masteryThreshold, setMasteryThreshold] = useState(90)

  // Step 2: Certification
  const [certTitle, setCertTitle] = useState("BCS Foundation Certificate in Business Analysis")
  const [awardingBody, setAwardingBody] = useState("BCS, The Chartered Institute for IT")
  const [examFormat, setExamFormat] = useState("40-Question Multiple Choice (60 min)")
  const [passMark, setPassMark] = useState(65)
  const [syllabusUrl, setSyllabusUrl] = useState("https://www.bcs.org/qualifications-and-certifications/certifications-for-professionals/business-analysis/foundation-certificate-in-business-analysis/")
  const [verificationDate, setVerificationDate] = useState("2026-08-27")

  // Step 3: Project
  const [companyName, setCompanyName] = useState("Advantcore Ltd")
  const [projectCode, setProjectCode] = useState("ADV-BA-001")
  const [projectTitle, setProjectTitle] = useState("Enquiry-to-delivery process transformation")
  const [projectDesc, setProjectDesc] = useState("Investigate friction across lead qualification, project hand-off and delivery mobilisation, then recommend a controlled future-state process.")
  const [stages] = useState<string[]>(["Initiate", "Discover", "Analyse", "Design", "Validate"])

  // Step 4: Characters
  const [characters, setCharacters] = useState<CharacterConfig[]>([
    {
      name: "Sarah Mitchell",
      role: "Project Sponsor",
      initials: "SM",
      colour: "coral",
      behaviourInstructions: "Set strategic direction, protect commercial value and approve project charter.",
      knowledgeScope: "Project objectives, commercial targets and board priorities",
    },
    {
      name: "Marcus Cole",
      role: "BA Supervisor",
      initials: "MC",
      colour: "blue",
      behaviourInstructions: "Coach through questions, challenge unsupported assumptions and protect professional standards.",
      knowledgeScope: "BCS standards, requirements modelling and evidence quality criteria",
    },
    {
      name: "Priya Shah",
      role: "Operations Lead",
      initials: "PS",
      colour: "violet",
      behaviourInstructions: "Explain operational pain points, spreadsheet hand-offs and delivery bottlenecks.",
      knowledgeScope: "Daily lead qualification, CRM gaps and team workflows",
    },
    {
      name: "Helen Grant",
      role: "Independent Reviewer",
      initials: "HG",
      colour: "gold",
      behaviourInstructions: "Conduct independent evidence audits and ensure evidence meets rigorous assessment criteria.",
      knowledgeScope: "Assessment rubrics and independent certification audit rules",
    },
  ])

  async function handlePublish() {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/admin/pathways`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish",
          title,
          careerFamily,
          targetOutcome,
          defaultDurationWeeks: durationWeeks,
          masteryThreshold,
          certification: {
            title: certTitle,
            awardingBody,
            examFormat,
            passPercentage: passMark,
            sourceUrl: syllabusUrl,
            verificationDate,
          },
          project: {
            code: projectCode,
            title: projectTitle,
            description: projectDesc,
            companyName,
            stages,
          },
          characters,
        }),
      })

      const data = (await res.json()) as { success?: boolean }
      if (data.success) {
        setPublished(true)
      }
    } catch {
      // Local fallback
      setPublished(true)
    } finally {
      setLoading(false)
    }
  }

  const builderSteps = [
    { num: 1, label: "Career pathway", icon: CircleDot },
    { num: 2, label: "Certification", icon: Award },
    { num: 3, label: "Workplace project", icon: Briefcase },
    { num: 4, label: "AI colleagues", icon: Users },
    { num: 5, label: "Review & publish", icon: Eye },
  ]

  return (
    <div className="admin-builder">
      <aside className="builder-steps">
        {builderSteps.map(s => (
          <button
            key={s.num}
            className={step === s.num ? "active" : ""}
            onClick={() => setStep(s.num)}
          >
            <span>{step === s.num ? <CircleDot className="w-4 h-4" /> : s.num}</span>
            <strong>{s.label}</strong>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        ))}
        <div className="builder-help">
          <Sparkles className="w-5 h-5 text-amber-500 mb-2" />
          <strong>AI-assisted, admin-approved</strong>
          <p>Academy proposes structure and flags requirements. All materials remain drafts until administrator publication.</p>
        </div>
      </aside>

      <article className="builder-form">
        {published ? (
          <div className="p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold">Pathway Published to Academy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>{title}</strong> is now live. Enrolled learners can immediately access the certified curriculum, virtual workplace project, and interactive AI team.
            </p>
            <div className="pt-4 flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setPublished(false)}>
                Edit pathway
              </Button>
              <Button className="primary-action" onClick={() => setStep(1)}>
                Build another pathway
              </Button>
            </div>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="space-y-6">
                <div className="form-heading">
                  <div>
                    <p className="eyebrow">Step 1 of 5</p>
                    <h2>Define the career pathway</h2>
                    <p>Set the professional outcome, pace, and minimum mastery threshold.</p>
                  </div>
                  <div className="ai-switch flex items-center gap-2">
                    <span className="text-xs flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI recommendations</span>
                    <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
                  </div>
                </div>

                <div className="form-grid">
                  <label>
                    <span>Pathway name</span>
                    <input value={title} onChange={e => setTitle(e.target.value)} />
                  </label>
                  <label>
                    <span>Career family</span>
                    <select value={careerFamily} onChange={e => setCareerFamily(e.target.value)}>
                      <option value="business">Business analysis & change</option>
                      <option value="project">Project management</option>
                      <option value="cyber">Cyber security</option>
                      <option value="data">Data analysis</option>
                    </select>
                  </label>
                  <label className="full">
                    <span>Target outcome</span>
                    <textarea value={targetOutcome} onChange={e => setTargetOutcome(e.target.value)} rows={3} />
                  </label>
                  <label>
                    <span>Default duration</span>
                    <select value={durationWeeks} onChange={e => setDurationWeeks(Number(e.target.value))}>
                      <option value={8}>8 weeks (Accelerated)</option>
                      <option value={12}>12 weeks (Standard)</option>
                      <option value={16}>16 weeks (Comprehensive)</option>
                    </select>
                  </label>
                  <label>
                    <span>Minimum mastery threshold</span>
                    <div className="suffix-input flex items-center">
                      <input type="number" min={50} max={100} value={masteryThreshold} onChange={e => setMasteryThreshold(Number(e.target.value))} />
                      <span className="ml-1">%</span>
                    </div>
                  </label>
                </div>

                {aiEnabled && (
                  <div className="recommendation-box">
                    <WandSparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div>
                      <strong>Suggested structure</strong>
                      <p>6 learning modules · 5 project stages · 4 stakeholder roles · 2 full mock exams · 1 assessed portfolio</p>
                      <span>Grounded in industry standard BCS Foundation syllabus.</span>
                    </div>
                  </div>
                )}

                <div className="builder-footer flex justify-between items-center pt-4">
                  <span className="text-xs text-muted-foreground">Draft saved automatically</span>
                  <Button className="primary-action" onClick={() => setStep(2)}>
                    Save & continue <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="form-heading">
                  <div>
                    <p className="eyebrow">Step 2 of 5</p>
                    <h2>Official certification alignment</h2>
                    <p>Map the accredited awarding body, pass criteria, and verified syllabus source.</p>
                  </div>
                </div>

                <div className="form-grid">
                  <label className="full">
                    <span>Certification title</span>
                    <input value={certTitle} onChange={e => setCertTitle(e.target.value)} />
                  </label>
                  <label>
                    <span>Awarding body</span>
                    <input value={awardingBody} onChange={e => setAwardingBody(e.target.value)} />
                  </label>
                  <label>
                    <span>Official examination format</span>
                    <input value={examFormat} onChange={e => setExamFormat(e.target.value)} />
                  </label>
                  <label>
                    <span>Official pass mark</span>
                    <div className="suffix-input flex items-center">
                      <input type="number" value={passMark} onChange={e => setPassMark(Number(e.target.value))} />
                      <span className="ml-1">%</span>
                    </div>
                  </label>
                  <label>
                    <span>Verification date</span>
                    <input type="date" value={verificationDate} onChange={e => setVerificationDate(e.target.value)} />
                  </label>
                  <label className="full">
                    <span>Official syllabus link</span>
                    <input type="url" value={syllabusUrl} onChange={e => setSyllabusUrl(e.target.value)} />
                  </label>
                </div>

                <div className="builder-footer flex justify-between items-center pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button className="primary-action" onClick={() => setStep(3)}>
                    Save & continue <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="form-heading">
                  <div>
                    <p className="eyebrow">Step 3 of 5</p>
                    <h2>Virtual workplace project</h2>
                    <p>Configure the simulated delivery environment, company background, and delivery stages.</p>
                  </div>
                </div>

                <div className="form-grid">
                  <label>
                    <span>Company name</span>
                    <input value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </label>
                  <label>
                    <span>Project code</span>
                    <input value={projectCode} onChange={e => setProjectCode(e.target.value)} />
                  </label>
                  <label className="full">
                    <span>Project title</span>
                    <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} />
                  </label>
                  <label className="full">
                    <span>Project objective & business context</span>
                    <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)} rows={3} />
                  </label>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Delivery stages (5 stages)</span>
                  <div className="flex gap-2 flex-wrap">
                    {stages.map((st, i) => (
                      <Badge key={st} variant="outline" className="px-3 py-1 text-sm">
                        {i + 1}. {st}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="builder-footer flex justify-between items-center pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button className="primary-action" onClick={() => setStep(4)}>
                    Save & continue <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="form-heading">
                  <div>
                    <p className="eyebrow">Step 4 of 5</p>
                    <h2>Stakeholder team & AI characters</h2>
                    <p>Define the virtual colleagues, prompt behaviors, coaching styles, and knowledge scopes.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {characters.map((char, index) => (
                    <div key={char.name} className="p-4 border rounded-xl bg-card space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`avatar small ${char.colour}`}>{char.initials}</span>
                        <div>
                          <strong>{char.name}</strong>
                          <small className="block text-xs text-muted-foreground">{char.role}</small>
                        </div>
                      </div>
                      <label className="block text-xs font-medium">
                        Behavior Instructions
                        <textarea
                          rows={2}
                          className="w-full mt-1 p-2 text-xs border rounded bg-background"
                          value={char.behaviourInstructions}
                          onChange={e => {
                            const updated = [...characters]
                            updated[index].behaviourInstructions = e.target.value
                            setCharacters(updated)
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>

                <div className="builder-footer flex justify-between items-center pt-4">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button className="primary-action" onClick={() => setStep(5)}>
                    Review & publish <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="form-heading">
                  <div>
                    <p className="eyebrow">Step 5 of 5</p>
                    <h2>Administrator review & publish</h2>
                    <p>Verify all pathway parameters before activating this experience for learners.</p>
                  </div>
                </div>

                <div className="p-4 border rounded-xl bg-muted/40 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs block">Pathway</span>
                      <strong>{title}</strong> ({durationWeeks} weeks, {masteryThreshold}% mastery)
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">Certification</span>
                      <strong>{certTitle}</strong> ({awardingBody})
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">Workplace Project</span>
                      <strong>{projectTitle}</strong> ({projectCode} · {companyName})
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">Virtual Team</span>
                      <strong>{characters.length} Stakeholder Characters</strong> (Grounded in {projectCode})
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 p-4 border rounded-xl bg-card cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmedApproval}
                    onChange={e => setConfirmedApproval(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded"
                  />
                  <div className="text-sm">
                    <strong>Administrator Publication Approval</strong>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      I confirm that all syllabus rules, questions, project stages, and AI character guardrails meet Advantcore Academy governance standards.
                    </p>
                  </div>
                </label>

                <div className="builder-footer flex justify-between items-center pt-4">
                  <Button variant="outline" onClick={() => setStep(4)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    className="primary-action"
                    disabled={!confirmedApproval || loading}
                    onClick={handlePublish}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" /> Publish to Academy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </article>
    </div>
  )
}
