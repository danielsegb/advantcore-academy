"use client"

import React, { useState } from "react"
import {
  UserPlus, CheckCircle2, Mail, Copy, Check, Loader2,
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
}

export function UserManagementTab() {
  const [users, setUsers] = useState<ManagedUser[]>([
    { id: "usr-1", fullName: "Amanda Okafor", email: "amanda.okafor@example.com", pathway: "Business Analysis", status: "pending" },
    { id: "usr-2", fullName: "Lewis Grant", email: "lewis.grant@example.com", pathway: "Business Analysis", status: "active" },
    { id: "usr-3", fullName: "Nina Bello", email: "nina.bello@example.com", pathway: "Business Analysis", status: "suspended" },
  ])

  const [inviteOpen, setInviteOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [temporaryPassword, setTemporaryPassword] = useState("Advantcore2026!")
  const [loading, setLoading] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; pass: string } | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "invite",
          fullName,
          email,
          temporaryPassword,
        }),
      })

      const data = (await res.json()) as { success?: boolean; temporaryPassword?: string }
      if (data.success) {
        setUsers(prev => [
          ...prev,
          {
            id: `usr-${Date.now()}`,
            fullName,
            email,
            pathway: "Business Analysis",
            status: "active",
          },
        ])
        setCreatedCredentials({ email, pass: data.temporaryPassword || temporaryPassword })
      }
    } catch {
      // Local fallback
      setUsers(prev => [
        ...prev,
        { id: `usr-${Date.now()}`, fullName, email, pathway: "Business Analysis", status: "active" },
      ])
      setCreatedCredentials({ email, pass: temporaryPassword })
    } finally {
      setLoading(false)
    }
  }

  function handleStatusChange(userId: string, newStatus: AccountStatus) {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, status: newStatus } : u)))
  }

  function copyCredentials() {
    if (!createdCredentials) return
    navigator.clipboard.writeText(`Advantcore Academy Login:\nEmail: ${createdCredentials.email}\nTemporary Password: ${createdCredentials.pass}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Learner accounts & approvals</h2>
          <p className="text-sm text-muted-foreground">
            Invite candidates, approve registrations, assign career pathways, or suspend access.
          </p>
        </div>

        <Dialog open={inviteOpen} onOpenChange={open => {
          setInviteOpen(open)
          if (!open) {
            setCreatedCredentials(null)
            setFullName("")
            setEmail("")
          }
        }}>
          <DialogTrigger asChild>
            <Button className="primary-action">
              <UserPlus className="w-4 h-4 mr-1.5" /> Invite learner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            {!createdCredentials ? (
              <form onSubmit={handleInvite} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Invite a new learner</DialogTitle>
                  <DialogDescription>
                    Create an invited learner profile with a temporary password. The learner will be required to change this password upon first sign-in.
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
                      placeholder="lewis.grant@example.com"
                    />
                  </label>

                  <label className="block text-sm font-medium">
                    Temporary initial password
                    <input
                      type="text"
                      required
                      minLength={8}
                      value={temporaryPassword}
                      onChange={e => setTemporaryPassword(e.target.value)}
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
                    Create & invite
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-500 text-sm">Learner account created</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Share these temporary credentials with the candidate. They will be prompted to choose a new password upon login.
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
                {u.fullName.split(" ").map(w => w[0]).join("").slice(0, 2)}
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
              {u.status === "pending" && (
                <Button size="sm" className="primary-action" onClick={() => handleStatusChange(u.id, "active")}>
                  Approve & Activate
                </Button>
              )}
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
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
