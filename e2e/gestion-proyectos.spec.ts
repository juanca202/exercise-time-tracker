import { test, expect } from "@playwright/test";

/**
 * E2E de la feature `gestion-proyectos` (US-001): crear/editar Proyecto
 * (AC-001/AC-002/AC-005/AC-006), persistencia local tras recarga
 * (AC-003, TC-005/TC-006) y navegación lateral hacia la sección Proyectos
 * (AC-008, TC-014).
 */
test.describe("gestion-proyectos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/proyectos");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  // TC-001 / TC-002 / TC-009 / TC-011: flujo completo de creación y edición.
  test("crea y luego edita un Proyecto reutilizando el mismo modal", async ({
    page,
  }) => {
    // `exact: true` porque el TopAppBar (botón "Nuevo Proyecto") y la
    // tarjeta ghost final del listado (botón "Crear Nuevo Proyecto")
    // coinciden por coincidencia parcial de nombre accesible.
    await page
      .getByRole("button", { name: "Nuevo Proyecto", exact: true })
      .click();

    const dialogo = page.getByRole("dialog");
    await expect(
      dialogo.getByRole("heading", { name: "Nuevo Proyecto" }),
    ).toBeVisible();

    await dialogo.getByLabel("Nombre").fill("Proyecto E2E");
    await dialogo
      .getByPlaceholder("Descripción del proyecto (opcional)")
      .fill("Descripción E2E");
    await dialogo.getByRole("button", { name: "Nuevo Proyecto" }).click();

    await expect(dialogo).not.toBeVisible();
    await expect(page.getByText("Proyecto E2E")).toBeVisible();
    await expect(page.getByText("Descripción E2E")).toBeVisible();

    // Nombre vacío bloquea la creación (TC-003) antes de continuar con la
    // edición para verificar que el modal permanece abierto con el error.
    await page
      .getByRole("button", { name: "Nuevo Proyecto", exact: true })
      .click();
    await dialogo.getByRole("button", { name: "Nuevo Proyecto" }).click();
    await expect(dialogo).toBeVisible();
    await expect(dialogo.getByText("El nombre es obligatorio.")).toBeVisible();
    await dialogo.getByRole("button", { name: "Cancelar" }).click();

    // Edición reutilizando el mismo modal (AC-005 / TC-009).
    await page.getByRole("button", { name: "Editar" }).click();
    await expect(
      dialogo.getByRole("heading", { name: "Editar Proyecto" }),
    ).toBeVisible();
    await expect(dialogo.getByLabel("Nombre")).toHaveValue("Proyecto E2E");

    await dialogo.getByLabel("Nombre").fill("Proyecto E2E editado");
    await dialogo.getByRole("button", { name: "Editar Proyecto" }).click();

    await expect(dialogo).not.toBeVisible();
    await expect(page.getByText("Proyecto E2E editado")).toBeVisible();

    // Nombre vacío bloquea el guardado de la edición y conserva el original
    // (AC-006 / TC-011).
    await page.getByRole("button", { name: "Editar" }).click();
    await dialogo.getByLabel("Nombre").fill("");
    await dialogo.getByRole("button", { name: "Editar Proyecto" }).click();
    await expect(dialogo).toBeVisible();
    await expect(dialogo.getByText("El nombre es obligatorio.")).toBeVisible();
    await dialogo.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByText("Proyecto E2E editado")).toBeVisible();
  });

  // TC-005: un Proyecto persiste tras recargar la aplicación.
  test("un Proyecto creado sigue visible con los mismos datos tras recargar", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: "Nuevo Proyecto", exact: true })
      .click();
    const dialogo = page.getByRole("dialog");
    await dialogo.getByLabel("Nombre").fill("Proyecto persistente");
    await dialogo
      .getByPlaceholder("Descripción del proyecto (opcional)")
      .fill("Sobrevive a la recarga");
    await dialogo.getByRole("button", { name: "Nuevo Proyecto" }).click();
    await expect(dialogo).not.toBeVisible();

    await page.reload();

    await expect(page.getByText("Proyecto persistente")).toBeVisible();
    await expect(page.getByText("Sobrevive a la recarga")).toBeVisible();
  });

  // TC-006: múltiples Proyectos persisten íntegros tras recargar la
  // aplicación, sin pérdida ni duplicación.
  test("un volumen mayor de Proyectos persiste sin pérdida ni duplicación tras recargar", async ({
    page,
  }) => {
    const total = 20;
    // Escopar al contenido principal excluye el `<ul>` de la navegación
    // lateral, que también expone ítems con rol `listitem`.
    const listadoProyectos = page.getByRole("main").getByRole("listitem");

    for (let indice = 1; indice <= total; indice += 1) {
      await page
        .getByRole("button", { name: "Nuevo Proyecto", exact: true })
        .click();
      const dialogo = page.getByRole("dialog");
      await dialogo.getByLabel("Nombre").fill(`Proyecto ${indice}`);
      await dialogo.getByRole("button", { name: "Nuevo Proyecto" }).click();
      await expect(dialogo).not.toBeVisible();
    }

    await expect(listadoProyectos).toHaveCount(total);

    await page.reload();

    await expect(listadoProyectos).toHaveCount(total);
    for (let indice = 1; indice <= total; indice += 1) {
      await expect(
        page.getByText(`Proyecto ${indice}`, { exact: true }),
      ).toBeVisible();
    }
  });

  // TC-014: navegación lateral hacia Proyectos desde otra sección, marcando
  // el ítem correspondiente como activo.
  test("navega a Proyectos desde otra sección mediante la navegación lateral", async ({
    page,
  }) => {
    await page.goto("/tareas");

    const enlaceProyectos = page.getByRole("link", { name: "Proyectos" });
    await expect(enlaceProyectos).toBeVisible();
    await expect(enlaceProyectos).not.toHaveAttribute("aria-current", "page");

    await enlaceProyectos.click();

    await expect(page).toHaveURL(/\/proyectos$/);
    await expect(
      page.getByRole("heading", { name: "Proyectos" }),
    ).toBeVisible();
    await expect(enlaceProyectos).toHaveAttribute("aria-current", "page");
  });
});
