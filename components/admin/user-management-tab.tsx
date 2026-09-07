"use client"

import React, { useState } from "react"
import {
  UserPlus, CheckCircle2, Mail, Copy, Check, Loader2, Users, Trash2, RotateCcw,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import type { AccountStatus } from "@/lib/supabase/types"
import { resetLearnerStorage } from "@/lib/progress/progress-sync"

export interface ManagedUser {
  id: string
  fullName: string
  email: string
  pathway: string
  status: AccountStatus
  role?: string
  passwordHash?: string
  mustChangePassword?: boolean
}

export const STORAGE_KEY_REGISTERED_USERS = "advantcore_registered_learners"

export interface UserManagementTabProps {
  users?: ManagedUser[]
  onUsersChange?: (users: ManagedUser[]) => void
}

export function UserManagementTab({ users: propUsers, onUsersChange }: UserManagementTabProps) {
  const [localUsers, setLocalUsers] = useState<ManagedUser[]>(() => {
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

  const users = propUsers ?? localUsers
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [adminResetSuccess, setAdminResetSuccess] = useState(false)

  const [inviteOpen, setInviteOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("Advantcore2026!")
  const [loading, setLoading] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; pass: string } | null>(null)
  const [copied, setCopied] = useState(false)

  // Sync users to storage whenever updated
  function persistUsers(updatedList: ManagedUser[]) {
    setLocalUsers(updatedList)
    onUsersChange?.(updatedList)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(updatedList))
      } catch {
        // ignore
      }
    }
  }

  // Fetch real users from Supabase API on mount
  React.useEffect(() => {
    async function loadServerUsers() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/admin/users`)
        if (res.ok) {
          const data = await res.json()
          if (data.success && Array.isArray(data.users)) {
            const serverUsers: ManagedUser[] = data.users
            const map = new Map<string, ManagedUser>()
            for (const u of serverUsers) {
              map.set(u.email.toLowerCase(), u)
            }
            // Merge with local users (preserve passwordHash if available for local-mode login)
            const currentList = propUsers ?? localUsers
            for (const u of currentList) {
              const existing = map.get(u.email.toLowerCase())
              if (existing) {
                map.set(u.email.toLowerCase(), {
                  ...existing,
                  passwordHash: u.passwordHash || existing.passwordHash,
                })
              } else {
                map.set(u.email.toLowerCase(), u)
              }
            }
            const merged = Array.from(map.values())
            persistUsers(merged)
          }
        }
      } catch {
        // Local fallback
      } finally {
        setLoadingUsers(false)
      }
    }
    loadServerUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          temporaryPassword: password,
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
      setCreatedCredentials({ email: newLearner.email, pass: password })
      setLoading(false)
    }
  }

  const [resetSuccessId, setResetSuccessId] = useState<string | null>(null)

  function handleStatusChange(userId: string, newStatus: AccountStatus) {
    const updated = users.map(u => (u.id === userId ? { ...u, status: newStatus } : u))
    persistUsers(updated)
  }

  async function handleDeleteUser(userId: string) {
    const userToDelete = users.find(u => u.id === userId)
    resetLearnerStorage(userId, userToDelete?.email)
    const updated = users.filter(u => u.id !== userId)
    persistUsers(updated)

    try {
      const params = new URLSearchParams()
      if (userId) params.set("userId", userId)
      if (userToDelete?.email) params.set("email", userToDelete.email)
      await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/admin/users?${params.toString()}`, {
        method: "DELETE",
      })
    } catch {
      // Local deleted
    }
  }

  async function handleResetProgress(userToReset: ManagedUser) {
    resetLearnerStorage(userToReset.id, userToReset.email)
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/learning/progress?userId=${encodeURIComponent(userToReset.id)}&email=${encodeURIComponent(userToReset.email)}`,
        { method: "DELETE" }
      )
    } catch {
      // ignore
    }
    setResetSuccessId(userToReset.id)
    setTimeout(() => setResetSuccessId(null), 2500)
  }

  async function handleResetAdminProgress() {
    resetLearnerStorage("00000000-0000-0000-0000-000000000011", "admin@advantcore.co")
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/learning/progress?userId=00000000-0000-0000-0000-000000000011&email=admin@advantcore.co`,
        { method: "DELETE" }
      )
    } catch {
      // ignore
    }
    setAdminResetSuccess(true)
    setTimeout(() => setAdminResetSuccess(false), 2500)
  }

  function copyCredentials() {
    if (!createdCredentials) return
    navigator.clipboard.writeText(`Email: ${createdCredentials.email}\nPassword: ${createdCredentials.pass}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function resetDialog() {
    setCreatedCredentials(null)
    setFullName("")
    setEmail("")
    setPassword("Advantcore2026!")
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
                Provision immediate access to the BCS Business Analysis Pathway and send a welcome email with credentials.
              </DialogDescription>
            </DialogHeader>

            {!createdCredentials ? (
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

                  <label className="block text-sm font-medium">
                    Temporary Password (min 8 characters)
                    <input
                      type="text"
                      required
                      minLength={8}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background font-mono text-base sm:text-sm"
                    />
                  </label>

                  <div className="p-3 rounded-lg bg-muted/60 border text-xs text-muted-foreground flex items-start gap-2">
                    <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      A welcome email with login credentials and pathway access will be dispatched to the candidate.
                    </span>
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setInviteOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="primary-action w-full sm:w-auto" disabled={loading || !fullName || !email}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                    Create & Email Credentials
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-500 text-sm">Learner Onboarded & Email Sent</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Account provisioned for <strong>{createdCredentials.email}</strong> and welcome email dispatched.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg font-mono text-xs space-y-1">
                  <div><strong>Email:</strong> {createdCredentials.email}</div>
                  <div><strong>Temporary Password:</strong> {createdCredentials.pass}</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
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

      {/* Platform Administrator Governance Card */}
      <div className="bg-card p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/20 shrink-0">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <strong className="text-xs sm:text-sm font-semibold">Platform Administrator</strong>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-blue-600 border-blue-500/30">System Admin</Badge>
            </div>
            <small className="text-xs text-muted-foreground">admin@advantcore.co · System Governance</small>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0"
          onClick={handleResetAdminProgress}
          title="Reset administrator account progress to 0%"
        >
          <RotateCcw className={`w-3.5 h-3.5 mr-1 ${adminResetSuccess ? "text-emerald-500 animate-spin" : ""}`} />
          {adminResetSuccess ? "Admin Reset!" : "Reset Admin Progress (0%)"}
        </Button>
      </div>

      {loadingUsers ? (
        <div className="p-8 sm:p-12 text-center border rounded-2xl bg-card border-dashed space-y-3">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Loading onboarded learners...</p>
        </div>
      ) : users.length === 0 ? (
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
              <div className="flex items-center gap-1.5 pt-1 sm:pt-0 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs px-2 text-muted-foreground hover:text-foreground"
                  title="Reset learner progress, completed lessons, and evidence back to 0%"
                  onClick={() => handleResetProgress(u)}
                >
                  <RotateCcw className={`w-3.5 h-3.5 mr-1 ${resetSuccessId === u.id ? "text-emerald-500 animate-spin" : ""}`} />
                  {resetSuccessId === u.id ? "Reset!" : "Reset"}
                </Button>
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
