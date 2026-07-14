import { expect, test } from "@playwright/test";
import {
  seedRawLocalStorage,
  seedTimeTrackerStorage,
} from "./fixtures/seedTimeTracker";

test.describe("Historial de registros", () => {
  test("TC-001: muestra el historial completo con Tarea, Proyecto, fecha y duración", async ({
    page,
  }) => {
    // Arrange
    const creadoEn = "2026-01-01T00:00:00.000Z";
    const proyectoAlfa = { id: "P-1", nombre: "Alfa", creadoEn };
    const proyectoBeta = { id: "P-2", nombre: "Beta", creadoEn };
    const tareaDiseno = {
      id: "T-1",
      nombre: "Diseño UI",
      proyectoId: "P-1",
      creadoEn,
    };
    const tareaBackend = {
      id: "T-2",
      nombre: "Backend API",
      proyectoId: "P-2",
      creadoEn,
    };
    await seedTimeTrackerStorage(page, {
      proyectos: [proyectoAlfa, proyectoBeta],
      tareas: [tareaDiseno, tareaBackend],
      registrosDeTiempo: [
        {
          id: "RT-01",
          tareaId: "T-1",
          origen: "manual",
          fecha: "2026-05-10",
          duracionMinutos: 90,
          creadoEn,
        },
        {
          id: "RT-02",
          tareaId: "T-1",
          origen: "manual",
          fecha: "2026-05-12",
          duracionMinutos: 45,
          creadoEn,
        },
        {
          id: "RT-03",
          tareaId: "T-2",
          origen: "manual",
          fecha: "2026-06-01",
          duracionMinutos: 120,
          creadoEn,
        },
      ],
    });

    // Act
    await page.goto("/historial");

    // Assert
    const filas = page.getByRole("row");
    // 3 filas de datos + 1 fila de encabezado.
    await expect(filas).toHaveCount(4);
    await expect(page.getByRole("cell", { name: "Diseño UI" })).toHaveCount(2);
    await expect(page.getByRole("cell", { name: "Backend API" })).toHaveCount(
      1,
    );
    await expect(page.getByRole("cell", { name: "Alfa" })).toHaveCount(2);
    await expect(page.getByRole("cell", { name: "Beta" })).toHaveCount(1);
    // Total por Tarea de Diseño UI (90+45): aparece tanto en "Total por
    // Proyecto" (Alfa) como en "Total por Tarea" (Diseño UI).
    await expect(
      page.getByLabel("Total por Tarea").getByText("2h 15m"),
    ).toBeVisible();
  });

  test("TC-002: JSON corrupto en el almacenamiento no rompe la aplicación", async ({
    page,
  }) => {
    // Arrange
    await seedRawLocalStorage(page, "{esto-no-es-json-valido");
    const erroresNoControlados: Error[] = [];
    page.on("pageerror", (error) => erroresNoControlados.push(error));

    // Act
    const respuesta = await page.goto("/historial");

    // Assert
    expect(respuesta?.ok()).toBe(true);
    await expect(
      page.getByText("No hay registros de tiempo aún"),
    ).toBeVisible();
    expect(erroresNoControlados).toHaveLength(0);
  });

  test("TC-003: historial vacío se muestra sin errores", async ({ page }) => {
    // Arrange
    const erroresNoControlados: Error[] = [];
    page.on("pageerror", (error) => erroresNoControlados.push(error));

    // Act
    await page.goto("/historial");

    // Assert
    await expect(
      page.getByText("No hay registros de tiempo aún"),
    ).toBeVisible();
    await expect(page.getByRole("table")).toHaveCount(0);
    expect(erroresNoControlados).toHaveLength(0);
  });
});
