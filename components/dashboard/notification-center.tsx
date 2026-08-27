"use client"

import React, { useState } from "react"
import { Bell, Check, CheckCheck, FileText, Calendar, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { initialNotifications, type NotificationItem } from "@/lib/notifications/types"
import type { View } from "@/components/shared/types"

interface NotificationCenterProps {
  onNavigate?: (view: View) => void
}

export function NotificationCenter({ onNavigate }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  function markAsRead(id: string) {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllAsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function handleAction(n: NotificationItem) {
    markAsRead(n.id)
    setOpen(false)
    if (n.actionView && onNavigate) {
      onNavigate(n.actionView)
    }
  }

  function getIcon(type: NotificationItem["type"]) {
    switch (type) {
      case "review":
        return <Award className="w-4 h-4 text-emerald-500" />
      case "meeting":
        return <Calendar className="w-4 h-4 text-blue-500" />
      case "milestone":
        return <Check className="w-4 h-4 text-purple-500" />
      default:
        return <FileText className="w-4 h-4 text-amber-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="relative p-2 rounded-lg border bg-card hover:bg-muted/50 text-foreground transition-all"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {unreadCount} Unread Alerts
            </Badge>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>
          <DialogTitle>Notification Center</DialogTitle>
          <DialogDescription>
            Live alerts regarding supervisory reviews, independent auditor decisions, and upcoming meeting sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {notifications.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No notifications yet.</p>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`p-3 rounded-lg border transition-all text-xs space-y-1.5 ${
                  n.read ? "bg-card opacity-70" : "bg-primary/5 border-primary/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    {getIcon(n.type)}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.timestamp}</span>
                </div>

                <p className="text-muted-foreground leading-relaxed">{n.message}</p>

                <div className="flex items-center justify-between pt-1 border-t">
                  {n.actionView ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[11px] h-7 px-2"
                      onClick={() => handleAction(n)}
                    >
                      Go to {n.actionView}
                    </Button>
                  ) : <span />}

                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
