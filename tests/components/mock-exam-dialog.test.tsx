import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { MockExamDialog } from "@/components/learning/mock-exam-dialog"
import { AuthProvider } from "@/lib/auth/auth-context"

describe("MockExamDialog Component", () => {
  it("renders trigger button and opens setup modal", () => {
    render(
      <AuthProvider>
        <MockExamDialog />
      </AuthProvider>
    )

    const trigger = screen.getByRole("button", { name: /Mock exam simulator/i })
    expect(trigger).toBeInTheDocument()
    fireEvent.click(trigger)

    expect(screen.getByText("Full Mock Exam")).toBeInTheDocument()
    expect(screen.getByText("Topic Practice")).toBeInTheDocument()
    expect(screen.getByText("Quick Diagnostic")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Start examination/i })).toBeInTheDocument()
  })
})
