"use client"

import React, { useMemo, useState } from "react"
import {
  Sparkles, LayoutDashboard, GraduationCap, BriefcaseBusiness, Video,
  CalendarDays, Settings, MoreHorizontal, Search, Bell, ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuBadge,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail,
  SidebarSeparator, SidebarTrigger,
} from "@/components/ui/sidebar"
import type { View } from "@/components/shared/types"
import { GuidedTourDialog } from "./guided-tour-dialog"

export const navItems = [
  { id: "dashboard" as View, label: "Home", icon: LayoutDashboard },
  { id: "learning" as View, label: "Learning studio", icon: GraduationCap },
  { id: "workplace" as View, label: "Workplace", icon: BriefcaseBusiness },
  { id: "meetings" as View, label: "Meeting room", icon: Video, badge: "1" },
  { id: "calendar" as View, label: "Plan & calendar", icon: CalendarDays, badge: "3" },
]

interface AcademyShellProps {
  currentView: View
  onSelectView: (view: View) => void
  children: React.ReactNode
}

export function AcademyShell({ currentView, onSelectView, children }: AcademyShellProps) {
  const [tourOpen, setTourOpen] = useState(false)

  const activeTitle = useMemo(() => {
    return navItems.find(i => i.id === currentView)?.label ?? "Admin studio"
  }, [currentView])

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="academy-sidebar">
        <SidebarHeader className="brand-header">
          <button className="brand" onClick={() => onSelectView("dashboard")} aria-label="Advantcore Academy Home">
            <span className="brand-mark"><Sparkles /></span>
            <span><strong>Advantcore</strong><small>ACADEMY</small></span>
          </button>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>My journey</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(item => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={currentView === item.id}
                      onClick={() => onSelectView(item.id)}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Manage</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Admin studio"
                    isActive={currentView === "admin"}
                    onClick={() => onSelectView("admin")}
                  >
                    <Settings />
                    <span>Admin studio</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="sidebar-user">
            <span className="avatar user">DE</span>
            <span><strong>Daniel</strong><small>Learner · Admin</small></span>
            <MoreHorizontal />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="app-shell">
        <header className="topbar">
          <div className="topbar-left">
            <SidebarTrigger />
            <div className="mobile-title">
              <span>{activeTitle}</span>
              <small>Business Analysis pathway</small>
            </div>
          </div>
          <div className="journey-selector">
            <span className="journey-icon"><GraduationCap /></span>
            <div>
              <small>Active pathway</small>
              <strong>Business Analysis</strong>
            </div>
            <ChevronRight />
          </div>
          <div className="top-actions">
            <button className="search-button" aria-label="Search">
              <Search />
              <span>Search anything</span>
              <kbd>⌘ K</kbd>
            </button>
            <button className="icon-button notification" aria-label="Notifications">
              <Bell />
              <i />
            </button>
            <Button size="sm" variant="outline" onClick={() => setTourOpen(true)}>
              <Sparkles /> Help
            </Button>
          </div>
        </header>

        <main className="content-area">
          {children}
        </main>

        <GuidedTourDialog
          open={tourOpen}
          onOpenChange={setTourOpen}
          onStartLearning={onSelectView}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
