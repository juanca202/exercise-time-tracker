import { expect, test } from "@playwright/test";

/**
 * Smoke test de navegación entre las tres secciones de la app (US-001,
 * AC-001/AC-002): valida que el layout con la barra lateral se monta en
 * cada ruta y que el enlace de la sección activa queda resaltado.
 */
test.describe("Navegación principal", () => {
  test("carga la sección Tareas por defecto", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: "Nueva Tarea" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Tareas" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("navega a Proyectos", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Proyectos" }).click();

    await expect(page).toHaveURL("/proyectos");
    await expect(
      page.getByRole("heading", { name: "Proyectos" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("navega a Historial de registros", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Historial de registros" }).click();

    await expect(page).toHaveURL("/historial");
    await expect(
      page.getByRole("heading", { name: "Historial de Tiempo" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Historial de registros" }),
    ).toHaveAttribute("aria-current", "page");
  });
});
