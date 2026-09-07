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
import { UserManagementTab, type ManagedUser, STORAGE_KEY_REGISTERED_USERS } from "./user-management-tab"
import { GuidedBuilder } from "./guided-builder"
import { KnowledgeSourcesTab } from "./knowledge-sources-tab"

export function AdminStudioView() {
  const [activeTab, setActiveTab] = useState("builder")
  const [users, setUsers] = useState<ManagedUser[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS)
        if (stored) return JSON.parse(stored)
      } catch {}
    }
    return []
  })

  // Sync users from server
  React.useEffect(() => {
    async function loadServerUsers() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/admin/users`)
        if (res.ok) {
          const data = await res.json()
          if (data.success && Array.isArray(data.users)) {
            setUsers(prev => {
              const map = new Map<string, ManagedUser>()
              for (const u of data.users) map.set(u.email.toLowerCase(), u)
              for (const u of prev) {
                const existing = map.get(u.email.toLowerCase())
                if (existing) {
                  map.set(u.email.toLowerCase(), { ...existing, passwordHash: u.passwordHash || existing.passwordHash })
                } else {
                  map.set(u.email.toLowerCase(), u)
                }
              }
              return Array.from(map.values())
            })
          }
        }
      } catch {}
    }
    loadServerUsers()
  }, [])

  const activeCount = users.filter(u => u.status === "active").length
  const pendingCount = users.filter(u => u.status === "pending").length
  const suspendedCount = users.filter(u => u.status === "suspended").length
  const userDetail = users.length > 0
    ? `${activeCount} active, ${pendingCount} pending${suspendedCount > 0 ? `, ${suspendedCount} suspended` : ""}`
    : "No learners onboarded yet"

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
        copy="Create pathways, companies, projects, stakeholder roles and approved knowledge sources without hard-coding the platform."
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
        <StatCard icon={UserCheck} value="4" label="Project roles" detail="All approved" tone="gold" />
        <StatCard icon={ShieldCheck} value={users.length.toString()} label="Managed users" detail={userDetail} tone="coral" />
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
          <UserManagementTab users={users} onUsersChange={setUsers} />
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
