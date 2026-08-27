"use client"

import React, { useState } from "react"
import { AuthProvider, useAuth } from "@/lib/auth/auth-context"
import { AcademyShell } from "@/components/academy-shell/academy-shell"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { LearningView } from "@/components/learning/learning-view"
import { WorkplaceView } from "@/components/workplace/workplace-view"
import { MeetingRoomView } from "@/components/meetings/meeting-room-view"
import { CalendarView } from "@/components/planner/calendar-view"
import { AdminStudioView } from "@/components/admin/admin-studio-view"
import { ErrorBoundary } from "@/components/shared/error-boundary"
import { SkipToContent } from "@/components/shared/skip-to-content"
import { OfflineBanner } from "@/components/shared/offline-banner"
import { MustChangePasswordDialog } from "@/components/auth/must-change-password-dialog"
import { AccountStatusGate } from "@/components/auth/account-status-gate"
import { PortalAuthView } from "@/components/auth/portal-auth-view"
import type { View } from "@/components/shared/types"

function AcademyMainContent() {
  const { user, isAuthenticated } = useAuth()
  const [activeView, setActiveView] = useState<View | null>(null)

  if (!isAuthenticated || !user) {
    return <PortalAuthView />
  }

  // Derive current view based on user selection or role default
  const defaultView: View = user.role === "admin" ? "admin" : "dashboard"
  const resolvedView: View = activeView || defaultView
  const currentView = resolvedView === "admin" && user.role !== "admin" ? "dashboard" : resolvedView

  return (
    <AccountStatusGate>
      <SkipToContent />
      <OfflineBanner />
      <AcademyShell currentView={currentView} onSelectView={setActiveView}>
        <ErrorBoundary>
          {currentView === "dashboard" && (
            <DashboardView onSelectView={setActiveView} onOpenTour={() => {}} />
          )}
          {currentView === "learning" && <LearningView onSelectView={setActiveView} />}
          {currentView === "workplace" && <WorkplaceView onSelectView={setActiveView} />}
          {currentView === "meetings" && <MeetingRoomView />}
          {currentView === "calendar" && <CalendarView />}
          {currentView === "admin" && user.role === "admin" && <AdminStudioView />}
        </ErrorBoundary>

        <MustChangePasswordDialog />
      </AcademyShell>
    </AccountStatusGate>
  )
}

export function AcademyApp() {
  return (
    <AuthProvider>
      <AcademyMainContent />
    </AuthProvider>
  )
}
