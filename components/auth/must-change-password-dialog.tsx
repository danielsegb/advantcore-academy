"use client"

import React, { useState } from "react"
import { KeyRound, ShieldAlert, Check, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth/auth-context"

export function MustChangePasswordDialog() {
  const { user, changePassword } = useAuth()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!user || !user.mustChangePassword) {
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    const result = await changePassword(newPassword)
    setLoading(false)

    if (!result.success) {
      setError(result.error || "Failed to update password.")
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-md" onPointerDownOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-500 w-fit mb-1">
              <KeyRound className="w-5 h-5" />
            </div>
            <DialogTitle>Update your temporary password</DialogTitle>
            <DialogDescription>
              Welcome to Advantcore Academy. Before accessing your learning pathway and projects, choose a secure personal password.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 text-sm rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium">
              New password
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                placeholder="Minimum 8 characters"
              />
            </label>

            <label className="block text-sm font-medium">
              Confirm new password
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                placeholder="Re-enter password"
              />
            </label>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-1">
              <Check className={`w-3.5 h-3.5 ${newPassword.length >= 8 ? "text-emerald-500" : ""}`} /> At least 8 characters
            </p>
            <p className="flex items-center gap-1">
              <Check className={`w-3.5 h-3.5 ${newPassword && newPassword === confirmPassword ? "text-emerald-500" : ""}`} /> Passwords match
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full primary-action" disabled={loading || newPassword.length < 8}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating password...
                </>
              ) : (
                <>
                  Activate account <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
