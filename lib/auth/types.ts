import type { UserRole, AccountStatus } from "@/lib/supabase/types"

export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatarInitials: string
  avatarColour: string
  role: UserRole
  status: AccountStatus
  mustChangePassword: boolean
  orgId?: string | null
  assignedPathwayId?: string | null
  assignedPathwayTitle?: string | null
}

export interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>
  switchDemoRole: (role: UserRole) => void
}
