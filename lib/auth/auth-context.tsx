"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { UserProfile, AuthContextType } from "./types"
import type { UserRole } from "@/lib/supabase/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_DEMO_ADMIN: UserProfile = {
  id: "demo-admin-001",
  email: "admin@advantcore.co",
  fullName: "Daniel Emmanuel",
  avatarInitials: "DE",
  avatarColour: "blue",
  role: "admin",
  status: "active",
  mustChangePassword: false,
  assignedPathwayTitle: "Business Analysis",
}

const DEFAULT_DEMO_LEARNER: UserProfile = {
  id: "demo-learner-001",
  email: "amanda.okafor@example.com",
  fullName: "Amanda Okafor",
  avatarInitials: "AO",
  avatarColour: "mint",
  role: "learner",
  status: "active",
  mustChangePassword: false,
  assignedPathwayTitle: "Business Analysis",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_DEMO_ADMIN)
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
              fullName: session.user.user_metadata?.full_name || "Academy User",
              avatarInitials: (session.user.email?.slice(0, 2) || "AU").toUpperCase(),
              avatarColour: "blue",
              role: (session.user.user_metadata?.role as UserRole) || "learner",
              status: "active",
              mustChangePassword: false,
            })
          }
        }
      } catch {
        // Fall back to default demo user
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
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      // Offline/demo login simulation
      if (password === "temp123") {
        setUser({
          ...DEFAULT_DEMO_LEARNER,
          email,
          mustChangePassword: true,
        })
        return { success: true }
      }
      if (email.includes("admin")) {
        setUser(DEFAULT_DEMO_ADMIN)
      } else {
        setUser(DEFAULT_DEMO_LEARNER)
      }
      return { success: true }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
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
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
  }, [])

  const changePassword = useCallback(async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters." }
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      // Local fallback
      setUser(prev => (prev ? { ...prev, mustChangePassword: false } : null))
      return { success: true }
    }

    try {
      const { error: authError } = await supabase.auth.updateUser({ password: newPassword })
      if (authError) {
        return { success: false, error: authError.message }
      }

      if (user?.id) {
        await supabase
          .from("profiles")
          .update({ must_change_password: false })
          .eq("id", user.id)
        setUser(prev => (prev ? { ...prev, mustChangePassword: false } : null))
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to update password." }
    }
  }, [user])

  const switchDemoRole = useCallback((role: UserRole) => {
    if (role === "admin") {
      setUser(DEFAULT_DEMO_ADMIN)
    } else {
      setUser(DEFAULT_DEMO_LEARNER)
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
