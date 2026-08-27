"use client"

import React, { useSyncExternalStore } from "react"
import { WifiOff } from "lucide-react"

function subscribe(callback: () => void) {
  window.addEventListener("online", callback)
  window.addEventListener("offline", callback)
  return () => {
    window.removeEventListener("online", callback)
    window.removeEventListener("offline", callback)
  }
}

function getSnapshot() {
  return typeof navigator !== "undefined" ? !navigator.onLine : false
}

function getServerSnapshot() {
  return false
}

export function OfflineBanner() {
  const isOffline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (!isOffline) return null

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 sticky top-0 z-50">
      <WifiOff className="w-4 h-4" />
      <span>You are currently working offline. Academy deterministic local engine is active.</span>
    </div>
  )
}
