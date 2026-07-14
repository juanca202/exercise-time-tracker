import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("should load the home page", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle(/Time Tracker/);
  });
});
