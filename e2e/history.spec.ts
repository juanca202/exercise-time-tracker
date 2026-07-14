import { expect, test } from "@playwright/test";

async function createProject(
  page: import("@playwright/test").Page,
  name: string,
) {
  await page.goto("/projects");
  await page
    .getByRole("button", { name: "Nuevo Proyecto", exact: true })
    .click();
  await page.getByLabel("Nombre").fill(name);
  await page.getByRole("button", { name: "Crear Proyecto" }).click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
}

async function createTask(
  page: import("@playwright/test").Page,
  projectName: string,
  taskName: string,
) {
  await page.goto("/tasks");
  await page.getByRole("button", { name: "Nueva Tarea", exact: true }).click();
  await page.getByLabel("Proyecto", { exact: true }).click();
  await page.getByRole("option", { name: projectName }).click();
  await page.getByLabel("Nombre").fill(taskName);
  await page.getByRole("button", { name: "Crear Tarea" }).click();
}

async function addManualEntry(
  page: import("@playwright/test").Page,
  projectName: string,
  taskName: string,
  duration: string,
) {
  await page.getByLabel("Proyecto / Tarea").click();
  await page
    .getByRole("option", { name: `${projectName} — ${taskName}` })
    .click();
  await page.getByPlaceholder("02:30").fill(duration);
  await page.getByRole("button", { name: "Guardar Registro" }).click();
}

test.describe("Historial de registros", () => {
  test("muestra la Tarea, el total por Proyecto y el resumen del periodo actual", async ({
    page,
  }) => {
    await createProject(page, "Proyecto Alfa");
    await createTask(page, "Proyecto Alfa", "Diseñar wireframes");
    await addManualEntry(page, "Proyecto Alfa", "Diseñar wireframes", "01:30");

    await page.goto("/history");

    await expect(page.getByText("1h 30m")).toBeVisible();

    const row = page.getByRole("row").filter({ hasText: "Diseñar wireframes" });
    await expect(row).toContainText("Proyecto Alfa");
    await expect(row).toContainText("01:30:00");

    await expect(page.getByText("1 registros")).toBeVisible();
    await expect(page.getByText("1 proyectos")).toBeVisible();
    await expect(page.getByText("01:30:00")).toHaveCount(2); // fila + Total de horas
  });

  test("muestra el estado vacío y navega a un mes sin Registros de Tiempo", async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date(2026, 6, 15, 12, 0, 0));

    await createProject(page, "Proyecto Beta");
    await createTask(page, "Proyecto Beta", "Documentación");
    await addManualEntry(page, "Proyecto Beta", "Documentación", "02:00");

    await page.goto("/history");
    await expect(page.getByText("Julio 2026")).toBeVisible();

    await page.getByRole("button", { name: "Mes anterior" }).click();
    await expect(page.getByText("Junio 2026")).toBeVisible();
    await expect(
      page.getByText("No hay Registros de Tiempo en este periodo."),
    ).toBeVisible();
    await expect(page.getByText("0 registros")).toBeVisible();
    await expect(page.getByText("0 proyectos")).toBeVisible();
  });

  test("navega entre mes anterior y mes siguiente recalculando el periodo", async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date(2026, 6, 15, 12, 0, 0));

    await page.goto("/history");
    await expect(page.getByText("Julio 2026")).toBeVisible();

    await page.getByRole("button", { name: "Mes anterior" }).click();
    await expect(page.getByText("Junio 2026")).toBeVisible();

    await page.getByRole("button", { name: "Mes siguiente" }).click();
    await expect(page.getByText("Julio 2026")).toBeVisible();
  });
});
