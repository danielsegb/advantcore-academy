"use client"

import React from "react"
import { Clock, ShieldX, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { MustChangePasswordDialog } from "./must-change-password-dialog"

export function AccountStatusGate({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()

  if (!user) {
    return <>{children}</>
  }

  if (user.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full p-8 text-center bg-card rounded-2xl border shadow-lg space-y-4">
          <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-500">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Account Pending Approval</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your registration is awaiting activation by an Academy Administrator. Once approved, your assigned career pathway and virtual workplace projects will become accessible.
          </p>
          <div className="pt-2">
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (user.status === "suspended") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full p-8 text-center bg-card rounded-2xl border border-destructive/20 shadow-lg space-y-4">
          <div className="inline-flex p-4 rounded-full bg-destructive/10 text-destructive">
            <ShieldX className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Account Suspended</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This account has been suspended by an Academy Administrator. Please contact your organization administrator for assistance.
          </p>
          <div className="pt-2">
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <MustChangePasswordDialog />
      {children}
    </>
  )
}
