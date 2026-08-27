"use client"

import React, { useState } from "react"
import {
  GraduationCap, BriefcaseBusiness, UserCheck, ShieldCheck,
  Plus, Users, CircleDot, ChevronRight, Sparkles, WandSparkles,
  ArrowRight, UploadCloud, Check, Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionTitle } from "@/components/shared/section-title"
import { StatCard } from "@/components/shared/stat-card"
import { UserManagementTab } from "./user-management-tab"

export function AdminStudioView() {
  const [step, setStep] = useState("pathway")
  const [ai, setAi] = useState(true)

  const builderSteps = [
    ["pathway", "1", "Career pathway"],
    ["certification", "2", "Certification"],
    ["project", "3", "Work experience"],
    ["people", "4", "AI colleagues"],
    ["review", "5", "Review & publish"],
  ] as const

  const integrations = [
    ["Browser speech", "Read AI responses aloud", "Free · Built in", "ready"],
    ["Screen capture", "Presentation and recording", "Free · Built in", "ready"],
    ["Google Calendar", "Event links and future full sync", "Free quota · OAuth for sync", "setup"],
    ["Supabase", "Auth, database and file storage", "Free tier · Production option", "setup"],
  ] as const

  return (
    <div className="page-stack">
      <SectionTitle
        eyebrow="Admin studio"
        title="Build and govern career experiences"
        copy="Create pathways, companies, projects, AI colleagues and approved knowledge sources without hard-coding the platform."
        actions={
          <>
            <Button variant="outline">
              <Users /> Manage users
            </Button>
            <Button className="primary-action">
              <Plus /> New pathway
            </Button>
          </>
        }
      />

      <section className="admin-stat-grid">
        <StatCard icon={GraduationCap} value="1" label="Live pathway" detail="Business Analysis" tone="mint" />
        <StatCard icon={BriefcaseBusiness} value="1" label="Active project" detail="Advantcore Ltd" tone="navy" />
        <StatCard icon={UserCheck} value="4" label="AI colleagues" detail="All approved" tone="gold" />
        <StatCard icon={ShieldCheck} value="2" label="Pending users" detail="Awaiting approval" tone="coral" />
      </section>

      <Tabs defaultValue="builder" className="admin-tabs">
        <TabsList>
          <TabsTrigger value="builder">Guided builder</TabsTrigger>
          <TabsTrigger value="content">Knowledge & resources</TabsTrigger>
          <TabsTrigger value="users">Users & approvals</TabsTrigger>
          <TabsTrigger value="integrations">Free integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <section className="admin-builder">
            <aside className="builder-steps">
              {builderSteps.map(s => (
                <button
                  key={s[0]}
                  className={step === s[0] ? "active" : ""}
                  onClick={() => setStep(s[0])}
                >
                  <span>{step === s[0] ? <CircleDot /> : s[1]}</span>
                  <strong>{s[2]}</strong>
                  <ChevronRight />
                </button>
              ))}
              <div className="builder-help">
                <Sparkles />
                <strong>AI-assisted, admin-approved</strong>
                <p>Academy proposes a structure and flags uncertainty. Nothing goes live without approval.</p>
              </div>
            </aside>

            <article className="builder-form">
              <div className="form-heading">
                <div>
                  <p className="eyebrow">Step 1 of 5</p>
                  <h2>Define the career pathway</h2>
                  <p>Set the outcome and pace. You can refine every recommendation before publishing.</p>
                </div>
                <div className="ai-switch">
                  <span><Sparkles /> AI recommendations</span>
                  <Switch checked={ai} onCheckedChange={setAi} />
                </div>
              </div>

              <div className="form-grid">
                <label>
                  <span>Pathway name</span>
                  <input defaultValue="Business Analyst Career Accelerator" />
                </label>
                <label>
                  <span>Career family</span>
                  <select defaultValue="business">
                    <option value="business">Business analysis & change</option>
                    <option>Project management</option>
                    <option>Cyber security</option>
                    <option>Data analysis</option>
                  </select>
                </label>
                <label className="full">
                  <span>Target outcome</span>
                  <textarea defaultValue="Become certification-ready and job-ready through structured learning, assessed project work, an evidence portfolio and interview preparation." />
                </label>
                <label>
                  <span>Default duration</span>
                  <select>
                    <option>12 weeks</option>
                    <option>8 weeks</option>
                    <option>16 weeks</option>
                  </select>
                </label>
                <label>
                  <span>Minimum mastery threshold</span>
                  <div className="suffix-input">
                    <input type="number" defaultValue="90" />
                    <span>%</span>
                  </div>
                </label>
              </div>

              {ai && (
                <div className="recommendation-box">
                  <WandSparkles />
                  <div>
                    <strong>Suggested structure</strong>
                    <p>6 learning modules · 5 project stages · 4 stakeholder roles · 2 full mock exams · 1 assessed portfolio</p>
                    <span>Based on the target outcome and current BA pathway.</span>
                  </div>
                  <div>
                    <Button size="sm" className="primary-action">
                      Apply
                    </Button>
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                  </div>
                </div>
              )}

              <div className="builder-footer">
                <span>Draft saved automatically</span>
                <Button className="primary-action" onClick={() => setStep("certification")}>
                  Save & continue <ArrowRight />
                </Button>
              </div>
            </article>
          </section>
        </TabsContent>

        <TabsContent value="content">
          <section className="empty-admin">
            <UploadCloud />
            <h2>Build the approved knowledge base</h2>
            <p>Upload syllabuses, textbooks, mock papers, company policies and project resources. Each source can be replaced, versioned or removed.</p>
            <Button className="primary-action">
              <UploadCloud /> Add resources
            </Button>
          </section>
        </TabsContent>

        <TabsContent value="users">
          <UserManagementTab />
        </TabsContent>

        <TabsContent value="integrations">
          <section className="integration-grid">
            {integrations.map(r => (
              <article className="integration-card" key={r[0]}>
                <span className="integration-icon">
                  {r[3] === "ready" ? <Check /> : <Settings />}
                </span>
                <div>
                  <strong>{r[0]}</strong>
                  <p>{r[1]}</p>
                  <small>{r[2]}</small>
                </div>
                <Button size="sm" variant="outline">
                  {r[3] === "ready" ? "Ready" : "Configure"}
                </Button>
              </article>
            ))}
          </section>
        </TabsContent>
      </Tabs>
    </div>
  )
}
