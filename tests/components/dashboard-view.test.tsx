import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { AuthProvider } from "@/lib/auth/auth-context"

describe("DashboardView Component", () => {
  it("renders learner greeting, transparent readiness rings, and stat cards", () => {
    const onSelectView = vi.fn()
    const onOpenTour = vi.fn()

    render(
      <AuthProvider>
        <DashboardView onSelectView={onSelectView} onOpenTour={onOpenTour} />
      </AuthProvider>
    )

    expect(screen.getByText(/Good morning/i)).toBeInTheDocument()
    expect(screen.getByText("Knowledge mastery")).toBeInTheDocument()
    expect(screen.getByText("Exam readiness")).toBeInTheDocument()
    expect(screen.getByText("Workplace evidence")).toBeInTheDocument()
    expect(screen.getByText("Interview readiness")).toBeInTheDocument()
  })

  it("opens Notification Center dialog when clicking the bell icon", () => {
    const onSelectView = vi.fn()
    const onOpenTour = vi.fn()

    render(
      <AuthProvider>
        <DashboardView onSelectView={onSelectView} onOpenTour={onOpenTour} />
      </AuthProvider>
    )

    const bellBtn = screen.getByRole("button", { name: /Notifications/i })
    expect(bellBtn).toBeInTheDocument()
    fireEvent.click(bellBtn)

    expect(screen.getByText("Notification Center")).toBeInTheDocument()
  })

  it("opens Career & Interview Accelerator dialog", () => {
    const onSelectView = vi.fn()
    const onOpenTour = vi.fn()

    render(
      <AuthProvider>
        <DashboardView onSelectView={onSelectView} onOpenTour={onOpenTour} />
      </AuthProvider>
    )

    const careerBtn = screen.getByRole("button", { name: /Career & interview accelerator/i })
    expect(careerBtn).toBeInTheDocument()
    fireEvent.click(careerBtn)

    expect(screen.getByText("Business Analyst Career Accelerator")).toBeInTheDocument()
    expect(screen.getByText("Interview Simulator")).toBeInTheDocument()
  })
})
