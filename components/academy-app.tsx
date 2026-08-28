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
import { AccountStatusGate } from "@/components/auth/account-status-gate"
import { PortalAuthView } from "@/components/auth/portal-auth-view"
import type { View } from "@/components/shared/types"

import { Sparkles } from "lucide-react"

function AcademyMainContent() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [activeView, setActiveView] = useState<View | null>(null)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6f2] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-sm font-semibold text-[#153e33]">
          <div className="w-8 h-8 rounded-lg bg-[#c5efd9] text-[#153e33] flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Loading Advantcore Academy...</span>
        </div>
      </div>
    )
  }

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
