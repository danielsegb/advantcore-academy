import { test, expect } from "@playwright/test"

test.describe("Advantcore Academy Smoke Test Suite", () => {
  test("loads the Academy homepage with title and navigation", async ({ page }) => {
    await page.goto("/academy")

    // Verify title and brand
    await expect(page).toHaveTitle(/Advantcore Academy/)
    await expect(page.getByRole("button", { name: /Advantcore Academy/i })).toBeVisible()

    // Verify dashboard welcome heading
    await expect(page.getByRole("heading", { name: /Good morning, Daniel/i })).toBeVisible()

    // Navigate to Learning Studio
    await page.getByRole("button", { name: /Learning studio/i }).click()
    await expect(page.getByRole("heading", { name: /BCS Foundation Certificate/i })).toBeVisible()

    // Navigate to Workplace
    await page.getByRole("button", { name: /Workplace/i }).click()
    await expect(page.getByRole("heading", { name: /Advantcore delivery workspace/i })).toBeVisible()

    // Navigate to Meetings
    await page.getByRole("button", { name: /Meeting room/i }).click()
    await expect(page.getByRole("heading", { name: /Project scoping meeting/i })).toBeVisible()

    // Navigate to Admin Studio
    await page.getByRole("button", { name: /Admin studio/i }).click()
    await expect(page.getByRole("heading", { name: /Build and govern career experiences/i })).toBeVisible()
  })
})
