import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { StatCard } from "@/components/shared/stat-card"
import { ReadinessRing } from "@/components/shared/readiness-ring"
import { GraduationCap } from "lucide-react"

describe("Shared UI Components", () => {
  it("renders StatCard with icon, value, label and detail", () => {
    render(
      <StatCard
        icon={GraduationCap}
        value="67%"
        label="Course progress"
        detail="3 of 6 modules active"
        tone="mint"
      />
    )

    expect(screen.getByText("67%")).toBeInTheDocument()
    expect(screen.getByText("Course progress")).toBeInTheDocument()
    expect(screen.getByText("3 of 6 modules active")).toBeInTheDocument()
  })

  it("renders ReadinessRing with percentage and label", () => {
    render(<ReadinessRing value={74} label="Exam" tone="gold" />)

    expect(screen.getByText("74%")).toBeInTheDocument()
    expect(screen.getByText("Exam")).toBeInTheDocument()
    expect(screen.getByLabelText("Exam readiness: 74%")).toBeInTheDocument()
  })
})
