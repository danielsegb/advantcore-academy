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
import type { View } from "@/components/shared/types"

function AcademyMainContent() {
  const [view, setView] = useState<View>("dashboard")
  const { user } = useAuth()

  // Learners cannot directly view admin studio unless role is admin
  const currentView = view === "admin" && user?.role !== "admin" ? "dashboard" : view

  return (
    <AccountStatusGate>
      <SkipToContent />
      <OfflineBanner />
      <AcademyShell currentView={currentView} onSelectView={setView}>
        <ErrorBoundary>
          {currentView === "dashboard" && (
            <DashboardView onSelectView={setView} onOpenTour={() => {}} />
          )}
          {currentView === "learning" && <LearningView onSelectView={setView} />}
          {currentView === "workplace" && <WorkplaceView onSelectView={setView} />}
          {currentView === "meetings" && <MeetingRoomView />}
          {currentView === "calendar" && <CalendarView />}
          {currentView === "admin" && user?.role === "admin" && <AdminStudioView />}
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
