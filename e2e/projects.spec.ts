import { expect, test } from "@playwright/test";

test.describe("Proyectos", () => {
  test("crear un Proyecto con Nombre y Descripción lo agrega al listado", async ({
    page,
  }) => {
    await page.goto("/projects");

    await page
      .getByRole("button", { name: "Nuevo Proyecto", exact: true })
      .click();
    await page.getByLabel("Nombre").fill("Rediseño Web");
    await page
      .getByLabel("Descripción")
      .fill("Actualización del sitio corporativo");
    await page.getByRole("button", { name: "Crear Proyecto" }).click();

    const card = page.getByRole("listitem").filter({ hasText: "Rediseño Web" });
    await expect(card).toBeVisible();
    await expect(card).toContainText("Actualización del sitio corporativo");
    await expect(card).toContainText("0h 00m");
  });

  test("muestra el estado vacío cuando no hay Proyectos creados", async ({
    page,
  }) => {
    await page.goto("/projects");

    await expect(
      page.getByRole("button", { name: "Crear Nuevo Proyecto" }),
    ).toBeVisible();
    await expect(page.getByRole("listitem")).toHaveCount(1);
  });
});
