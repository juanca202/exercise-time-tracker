import { test, expect } from "@playwright/test";

const CLAVE_ALMACENAMIENTO = "time-tracker:estado";

const ESTADO_SEMILLA = {
  version: 1,
  proyectos: [
    { id: "proyecto-1", nombre: "Proyecto Alpha", descripcion: "" },
    { id: "proyecto-2", nombre: "Proyecto Beta", descripcion: "" },
  ],
  tareas: [
    { id: "tarea-1", proyectoId: "proyecto-1", nombre: "Diseñar wireframes" },
    { id: "tarea-2", proyectoId: "proyecto-2", nombre: "Revisar backlog" },
  ],
  registrosDeTiempo: [
    {
      id: "registro-1",
      tareaId: "tarea-1",
      fecha: "2026-07-13T12:00:00.000Z",
      duracionMs: 2 * 60 * 60 * 1000,
      origen: "manual",
    },
  ],
  temporizadorActivo: null,
};

/**
 * Pruebas de regresión visual (snapshot testing con Playwright) de la
 * pantalla de Tareas y del modal "Nueva Tarea", cubriendo TC-006 (adherencia
 * a DESIGN.md) y TC-018 (fidelidad visual). Los snapshots baseline se
 * confirman manualmente contra el prototipo Figma de referencia y luego
 * actúan como guardrail de regresión en cada ejecución posterior.
 */
test.describe("Tareas · regresión visual (TC-006, TC-018)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ({ clave, estado }) => {
        window.localStorage.setItem(clave, JSON.stringify(estado));
      },
      { clave: CLAVE_ALMACENAMIENTO, estado: ESTADO_SEMILLA },
    );
    await page.goto("/tareas");
    await expect(
      page.getByRole("heading", { name: "Tareas", exact: true }),
    ).toBeVisible();
  });

  test("la pantalla de Tareas poblada con datos de ejemplo coincide con el snapshot base", async ({
    page,
  }) => {
    await expect(page).toHaveScreenshot("pantalla-tareas.png", {
      fullPage: true,
    });
  });

  test("el modal 'Nueva Tarea' coincide con el snapshot base", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Nueva Tarea" }).click();
    const dialogo = page.getByRole("dialog");
    await expect(dialogo).toBeVisible();
    await expect(dialogo).toHaveScreenshot("modal-nueva-tarea.png");
  });
});
