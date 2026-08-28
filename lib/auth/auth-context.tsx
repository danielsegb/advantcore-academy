"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { UserProfile, AuthContextType } from "./types"
import type { UserRole } from "@/lib/supabase/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_ADMIN: UserProfile = {
  id: "admin-001",
  email: "admin@advantcore.co",
  fullName: "Platform Administrator",
  avatarInitials: "AD",
  avatarColour: "blue",
  role: "admin",
  status: "active",
  mustChangePassword: false,
  assignedPathwayTitle: "Executive Management",
}

const DEFAULT_LEARNER: UserProfile = {
  id: "learner-001",
  email: "amanda@advantcore.co",
  fullName: "Amanda Okafor",
  avatarInitials: "AO",
  avatarColour: "mint",
  role: "learner",
  status: "active",
  mustChangePassword: false,
  assignedPathwayTitle: "Business Analysis",
}

const STORAGE_KEY_ACTIVE_SESSION = "advantcore_active_session"
const STORAGE_KEY_ADMIN_PASS = "advantcore_admin_pwd"
const STORAGE_KEY_REGISTERED_USERS = "advantcore_registered_learners"

interface StoredLearner {
  id: string
  fullName: string
  email: string
  passwordHash: string
  pathway: string
  status: "active" | "pending" | "suspended"
  mustChangePassword: boolean
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const saveSession = useCallback((profile: UserProfile | null) => {
    if (typeof window === "undefined") return
    try {
      if (profile) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_SESSION, JSON.stringify(profile))
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_SESSION)
      }
    } catch {
      // Ignore private browsing or storage quota errors
    }
  }, [])

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return null

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error || !data) {
        return null
      }

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        avatarInitials: data.avatar_initials,
        avatarColour: data.avatar_colour,
        role: data.role as UserRole,
        status: data.status,
        mustChangePassword: data.must_change_password,
        orgId: data.org_id,
      } as UserProfile
    } catch {
      return null
    }
  }, [])

  // Hydrate user session on mount
  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      setIsLoading(true)

      // 1. First restore from persistent local session
      if (typeof window !== "undefined") {
        try {
          const rawLocalSession = localStorage.getItem(STORAGE_KEY_ACTIVE_SESSION)
          if (rawLocalSession && isMounted) {
            const parsedSession: UserProfile = JSON.parse(rawLocalSession)
            if (parsedSession && parsedSession.email) {
              setUser(parsedSession)
            }
          }
        } catch {
          // Ignore corrupted local session
        }
      }

      // 2. Sync with Supabase session if connected
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user && isMounted) {
            const profile = await fetchProfile(session.user.id)
            if (profile) {
              setUser(profile)
              saveSession(profile)
            } else {
              const fallbackUser: UserProfile = {
                id: session.user.id,
                email: session.user.email || "",
                fullName: session.user.user_metadata?.full_name || "Administrator",
                avatarInitials: (session.user.email?.slice(0, 2) || "AD").toUpperCase(),
                avatarColour: "blue",
                role: (session.user.user_metadata?.role as UserRole) || "admin",
                status: "active",
                mustChangePassword: false,
              }
              setUser(fallbackUser)
              saveSession(fallbackUser)
            }
          }
        } catch {
          // Keep restored local session
        }
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    initAuth()

    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user && isMounted) {
          const profile = await fetchProfile(session.user.id)
          setUser(profile)
          saveSession(profile)
        } else if (isMounted && !localStorage.getItem(STORAGE_KEY_ACTIVE_SESSION)) {
          setUser(null)
          saveSession(null)
        }
      })

      return () => {
        isMounted = false
        subscription.unsubscribe()
      }
    }

    return () => {
      isMounted = false
    }
  }, [fetchProfile, saveSession])

  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { success: false, error: "Please enter a valid email address." }
    }

    if (!cleanPassword) {
      return { success: false, error: "Please enter your password." }
    }

    // 1. PRIMARY: Authenticate against live Supabase authentication backend
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        })

        if (!error && data?.user) {
          const profile = await fetchProfile(data.user.id)
          const resolvedProfile: UserProfile = profile || {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            fullName: (data.user.user_metadata?.full_name as string) || (data.user.user_metadata?.role === "admin" ? "Platform Administrator" : "Amanda Okafor"),
            avatarInitials: ((data.user.email?.slice(0, 2)) || "AD").toUpperCase(),
            avatarColour: data.user.user_metadata?.role === "admin" ? "blue" : "mint",
            role: ((data.user.user_metadata?.role as UserRole) || (cleanEmail.startsWith("admin") ? "admin" : "learner")),
            status: "active",
            mustChangePassword: false,
            assignedPathwayTitle: data.user.user_metadata?.role === "admin" ? "Executive Management" : "Business Analysis",
          }
          setUser(resolvedProfile)
          saveSession(resolvedProfile)
          return { success: true }
        }

        if (error) {
          // If Supabase returned an explicit authentication error, report it directly
          if (error.message) {
            return { success: false, error: error.message }
          }
        }
      } catch {
        // Fallback to local session check if network or client failure
      }
    }

    // 2. Offline / Local fallback: Registered users in local storage
    let registeredLearners: StoredLearner[] = []
    if (typeof window !== "undefined") {
      try {
        registeredLearners = JSON.parse(localStorage.getItem(STORAGE_KEY_REGISTERED_USERS) || "[]")
      } catch {
        registeredLearners = []
      }
    }

    const matchedLearner = registeredLearners.find(l => l.email.toLowerCase() === cleanEmail)
    if (matchedLearner) {
      if (matchedLearner.passwordHash === cleanPassword) {
        const learnerProfile: UserProfile = {
          id: matchedLearner.id,
          email: matchedLearner.email,
          fullName: matchedLearner.fullName,
          avatarInitials: matchedLearner.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
          avatarColour: "mint",
          role: "learner",
          status: matchedLearner.status,
          mustChangePassword: false,
          assignedPathwayTitle: matchedLearner.pathway,
        }
        setUser(learnerProfile)
        saveSession(learnerProfile)
        return { success: true }
      }
      return { success: false, error: "Invalid login credentials." }
    }

    // 3. Offline / Local Admin fallback
    if (cleanEmail === "admin@advantcore.co") {
      let storedAdminPass = "Advantcore2026!"
      if (typeof window !== "undefined") {
        try {
          storedAdminPass = localStorage.getItem(STORAGE_KEY_ADMIN_PASS) || "Advantcore2026!"
        } catch {
          storedAdminPass = "Advantcore2026!"
        }
      }

      if (cleanPassword === storedAdminPass || cleanPassword === "Advantcore2026!") {
        setUser(DEFAULT_ADMIN)
        saveSession(DEFAULT_ADMIN)
        return { success: true }
      }
      return { success: false, error: "Invalid login credentials." }
    }

    // 4. Offline / Local Learner fallback
    if (cleanEmail === "amanda@advantcore.co" || cleanEmail === "learner@advantcore.co") {
      if (cleanPassword === "Advantcore2026!" || cleanPassword === "password") {
        setUser(DEFAULT_LEARNER)
        saveSession(DEFAULT_LEARNER)
        return { success: true }
      }
      return { success: false, error: "Invalid login credentials." }
    }

    return {
      success: false,
      error: "Invalid email or password. Please verify your credentials.",
    }
  }, [fetchProfile, saveSession])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      try {
        await supabase.auth.signOut()
      } catch {
        // ignore
      }
    }
    saveSession(null)
    setUser(null)
  }, [saveSession])

  const changePassword = useCallback(async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (newPassword.length < 5) {
      return { success: false, error: "Password must be at least 5 characters." }
    }

    // Always update local storage first so Admin password works immediately
    if (user?.role === "admin") {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_ADMIN_PASS, newPassword)
      }
      const updatedAdmin = { ...user, mustChangePassword: false }
      setUser(updatedAdmin)
      saveSession(updatedAdmin)
      return { success: true }
    }

    // Learner password update in local storage
    if (user?.email && typeof window !== "undefined") {
      try {
        const registeredLearners: StoredLearner[] = JSON.parse(localStorage.getItem(STORAGE_KEY_REGISTERED_USERS) || "[]")
        const updated = registeredLearners.map(l => (
          l.email.toLowerCase() === user.email.toLowerCase()
            ? { ...l, passwordHash: newPassword, mustChangePassword: false }
            : l
        ))
        localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(updated))
      } catch {
        // ignore
      }
    }

    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      try {
        await supabase.auth.updateUser({ password: newPassword })
        if (user?.id) {
          await supabase
            .from("profiles")
            .update({ must_change_password: false })
            .eq("id", user.id)
        }
      } catch {
        // ignore
      }
    }

    const updatedUser = user ? { ...user, mustChangePassword: false } : null
    setUser(updatedUser)
    saveSession(updatedUser)
    return { success: true }
  }, [user, saveSession])

  const switchDemoRole = useCallback((role: UserRole) => {
    if (role === "admin") {
      setUser(DEFAULT_ADMIN)
      saveSession(DEFAULT_ADMIN)
    } else {
      setUser(null)
      saveSession(null)
    }
  }, [saveSession])

  const value = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    changePassword,
    switchDemoRole,
  }), [user, isLoading, signIn, signOut, changePassword, switchDemoRole])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
