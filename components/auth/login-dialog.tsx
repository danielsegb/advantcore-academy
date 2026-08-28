"use client"

import React, { useState } from "react"
import { Sparkles, ShieldAlert, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth/auth-context"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn(email, password)
    setLoading(false)

    if (result.success) {
      onOpenChange(false)
    } else {
      setError(result.error || "Invalid email or password.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary w-fit mb-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <DialogTitle>Sign in to Advantcore Academy</DialogTitle>
            <DialogDescription>
              Enter the credentials provided by your Academy Administrator.
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
              Email address
              <input
                type="email"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-base sm:text-sm"
                placeholder="name@example.com"
              />
            </label>

            <label className="block text-sm font-medium">
              Password
              <input
                type="password"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-base sm:text-sm"
                placeholder="••••••••"
              />
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="primary-action" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
