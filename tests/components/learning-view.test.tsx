import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { LearningView } from "@/components/learning/learning-view"
import { AuthProvider } from "@/lib/auth/auth-context"

describe("LearningView Component", () => {
  it("renders the 6 BCS modules and default active lesson", () => {
    render(
      <AuthProvider>
        <LearningView />
      </AuthProvider>
    )

    expect(screen.getByText("6 BCS modules")).toBeInTheDocument()
    expect(screen.getByText("Stakeholder analysis")).toBeInTheDocument()
    expect(screen.getByText("Managing stakeholder relationships")).toBeInTheDocument()
    expect(screen.getByText("Learning outcomes")).toBeInTheDocument()
  })

  it("switches module content when a different module is clicked", () => {
    render(
      <AuthProvider>
        <LearningView />
      </AuthProvider>
    )

    const foundationsBtn = screen.getByText("Business analysis foundations")
    fireEvent.click(foundationsBtn)

    expect(screen.getByText("The role and competencies of a Business Analyst")).toBeInTheDocument()
    expect(screen.getByText("Advantcore Engagement Scoping")).toBeInTheDocument()
  })
})
