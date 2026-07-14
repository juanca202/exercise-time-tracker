import { expect, test } from "@playwright/test";
import { generarDatosSinteticos } from "@/shared/testing/objectMother";
import { seedTimeTrackerStorage } from "./fixtures/seedTimeTracker";

const UMBRAL_MS = 2000;

test.describe("Historial de registros — rendimiento (AC-005)", () => {
  test("TC-013: 500 Registros de Tiempo sintéticos cargan e interactúan en menos de 2000 ms", async ({
    page,
  }) => {
    // Arrange
    await seedTimeTrackerStorage(page, generarDatosSinteticos(500));
    // Navegación de precalentamiento: el usuario ya está en la app (p. ej.
    // en Tareas) y navega a Historial vía el Sidebar -- no arranca desde un
    // navegador recién lanzado. Excluye del umbral el costo fijo de lanzar
    // Chromium/compilar el bundle raíz, ajeno al rendimiento de esta
    // pantalla (AC-005 mide "desde el inicio de la navegación" a Historial).
    await page.goto("/");

    // Act
    const t0 = Date.now();
    await page.goto("/historial", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText("Total por Proyecto")).toBeVisible();
    const t1 = Date.now();

    // Assert
    expect(t1 - t0).toBeLessThan(UMBRAL_MS);
  });

  test("TC-014: 1000 Registros de Tiempo (volumen máximo) cargan sin congelar la interfaz", async ({
    page,
  }) => {
    // Arrange
    await seedTimeTrackerStorage(page, generarDatosSinteticos(1000));
    const erroresNoControlados: Error[] = [];
    page.on("pageerror", (error) => erroresNoControlados.push(error));
    await page.goto("/"); // Precalentamiento, ver TC-013.

    // Act
    const t0 = Date.now();
    await page.goto("/historial", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText("Total por Proyecto")).toBeVisible();
    await expect(page.getByText("Total por mes")).toBeVisible();
    const t1 = Date.now();

    // La interfaz responde a una interacción simple (scroll) sin congelarse.
    await page.mouse.wheel(0, 400);

    // Assert
    expect(t1 - t0).toBeLessThan(UMBRAL_MS);
    expect(erroresNoControlados).toHaveLength(0);
    await expect(page.getByRole("row")).toHaveCount(1001); // 1000 filas + encabezado
  });
});
