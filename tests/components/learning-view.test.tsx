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
    expect(screen.getByText("Business analysis foundations")).toBeInTheDocument()
    expect(screen.getByText("The role and competencies of a Business Analyst")).toBeInTheDocument()
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

  it("navigates to the next lesson when Next button is clicked", () => {
    render(
      <AuthProvider>
        <LearningView />
      </AuthProvider>
    )

    // Starting on Lesson 1.1
    expect(screen.getByText("The role and competencies of a Business Analyst")).toBeInTheDocument()

    // Find and click the bottom "Next: Lesson 2.1" button
    const nextBtn = screen.getByText(/Next: Lesson 2.1/i)
    fireEvent.click(nextBtn)

    // Now should be on Lesson 2.1
    expect(screen.getByText("External environmental analysis: PESTLE and Five Forces")).toBeInTheDocument()
    expect(screen.getByText("Advantcore Market Context")).toBeInTheDocument()
  })

  it("marks a lesson as complete and triggers the celebratory completion dialog", () => {
    render(
      <AuthProvider>
        <LearningView />
      </AuthProvider>
    )

    // Click "Mark as Complete" button
    const completeBtn = screen.getByText("Mark as Complete")
    fireEvent.click(completeBtn)

    // Verify celebration modal opens
    expect(screen.getByText(/Lesson 1.1 Completed!/i)).toBeInTheDocument()
    expect(screen.getByText("Lesson Mastered")).toBeInTheDocument()
    expect(screen.getByText("Verified Learning Outcomes")).toBeInTheDocument()
  })
})
