import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { GlobalSearchDialog } from "@/components/shared/global-search-dialog"

describe("GlobalSearchDialog Component", () => {
  it("renders search input and suggests topics when open", () => {
    const onNavigate = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <GlobalSearchDialog open={true} onOpenChange={onOpenChange} onNavigate={onNavigate} />
    )

    const searchInput = screen.getByPlaceholderText(/Search lessons, textbook, RACI/i)
    expect(searchInput).toBeInTheDocument()
    expect(screen.getByText("Executive Dashboard")).toBeInTheDocument()
  })

  it("filters items based on user query and triggers navigation on click", () => {
    const onNavigate = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <GlobalSearchDialog open={true} onOpenChange={onOpenChange} onNavigate={onNavigate} />
    )

    const searchInput = screen.getByPlaceholderText(/Search lessons, textbook, RACI/i)
    fireEvent.change(searchInput, { target: { value: "Mock Exam" } })

    const result = screen.getByText(/Mock Exam Simulator/i)
    expect(result).toBeInTheDocument()

    fireEvent.click(result)
    expect(onNavigate).toHaveBeenCalledWith("learning")
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
