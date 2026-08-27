import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { AccountStatusGate } from "@/components/auth/account-status-gate"
import * as authContext from "@/lib/auth/auth-context"

describe("AccountStatusGate Component", () => {
  it("renders protected content when user is active", () => {
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      user: {
        id: "usr-1",
        email: "test@example.com",
        fullName: "Test User",
        avatarInitials: "TU",
        avatarColour: "blue",
        role: "learner",
        status: "active",
        mustChangePassword: false,
      },
      isLoading: false,
      isAuthenticated: true,
      signIn: vi.fn(),
      signOut: vi.fn(),
      changePassword: vi.fn(),
      switchDemoRole: vi.fn(),
    })

    render(
      <AccountStatusGate>
        <div>Protected Academy Workspace</div>
      </AccountStatusGate>
    )

    expect(screen.getByText("Protected Academy Workspace")).toBeInTheDocument()
  })

  it("blocks and shows pending message when user is pending approval", () => {
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      user: {
        id: "usr-2",
        email: "pending@example.com",
        fullName: "Pending User",
        avatarInitials: "PU",
        avatarColour: "blue",
        role: "learner",
        status: "pending",
        mustChangePassword: false,
      },
      isLoading: false,
      isAuthenticated: true,
      signIn: vi.fn(),
      signOut: vi.fn(),
      changePassword: vi.fn(),
      switchDemoRole: vi.fn(),
    })

    render(
      <AccountStatusGate>
        <div>Protected Academy Workspace</div>
      </AccountStatusGate>
    )

    expect(screen.queryByText("Protected Academy Workspace")).not.toBeInTheDocument()
    expect(screen.getByText("Account Pending Approval")).toBeInTheDocument()
  })

  it("blocks and shows suspended message when user is suspended", () => {
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      user: {
        id: "usr-3",
        email: "suspended@example.com",
        fullName: "Suspended User",
        avatarInitials: "SU",
        avatarColour: "blue",
        role: "learner",
        status: "suspended",
        mustChangePassword: false,
      },
      isLoading: false,
      isAuthenticated: true,
      signIn: vi.fn(),
      signOut: vi.fn(),
      changePassword: vi.fn(),
      switchDemoRole: vi.fn(),
    })

    render(
      <AccountStatusGate>
        <div>Protected Academy Workspace</div>
      </AccountStatusGate>
    )

    expect(screen.queryByText("Protected Academy Workspace")).not.toBeInTheDocument()
    expect(screen.getByText("Account Suspended")).toBeInTheDocument()
  })
})
