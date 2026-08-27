import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { MeetingRoomView } from "@/components/meetings/meeting-room-view"
import { AuthProvider } from "@/lib/auth/auth-context"

describe("MeetingRoomView Component", () => {
  it("renders the meeting room, character cards, and transcript", () => {
    render(
      <AuthProvider>
        <MeetingRoomView />
      </AuthProvider>
    )

    expect(screen.getByText("Project scoping meeting")).toBeInTheDocument()
    expect(screen.getByText("Sarah Mitchell")).toBeInTheDocument()
    expect(screen.getByText("Marcus Cole")).toBeInTheDocument()
    expect(screen.getByText("Priya Shah")).toBeInTheDocument()
    expect(screen.getByText("Helen Grant")).toBeInTheDocument()
    expect(screen.getByText("Live transcript")).toBeInTheDocument()
  })

  it("updates selected character when clicking a stakeholder tile", () => {
    render(
      <AuthProvider>
        <MeetingRoomView />
      </AuthProvider>
    )

    const priyaTile = screen.getByText("Priya Shah").closest("button")
    if (priyaTile) {
      fireEvent.click(priyaTile)
    }

    const input = screen.getByPlaceholderText(/Ask Priya…/i)
    expect(input).toBeInTheDocument()
  })
})
