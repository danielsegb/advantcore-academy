"use client"

import React, { useState } from "react"
import { KeyRound, ShieldAlert, Check, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth/auth-context"

export function AdminChangePasswordDialog() {
  const { user, changePassword } = useAuth()
  const [open, setOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!user || user.role !== "admin") {
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword.length < 5) {
      setError("Password must be at least 5 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    const result = await changePassword(newPassword)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        setNewPassword("")
        setConfirmPassword("")
      }, 1800)
    } else {
      setError(result.error || "Failed to update password.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5 cursor-pointer">
          <KeyRound className="w-3.5 h-3.5 text-[#183f35]" />
          <span>Change password</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="inline-flex p-2.5 rounded-xl bg-[#e3f2eb] text-[#183f35] w-fit mb-1">
              <Lock className="w-5 h-5" />
            </div>
            <DialogTitle>Update Administrator Password</DialogTitle>
            <DialogDescription className="text-xs">
              Change the password for <strong className="text-foreground">admin@advantcore.co</strong>.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 text-xs rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Password updated successfully!</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold" htmlFor="admin-new-pass">
                New Password
              </label>
              <input
                id="admin-new-pass"
                type="password"
                required
                minLength={5}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold" htmlFor="admin-confirm-pass">
                Confirm New Password
              </label>
              <input
                id="admin-confirm-pass"
                type="password"
                required
                minLength={5}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="primary-action"
              disabled={loading || newPassword.length < 5 || newPassword !== confirmPassword}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Updating...
                </>
              ) : (
                "Save new password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
