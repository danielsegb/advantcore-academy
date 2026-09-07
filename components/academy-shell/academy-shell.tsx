"use client"

import React, { useMemo, useState } from "react"
import {
  Sparkles, LayoutDashboard, GraduationCap, BriefcaseBusiness, Video,
  CalendarDays, Settings, LogIn, LogOut, Search, ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail,
  SidebarSeparator, SidebarTrigger,
} from "@/components/ui/sidebar"
import type { View } from "@/components/shared/types"
import { GuidedTourDialog } from "./guided-tour-dialog"
import { LoginDialog } from "@/components/auth/login-dialog"
import { AdminChangePasswordDialog } from "@/components/auth/admin-change-password-dialog"
import { useAuth } from "@/lib/auth/auth-context"
import { PrivacyCenterDialog } from "@/components/compliance/privacy-center-dialog"
import { NotificationCenter } from "@/components/dashboard/notification-center"
import { GlobalSearchDialog } from "@/components/shared/global-search-dialog"

export const navItems = [
  { id: "dashboard" as View, label: "Home", icon: LayoutDashboard },
  { id: "learning" as View, label: "Learning studio", icon: GraduationCap },
  { id: "workplace" as View, label: "Workplace", icon: BriefcaseBusiness },
  { id: "meetings" as View, label: "Meeting room", icon: Video },
  { id: "calendar" as View, label: "Plan & calendar", icon: CalendarDays },
]

interface AcademyShellProps {
  currentView: View
  onSelectView: (view: View) => void
  /** When set to true externally, immediately opens the guided tour dialog */
  openTour?: boolean
  onTourClose?: () => void
  children: React.ReactNode
}

export function AcademyShell({ currentView, onSelectView, openTour, onTourClose, children }: AcademyShellProps) {
  const { user, signOut } = useAuth()
  const [tourOpen, setTourOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Sync external openTour flag → open the dialog
  React.useEffect(() => {
    if (openTour) setTourOpen(true)
  }, [openTour])

  const activeTitle = useMemo(() => {
    return navItems.find(i => i.id === currentView)?.label ?? "Admin studio"
  }, [currentView])

  const isAdmin = user?.role === "admin"

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="academy-sidebar">
        <SidebarHeader className="brand-header">
          <button className="brand" onClick={() => onSelectView(isAdmin ? "admin" : "dashboard")} aria-label="Advantcore Academy Home">
            <span className="brand-mark"><Sparkles /></span>
            <span><strong>Advantcore</strong><small>ACADEMY</small></span>
          </button>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {isAdmin && (
            <SidebarGroup>
              <SidebarGroupLabel>Governance</SidebarGroupLabel>
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
          )}
        </SidebarContent>

        <SidebarFooter>
          <div className="px-2 py-1 border-b border-border/40 mb-1">
            <PrivacyCenterDialog />
          </div>
          {user ? (
            <div className="sidebar-user flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className={`avatar user ${user.avatarColour}`}>{user.avatarInitials}</span>
                <div className="truncate">
                  <strong>{user.fullName}</strong>
                  <small className="capitalize block">{user.email}</small>
                </div>
              </div>
              <button
                className="icon-button"
                onClick={() => signOut()}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => setLoginOpen(true)}>
              <LogIn className="w-4 h-4 mr-2" /> Sign in
            </Button>
          )}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="app-shell">
        <header className="topbar">
          <div className="topbar-left">
            <SidebarTrigger />
            <div className="mobile-title">
              <span>{activeTitle}</span>
              <small>Advantcore Academy</small>
            </div>
          </div>
          <button
            type="button"
            className="journey-selector text-left cursor-pointer hover:bg-muted/40 transition-all"
            onClick={() => onSelectView("learning")}
            title="Active learning pathway - click to view curriculum"
          >
            <span className="journey-icon"><GraduationCap /></span>
            <div>
              <small>Active role</small>
              <strong className="capitalize">{isAdmin ? "Platform Administrator" : (user?.assignedPathwayTitle || "Business Analysis")}</strong>
            </div>
            <ChevronRight />
          </button>
          <div className="top-actions flex items-center gap-1.5 sm:gap-2">
            {isAdmin && <AdminChangePasswordDialog />}
            <button
              type="button"
              className="search-button cursor-pointer hover:opacity-90 transition-opacity hidden sm:flex"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              title="Search anything (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
              <span>Search anything</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              type="button"
              className="sm:hidden p-2 rounded-lg border bg-card text-muted-foreground hover:text-foreground transition-all"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              title="Search anything"
            >
              <Search className="w-4 h-4" />
            </button>
            <NotificationCenter onNavigate={onSelectView} />
            <Button size="sm" variant="outline" className="hidden sm:inline-flex text-xs h-8" onClick={() => setTourOpen(true)}>
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Help
            </Button>
            {user && (
              <Button size="sm" variant="ghost" className="text-xs text-muted-foreground hover:text-foreground h-8 px-2 sm:px-3" onClick={() => signOut()}>
                <LogOut className="w-3.5 h-3.5 sm:mr-1" /> <span className="hidden sm:inline">Sign out</span>
              </Button>
            )}
            {!user && (
              <Button size="sm" className="primary-action text-xs h-8 font-bold" onClick={() => setLoginOpen(true)}>
                <LogIn className="w-4 h-4 sm:mr-1.5" /> <span className="hidden sm:inline">Sign in</span>
              </Button>
            )}
          </div>
        </header>

        <main className="content-area">
          {children}
        </main>

        <GlobalSearchDialog
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onNavigate={onSelectView}
        />

        <GuidedTourDialog
          open={tourOpen}
          onOpenChange={(v) => { setTourOpen(v); if (!v) onTourClose?.() }}
          onStartLearning={onSelectView}
        />

        <LoginDialog
          open={loginOpen}
          onOpenChange={setLoginOpen}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
