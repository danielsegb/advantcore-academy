import { render, screen, fireEvent, act } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { PortalAuthView } from "@/components/auth/portal-auth-view"
import * as authContext from "@/lib/auth/auth-context"

describe("PortalAuthView Component", () => {
  it("renders the sign in card and email/password inputs", () => {
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signIn: vi.fn().mockResolvedValue({ success: true }),
      signOut: vi.fn(),
      changePassword: vi.fn(),
      switchDemoRole: vi.fn(),
    })

    render(<PortalAuthView />)

    expect(screen.getByText("Sign in to your account")).toBeInTheDocument()
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
  })

  it("submits email and password to signIn handler", async () => {
    const signInMock = vi.fn().mockResolvedValue({ success: true })
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signIn: signInMock,
      signOut: vi.fn(),
      changePassword: vi.fn(),
      switchDemoRole: vi.fn(),
    })

    render(<PortalAuthView />)

    const emailInput = screen.getByLabelText(/Email address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitBtn = screen.getByTestId("portal-submit-btn")

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "amanda@advantcore.co" } })
      fireEvent.change(passwordInput, { target: { value: "password" } })
      fireEvent.click(submitBtn)
    })

    expect(signInMock).toHaveBeenCalledWith("amanda@advantcore.co", "password")
  })

  it("switches mobile tabs between Sign in and About Platform", () => {
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signIn: vi.fn().mockResolvedValue({ success: true }),
      signOut: vi.fn(),
      changePassword: vi.fn(),
      switchDemoRole: vi.fn(),
    })

    render(<PortalAuthView />)

    const aboutTabBtn = screen.getByText("About Platform")
    fireEvent.click(aboutTabBtn)

    expect(screen.getByText("Industry-Accredited Curriculum")).toBeInTheDocument()
    expect(screen.getByText("Virtual Workplace Experience")).toBeInTheDocument()
  })
})
