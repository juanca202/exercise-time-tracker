import { expect, test } from "@playwright/test";
import { seedTimeTrackerStorage } from "./fixtures/seedTimeTracker";

/**
 * TC-015: auditoría programática de estilos computados de la pantalla de
 * Historial de registros contra los tokens de `DESIGN.md` (tema
 * "Precision Focus"). No sustituye una revisión visual completa, pero
 * verifica que los tokens clave (color de fondo, tipografía Inter/JetBrains
 * Mono, radio de contenedor) efectivamente se aplican vía Tailwind (ADR-002)
 * y no están hardcodeados con otros valores.
 */
test.describe("Historial de registros — adherencia a DESIGN.md (AC-006)", () => {
  test("TC-015: colores, tipografía y radios coinciden con los tokens de Precision Focus", async ({
    page,
  }) => {
    // Arrange
    const creadoEn = "2026-01-01T00:00:00.000Z";
    await seedTimeTrackerStorage(page, {
      proyectos: [{ id: "P-1", nombre: "Alfa", creadoEn }],
      tareas: [{ id: "T-1", nombre: "Diseño UI", proyectoId: "P-1", creadoEn }],
      registrosDeTiempo: [
        {
          id: "RT-01",
          tareaId: "T-1",
          origen: "manual",
          fecha: "2026-05-10",
          duracionMinutos: 90,
          creadoEn,
        },
      ],
    });
    // Precalentamiento del navegador/bundle raíz antes de medir el nodo bajo
    // prueba (mismo criterio que TC-013/TC-014): evita que el costo fijo de
    // la primera navegación del worker sea parte de la auditoría de estilos.
    await page.goto("/");

    // Act
    await page.goto("/historial");
    await expect(page.getByRole("table")).toBeVisible();

    // Assert: fondo de página (--color-background: #f7f9fb)
    const fondoBody = await page
      .locator("body")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(fondoBody).toBe("rgb(247, 249, 251)");

    // Assert: tipografía Inter en el título de la pantalla
    const fuenteTitulo = await page
      .getByRole("heading", { name: "Historial de registros" })
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(fuenteTitulo).toContain("Inter");

    // Assert: tipografía JetBrains Mono (label-meta) en la duración tabulada
    const fuenteDuracion = await page
      .getByRole("cell", { name: "1h 30m" })
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(fuenteDuracion).toContain("JetBrains Mono");

    // Assert: radio de contenedor "lg" (0.5rem = 8px) en la tabla del historial
    const radioTabla = await page
      .getByRole("table")
      .locator("..")
      .evaluate((el) => getComputedStyle(el).borderRadius);
    expect(radioTabla).toBe("8px");
  });
});
