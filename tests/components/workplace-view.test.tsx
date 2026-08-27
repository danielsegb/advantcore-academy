import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { WorkplaceView } from "@/components/workplace/workplace-view"
import { AuthProvider } from "@/lib/auth/auth-context"

describe("WorkplaceView Component", () => {
  it("renders the Advantcore delivery workspace and non-employment notice", () => {
    render(
      <AuthProvider>
        <WorkplaceView onSelectView={() => {}} />
      </AuthProvider>
    )

    expect(screen.getByText("Advantcore delivery workspace")).toBeInTheDocument()
    expect(screen.getByText(/Supervised simulated project experience, not employment/i)).toBeInTheDocument()
    expect(screen.getAllByText("ADV-BA-001").length).toBeGreaterThan(0)
  })

  it("switches stage tasks when clicking a different stage in delivery pathway", () => {
    render(
      <AuthProvider>
        <WorkplaceView onSelectView={() => {}} />
      </AuthProvider>
    )

    const stage1Btn = screen.getByRole("button", { name: /Initiate & Scope/i })
    fireEvent.click(stage1Btn)

    expect(screen.getByText("Project Background & Problem Statement")).toBeInTheDocument()
    expect(screen.getByText("Project Charter & Scope Boundaries")).toBeInTheDocument()
  })
})
