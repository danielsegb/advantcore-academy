import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { CalendarView } from "@/components/planner/calendar-view"
import { AuthProvider } from "@/lib/auth/auth-context"

describe("CalendarView Component", () => {
  it("renders 12-week pathway roadmap and default active week", () => {
    render(
      <AuthProvider>
        <CalendarView />
      </AuthProvider>
    )

    expect(screen.getByText(/12-Week Pathway Pathway Roadmap/i)).toBeInTheDocument()
    expect(screen.getByText("As-Is Process Swimlanes")).toBeInTheDocument()
    expect(screen.getByText("Sync week to Google")).toBeInTheDocument()
  })

  it("switches displayed study blocks when clicking a different week in roadmap", () => {
    render(
      <AuthProvider>
        <CalendarView />
      </AuthProvider>
    )

    const week1Btn = screen.getByText("W1").closest("button")
    if (week1Btn) {
      fireEvent.click(week1Btn)
    }

    expect(screen.getByText("Role of the Business Analyst")).toBeInTheDocument()
    expect(screen.getByText("Problem Statement Deliverable")).toBeInTheDocument()
  })
})
