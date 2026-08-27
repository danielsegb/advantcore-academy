import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { PrivacyCenterDialog } from "@/components/compliance/privacy-center-dialog"
import { AuthProvider } from "@/lib/auth/auth-context"

describe("PrivacyCenterDialog Component", () => {
  it("renders trigger button and opens privacy center modal", () => {
    render(
      <AuthProvider>
        <PrivacyCenterDialog />
      </AuthProvider>
    )

    const trigger = screen.getByRole("button", { name: /Privacy & Data Rights/i })
    expect(trigger).toBeInTheDocument()
    fireEvent.click(trigger)

    expect(screen.getByText("UK Privacy & Data Rights Center")).toBeInTheDocument()
    expect(screen.getByText("Statutory Data Retention Schedule:")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Download my data/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Request account erasure/i })).toBeInTheDocument()
  })

  it("updates state when requesting account erasure", () => {
    render(
      <AuthProvider>
        <PrivacyCenterDialog />
      </AuthProvider>
    )

    const trigger = screen.getByRole("button", { name: /Privacy & Data Rights/i })
    fireEvent.click(trigger)

    const erasureBtn = screen.getByRole("button", { name: /Request account erasure/i })
    fireEvent.click(erasureBtn)

    expect(screen.getByText(/Erasure request logged/i)).toBeInTheDocument()
  })
})
