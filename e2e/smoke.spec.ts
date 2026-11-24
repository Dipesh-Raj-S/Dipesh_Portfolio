import { expect, test } from "@playwright/test";

test("home page loads and a case study opens", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  expect(response?.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );

  await expect(
    page.getByRole("heading", { level: 1, name: "Dipesh Raj S" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: /developer seen from behind/i }),
  ).toBeVisible();

  // Filter state is reflected in the URL.
  await page.getByRole("button", { name: /^Security/ }).click();
  await expect(page).toHaveURL(/category=security/);

  await page.getByRole("link", { name: /Read case study: JailbreakOps/i }).click();
  await expect(page).toHaveURL(/\/projects\/jailbreakops$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "JailbreakOps" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Architecture" })).toBeVisible();
});
