"use client"

import React, { useState } from "react"
import {
  GraduationCap, BriefcaseBusiness, UserCheck, ShieldCheck,
  Plus, Users, Check, Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionTitle } from "@/components/shared/section-title"
import { StatCard } from "@/components/shared/stat-card"
import { UserManagementTab } from "./user-management-tab"
import { GuidedBuilder } from "./guided-builder"
import { KnowledgeSourcesTab } from "./knowledge-sources-tab"

export function AdminStudioView() {
  const [activeTab, setActiveTab] = useState("builder")

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
            <Button variant="outline" onClick={() => setActiveTab("users")}>
              <Users /> Manage users
            </Button>
            <Button className="primary-action" onClick={() => setActiveTab("builder")}>
              <Plus /> New pathway
            </Button>
          </>
        }
      />

      <section className="admin-stat-grid">
        <StatCard icon={GraduationCap} value="1" label="Live pathway" detail="Business Analysis" tone="mint" />
        <StatCard icon={BriefcaseBusiness} value="1" label="Active project" detail="Advantcore Ltd" tone="navy" />
        <StatCard icon={UserCheck} value="4" label="AI colleagues" detail="All approved" tone="gold" />
        <StatCard icon={ShieldCheck} value="3" label="Managed users" detail="1 pending, 1 active, 1 suspended" tone="coral" />
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="admin-tabs">
        <TabsList>
          <TabsTrigger value="builder">Guided builder</TabsTrigger>
          <TabsTrigger value="content">Knowledge & resources</TabsTrigger>
          <TabsTrigger value="users">Users & approvals</TabsTrigger>
          <TabsTrigger value="integrations">Free integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <GuidedBuilder />
        </TabsContent>

        <TabsContent value="content">
          <KnowledgeSourcesTab />
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
