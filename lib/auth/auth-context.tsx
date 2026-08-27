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
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      return
    }

    let isMounted = true

    async function initAuth() {
      if (!supabase) return
      setIsLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && isMounted) {
          const profile = await fetchProfile(session.user.id)
          if (profile) {
            setUser(profile)
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              fullName: session.user.user_metadata?.full_name || "Administrator",
              avatarInitials: (session.user.email?.slice(0, 2) || "AD").toUpperCase(),
              avatarColour: "blue",
              role: (session.user.user_metadata?.role as UserRole) || "admin",
              status: "active",
              mustChangePassword: false,
            })
          }
        }
      } catch {
        // Leave unauthenticated
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && isMounted) {
        const profile = await fetchProfile(session.user.id)
        setUser(profile)
      } else if (isMounted) {
        setUser(null)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    // 1. Prioritize Platform Administrator Access
    if (cleanEmail === "admin@advantcore.co") {
      let storedAdminPass = "default"
      if (typeof window !== "undefined") {
        storedAdminPass = localStorage.getItem(STORAGE_KEY_ADMIN_PASS) || "default"
      }

      if (cleanPassword === storedAdminPass || (storedAdminPass === "default" && cleanPassword === "default")) {
        setUser(DEFAULT_ADMIN)
        return { success: true }
      }
      return { success: false, error: "Incorrect password for admin@advantcore.co." }
    }

    // 2. Prioritize Onboarded Learners in Registry
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
        setUser({
          id: matchedLearner.id,
          email: matchedLearner.email,
          fullName: matchedLearner.fullName,
          avatarInitials: matchedLearner.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
          avatarColour: "mint",
          role: "learner",
          status: matchedLearner.status,
          mustChangePassword: false,
          assignedPathwayTitle: matchedLearner.pathway,
        })
        return { success: true }
      }
      return { success: false, error: "Incorrect password for learner account." }
    }

    // 3. Supabase Auth Fallback
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword })
        if (error) {
          return { success: false, error: error.message }
        }
        if (data.user) {
          const profile = await fetchProfile(data.user.id)
          setUser(profile)
        }
        return { success: true }
      } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Authentication failed." }
      }
    }

    return {
      success: false,
      error: "Account not found. Please contact the Academy Administrator to provision your access.",
    }
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      try {
        await supabase.auth.signOut()
      } catch {
        // ignore
      }
    }
    setUser(null)
  }, [])

  const changePassword = useCallback(async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (newPassword.length < 5) {
      return { success: false, error: "Password must be at least 5 characters." }
    }

    // Always update local storage first so Admin password works immediately
    if (user?.role === "admin") {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_ADMIN_PASS, newPassword)
      }
      setUser(prev => (prev ? { ...prev, mustChangePassword: false } : null))
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

    setUser(prev => (prev ? { ...prev, mustChangePassword: false } : null))
    return { success: true }
  }, [user])

  const switchDemoRole = useCallback((role: UserRole) => {
    if (role === "admin") {
      setUser(DEFAULT_ADMIN)
    } else {
      setUser(null)
    }
  }, [])

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
