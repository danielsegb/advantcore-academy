"use client"

import React, { useState } from "react"
import { AcademyShell } from "@/components/academy-shell/academy-shell"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { LearningView } from "@/components/learning/learning-view"
import { WorkplaceView } from "@/components/workplace/workplace-view"
import { MeetingRoomView } from "@/components/meetings/meeting-room-view"
import { CalendarView } from "@/components/planner/calendar-view"
import { AdminStudioView } from "@/components/admin/admin-studio-view"
import { ErrorBoundary } from "@/components/shared/error-boundary"
import type { View } from "@/components/shared/types"

export function AcademyApp() {
  const [view, setView] = useState<View>("dashboard")

  return (
    <AcademyShell currentView={view} onSelectView={setView}>
      <ErrorBoundary fallbackTitle="Academy View Error">
        {view === "dashboard" && (
          <DashboardView onSelectView={setView} onOpenTour={() => {}} />
        )}
        {view === "learning" && <LearningView onSelectView={setView} />}
        {view === "workplace" && <WorkplaceView onSelectView={setView} />}
        {view === "meetings" && <MeetingRoomView />}
        {view === "calendar" && <CalendarView />}
        {view === "admin" && <AdminStudioView />}
      </ErrorBoundary>
    </AcademyShell>
  )
}
