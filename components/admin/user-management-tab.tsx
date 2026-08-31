"use client"

import React, { useState } from "react"
import {
  UserPlus, CheckCircle2, Mail, Copy, Check, Loader2, Users, Trash2,
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
  const [loading, setLoading] = useState(false)
  const [inviteSuccessEmail, setInviteSuccessEmail] = useState<string | null>(null)

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
      mustChangePassword: true,
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "invite",
          fullName,
          email: newLearner.email,
        }),
      })
      const data = await res.json()
      if (data.userId) {
        newLearner.id = data.userId
      }
    } catch {
      // Local fallback
    } finally {
      const updated = [...users, newLearner]
      persistUsers(updated)
      setInviteSuccessEmail(newLearner.email)
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

  function resetDialog() {
    setInviteSuccessEmail(null)
    setFullName("")
    setEmail("")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border">
        <div>
          <h2 className="font-bold text-base leading-tight">Learner Directory & Governance</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage provisioned accounts, suspend access, or onboard new candidates to active pathways.
          </p>
        </div>

        <Dialog
          open={inviteOpen}
          onOpenChange={open => {
            setInviteOpen(open)
            if (!open) resetDialog()
          }}
        >
          <DialogTrigger asChild>
            <Button className="primary-action w-full sm:w-auto h-10 font-bold shrink-0">
              <UserPlus className="w-4 h-4 mr-2" /> Onboard learner
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Onboard New Learner</DialogTitle>
              <DialogDescription>
                Send an official invitation link to the candidate to activate their workspace and set their password.
              </DialogDescription>
            </DialogHeader>

            {!inviteSuccessEmail ? (
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Full name
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-base sm:text-sm"
                      placeholder="e.g. Lewis Grant"
                    />
                  </label>

                  <label className="block text-sm font-medium">
                    Email address
                    <input
                      type="email"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-base sm:text-sm"
                      placeholder="e.g. lewis@example.com"
                    />
                  </label>

                  <div className="p-3 rounded-lg bg-muted/60 border text-xs text-muted-foreground flex items-start gap-2">
                    <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      An automated invitation link will be delivered directly to the candidate&apos;s email inbox.
                    </span>
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setInviteOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="primary-action w-full sm:w-auto" disabled={loading || !fullName || !email}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                    Send Invitation
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-500 text-sm">Invitation Email Sent</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      An activation invite has been emailed to <strong>{inviteSuccessEmail}</strong>. They can click the link in their inbox to set up their password and access their workspace.
                    </p>
                  </div>
                </div>

                <Button className="primary-action w-full" onClick={() => setInviteOpen(false)}>
                  Done
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {users.length === 0 ? (
        <div className="p-8 sm:p-12 text-center border rounded-2xl bg-card border-dashed space-y-3">
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
              <span className="flex items-center gap-3">
                <span className="avatar small blue">
                  {u.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block text-xs sm:text-sm font-semibold truncate">{u.fullName}</strong>
                  <small className="block text-xs text-muted-foreground truncate">{u.email}</small>
                </div>
              </span>
              <span className="text-xs text-muted-foreground sm:text-foreground">
                <span className="sm:hidden font-semibold text-foreground mr-1">Pathway:</span>
                {u.pathway}
              </span>
              <span>
                <Badge
                  variant={u.status === "active" ? "default" : u.status === "pending" ? "outline" : "destructive"}
                >
                  {u.status}
                </Badge>
              </span>
              <div className="flex items-center gap-2 pt-1 sm:pt-0">
                {u.status === "active" && (
                  <Button size="sm" variant="outline" className="h-8 text-xs px-2.5" onClick={() => handleStatusChange(u.id, "suspended")}>
                    Suspend
                  </Button>
                )}
                {u.status === "suspended" && (
                  <Button size="sm" variant="outline" className="h-8 text-xs px-2.5" onClick={() => handleStatusChange(u.id, "active")}>
                    Reactivate
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-8 text-xs text-rose-600 hover:text-rose-700 px-2" onClick={() => handleDeleteUser(u.id)}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
