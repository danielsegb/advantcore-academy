import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { GuidedBuilder } from "@/components/admin/guided-builder"

describe("GuidedBuilder Component", () => {
  it("renders Step 1 with default values and AI recommendation box", () => {
    render(<GuidedBuilder />)

    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument()
    expect(screen.getByText("Define the career pathway")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Business Analyst Career Accelerator")).toBeInTheDocument()
    expect(screen.getByText("Suggested structure")).toBeInTheDocument()
  })

  it("navigates through steps when clicking Save & continue", () => {
    render(<GuidedBuilder />)

    const continueBtn = screen.getByRole("button", { name: /Save & continue/i })
    fireEvent.click(continueBtn)

    // Step 2: Certification
    expect(screen.getByText("Step 2 of 5")).toBeInTheDocument()
    expect(screen.getByText("Official certification alignment")).toBeInTheDocument()
    expect(screen.getByDisplayValue("BCS Foundation Certificate in Business Analysis")).toBeInTheDocument()
  })
})
