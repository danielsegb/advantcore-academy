import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { CalendarView } from "@/components/planner/calendar-view"
import { AuthProvider } from "@/lib/auth/auth-context"

describe("CalendarView Component", () => {
  it("renders 12-week pathway roadmap and default active week 1", () => {
    render(
      <AuthProvider>
        <CalendarView />
      </AuthProvider>
    )

    expect(screen.getByText(/12-Week Pathway Roadmap/i)).toBeInTheDocument()
    expect(screen.getByText("Orientation & Foundations")).toBeInTheDocument()
    expect(screen.getByText("Sync week to Google")).toBeInTheDocument()
  })

  it("switches displayed study blocks when clicking a different week in roadmap", () => {
    render(
      <AuthProvider>
        <CalendarView />
      </AuthProvider>
    )

    const week2Btn = screen.getByText("W2").closest("button")
    if (week2Btn) {
      fireEvent.click(week2Btn)
    }

    expect(screen.getByText(/PESTLE & Porter's 5 Forces/i)).toBeInTheDocument()
    expect(screen.getByText(/Project Charter Formulation/i)).toBeInTheDocument()
  })
})
