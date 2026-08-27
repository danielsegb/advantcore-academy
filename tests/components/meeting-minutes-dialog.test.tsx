import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { MeetingMinutesDialog } from "@/components/meetings/meeting-minutes-dialog"
import { initialTranscript } from "@/components/meetings/meeting-room-view"
import { AuthProvider } from "@/lib/auth/auth-context"

describe("MeetingMinutesDialog Component", () => {
  it("renders trigger button and opens executive meeting minutes modal", () => {
    render(
      <AuthProvider>
        <MeetingMinutesDialog transcript={initialTranscript} />
      </AuthProvider>
    )

    const trigger = screen.getByRole("button", { name: /Generate minutes/i })
    expect(trigger).toBeInTheDocument()
    fireEvent.click(trigger)

    expect(screen.getByText("Project Scoping & Discovery Meeting")).toBeInTheDocument()
    expect(screen.getByText("Agreed Action Items & Deliverables:")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Copy markdown/i })).toBeInTheDocument()
  })
})
