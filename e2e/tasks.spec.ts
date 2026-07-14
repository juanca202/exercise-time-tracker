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
  await page.getByRole("button", { name: "Nueva Tarea", exact: true }).click();
  await page.getByLabel("Proyecto", { exact: true }).click();
  await page.getByRole("option", { name: projectName }).click();
  await page.getByLabel("Nombre").fill(taskName);
  await page.getByRole("button", { name: "Crear Tarea" }).click();
}

test.describe("Tareas", () => {
  test("crear una Tarea, iniciar y detener su temporizador registra el tiempo", async ({
    page,
  }) => {
    await createProject(page, "Proyecto Alfa");
    await page.goto("/tasks");
    await createTask(page, "Proyecto Alfa", "Diseñar wireframes");

    const row = page
      .getByRole("listitem")
      .filter({ hasText: "Diseñar wireframes" });
    await expect(row).toBeVisible();

    await row.getByRole("button", { name: /Iniciar temporizador/ }).click();
    await expect(
      page.getByRole("heading", { name: "Diseñar wireframes", level: 2 }),
    ).toBeVisible();
    await expect(row.getByText("En Ejecución")).toBeVisible();

    await page.waitForTimeout(1100);
    await page.getByRole("button", { name: "Detener Sesión" }).click();

    await expect(row.getByText("En Ejecución")).not.toBeVisible();
    await expect(
      page.getByText("No tenés ningún temporizador activo."),
    ).toBeVisible();
    await expect(row).not.toContainText("00:00:00");
  });

  test("al iniciar el temporizador de otra Tarea, detiene y persiste el anterior (BR-02)", async ({
    page,
  }) => {
    await createProject(page, "Proyecto Alfa");
    await page.goto("/tasks");
    await createTask(page, "Proyecto Alfa", "Tarea A");
    await createTask(page, "Proyecto Alfa", "Tarea B");

    const rowA = page.getByRole("listitem").filter({ hasText: "Tarea A" });
    const rowB = page.getByRole("listitem").filter({ hasText: "Tarea B" });

    await rowA.getByRole("button", { name: /Iniciar temporizador/ }).click();
    await expect(rowA.getByText("En Ejecución")).toBeVisible();

    await page.waitForTimeout(1100);
    await rowB.getByRole("button", { name: /Iniciar temporizador/ }).click();

    await expect(rowB.getByText("En Ejecución")).toBeVisible();
    await expect(rowA.getByText("En Ejecución")).not.toBeVisible();
    await expect(rowA).not.toContainText("00:00:00");
    await expect(
      page.getByRole("heading", { name: "Tarea B", level: 2 }),
    ).toBeVisible();
  });

  test("crea un Registro de Tiempo manual válido y rechaza una Duración inválida", async ({
    page,
  }) => {
    await createProject(page, "Proyecto Alfa");
    await page.goto("/tasks");
    await createTask(page, "Proyecto Alfa", "Diseñar wireframes");

    await page.getByLabel("Proyecto / Tarea").click();
    await page
      .getByRole("option", { name: "Proyecto Alfa — Diseñar wireframes" })
      .click();
    await page.getByPlaceholder("02:30").fill("abc");
    await page.getByRole("button", { name: "Guardar Registro" }).click();

    await expect(page.getByText(/Duración válida/)).toBeVisible();
    const row = page
      .getByRole("listitem")
      .filter({ hasText: "Diseñar wireframes" });
    await expect(row).toContainText("00:00:00");

    await page.getByPlaceholder("02:30").fill("01:30");
    await page.getByRole("button", { name: "Guardar Registro" }).click();

    await expect(row).toContainText("01:30:00");
  });

  test("la Tarea y el Registro de Tiempo manual persisten tras recargar la app (AC-002, AC-010)", async ({
    page,
  }) => {
    await createProject(page, "Proyecto Alfa");
    await page.goto("/tasks");
    await createTask(page, "Proyecto Alfa", "Diseñar wireframes");

    await page.getByLabel("Proyecto / Tarea").click();
    await page
      .getByRole("option", { name: "Proyecto Alfa — Diseñar wireframes" })
      .click();
    await page.getByPlaceholder("02:30").fill("02:00");
    await page.getByRole("button", { name: "Guardar Registro" }).click();

    const row = page
      .getByRole("listitem")
      .filter({ hasText: "Diseñar wireframes" });
    await expect(row).toContainText("02:00:00");

    await page.reload();

    await expect(
      page.getByRole("heading", { name: "Diseñar wireframes" }),
    ).toBeVisible();
    await expect(page.getByText("Proyecto Alfa")).toBeVisible();
    await expect(row).toContainText("02:00:00");
  });
});
