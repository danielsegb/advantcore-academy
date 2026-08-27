"use client"

import React, { useState } from "react"
import {
  UserPlus, CheckCircle2, Mail, Copy, Check, Loader2, Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import type { AccountStatus } from "@/lib/supabase/types"

interface ManagedUser {
  id: string
  fullName: string
  email: string
  pathway: string
  status: AccountStatus
  passwordHash?: string
  mustChangePassword?: boolean
}

const STORAGE_KEY_REGISTERED_USERS = "advantcore_registered_learners"

export function UserManagementTab() {
  const [users, setUsers] = useState<ManagedUser[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS)
        if (stored) {
          return JSON.parse(stored)
        }
      } catch {
        return []
      }
    }
    return []
  })

  const [inviteOpen, setInviteOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("Advantcore2026!")
  const [loading, setLoading] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; pass: string } | null>(null)
  const [copied, setCopied] = useState(false)

  // Sync users to storage whenever updated
  function persistUsers(updatedList: ManagedUser[]) {
    setUsers(updatedList)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(updatedList))
      } catch {
        // ignore
      }
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const newLearner: ManagedUser = {
      id: `usr-${Date.now()}`,
      fullName,
      email: email.trim().toLowerCase(),
      pathway: "Business Analysis",
      status: "active",
      passwordHash: password,
      mustChangePassword: false,
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "invite",
          fullName,
          email: newLearner.email,
          temporaryPassword: password,
        }),
      })
    } catch {
      // Local fallback
    } finally {
      const updated = [...users, newLearner]
      persistUsers(updated)
      setCreatedCredentials({ email: newLearner.email, pass: password })
      setLoading(false)
    }
  }

  function handleStatusChange(userId: string, newStatus: AccountStatus) {
    const updated = users.map(u => (u.id === userId ? { ...u, status: newStatus } : u))
    persistUsers(updated)
  }

  function handleDeleteUser(userId: string) {
    const updated = users.filter(u => u.id !== userId)
    persistUsers(updated)
  }

  function copyCredentials() {
    if (!createdCredentials) return
    navigator.clipboard.writeText(`Advantcore Academy Login:\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.pass}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Learner accounts & onboarding</h2>
          <p className="text-sm text-muted-foreground">
            Onboard new candidates, assign career pathways, or manage learner access status.
          </p>
        </div>

        <Dialog open={inviteOpen} onOpenChange={open => {
          setInviteOpen(open)
          if (!open) {
            setCreatedCredentials(null)
            setFullName("")
            setEmail("")
            setPassword("Advantcore2026!")
          }
        }}>
          <DialogTrigger asChild>
            <Button className="primary-action">
              <UserPlus className="w-4 h-4 mr-1.5" /> Onboard learner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            {!createdCredentials ? (
              <form onSubmit={handleInvite} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Onboard a new learner</DialogTitle>
                  <DialogDescription>
                    Create a candidate account and set their account password.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Full name
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                      placeholder="e.g. Lewis Grant"
                    />
                  </label>

                  <label className="block text-sm font-medium">
                    Email address
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                      placeholder="e.g. lewis@example.com"
                    />
                  </label>

                  <label className="block text-sm font-medium">
                    Password
                    <input
                      type="text"
                      required
                      minLength={5}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background font-mono text-sm"
                    />
                  </label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="primary-action" disabled={loading || !fullName || !email}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                    Create & activate
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-500 text-sm">Learner account onboarded</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Share these credentials with the candidate. They can immediately log in to their Academy workspace.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg font-mono text-xs space-y-1">
                  <div><strong>Email:</strong> {createdCredentials.email}</div>
                  <div><strong>Password:</strong> {createdCredentials.pass}</div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={copyCredentials}>
                    {copied ? <Check className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied" : "Copy credentials"}
                  </Button>
                  <Button className="primary-action w-full" onClick={() => setInviteOpen(false)}>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {users.length === 0 ? (
        <div className="p-12 text-center border rounded-2xl bg-card border-dashed space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold">No learners onboarded yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              You are signed in as Administrator. Click &ldquo;Onboard learner&rdquo; above to register candidate accounts.
            </p>
          </div>
        </div>
      ) : (
        <section className="admin-table">
          <div className="table-head">
            <span>Learner</span>
            <span>Assigned Pathway</span>
            <span>Account Status</span>
            <span>Management Actions</span>
          </div>
          {users.map(u => (
            <div className="table-row" key={u.id}>
              <span>
                <span className="avatar small blue">
                  {u.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <strong>{u.fullName}</strong>
                  <small className="block text-xs text-muted-foreground">{u.email}</small>
                </div>
              </span>
              <span>{u.pathway}</span>
              <span>
                <Badge
                  variant={u.status === "active" ? "default" : u.status === "pending" ? "outline" : "destructive"}
                >
                  {u.status}
                </Badge>
              </span>
              <div className="flex items-center gap-2">
                {u.status === "active" && (
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(u.id, "suspended")}>
                    Suspend
                  </Button>
                )}
                {u.status === "suspended" && (
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(u.id, "active")}>
                    Reactivate
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="text-rose-600 hover:text-rose-700" onClick={() => handleDeleteUser(u.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
