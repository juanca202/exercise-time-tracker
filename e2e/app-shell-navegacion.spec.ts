import { test, expect, type Page } from "@playwright/test";

/**
 * Pruebas E2E del app shell (US-000): navegación desde el layout raíz hacia
 * `/tareas`, `/proyectos` y `/historial` usando el sidebar (AC-007), sin
 * pasar por ninguna pantalla de login (AC-009) y con la red deshabilitada
 * hacia cualquier servicio externo (AC-011): solo se permiten solicitudes al
 * propio servidor de la aplicación bajo prueba.
 */

async function deshabilitarRedExterna(page: Page): Promise<void> {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    const esServidorLocal =
      url.hostname === "localhost" || url.hostname === "127.0.0.1";

    if (esServidorLocal) {
      await route.continue();
      return;
    }

    await route.abort();
  });
}

test.describe("app shell y navegación (US-000)", () => {
  test.beforeEach(async ({ page }) => {
    await deshabilitarRedExterna(page);
  });

  test("el sidebar navega a /tareas, /proyectos y /historial sin errores ni login", async ({
    page,
  }) => {
    const respuestaInicial = await page.goto("/");
    expect(respuestaInicial?.ok()).toBe(true);

    const nav = page.getByRole("navigation");
    await expect(nav.getByRole("link", { name: "Tareas" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Proyectos" })).toBeVisible();
    await expect(
      nav.getByRole("link", { name: "Historial de registros" }),
    ).toBeVisible();

    await nav.getByRole("link", { name: "Tareas" }).click();
    await expect(page).toHaveURL(/\/tareas$/);
    await expect(page.getByText("Próximamente")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "TimeTracker" }),
    ).toBeVisible();

    await nav.getByRole("link", { name: "Proyectos" }).click();
    await expect(page).toHaveURL(/\/proyectos$/);
    // Proyectos (US-001) reemplazó el stub "Próximamente" por la pantalla
    // final: verificamos su encabezado en lugar del texto de stub.
    await expect(
      page.getByRole("heading", { name: "Proyectos" }),
    ).toBeVisible();

    await nav.getByRole("link", { name: "Historial de registros" }).click();
    await expect(page).toHaveURL(/\/historial$/);
    await expect(page.getByText("Próximamente")).toBeVisible();
  });

  test.describe("acceso directo sin autenticación", () => {
    for (const ruta of ["/tareas", "/historial"] as const) {
      test(`${ruta} resuelve sin error y sin gate de acceso`, async ({
        page,
      }) => {
        const respuesta = await page.goto(ruta);

        expect(respuesta?.ok()).toBe(true);
        await expect(page.getByText("Próximamente")).toBeVisible();
        await expect(page.getByRole("navigation")).toBeVisible();
        expect(page.url()).toContain(ruta);
      });
    }

    // Proyectos (US-001) ya no es un stub: se verifica por separado que
    // resuelve sin error ni gate de acceso, con su propia pantalla final.
    test("/proyectos resuelve sin error y sin gate de acceso", async ({
      page,
    }) => {
      const respuesta = await page.goto("/proyectos");

      expect(respuesta?.ok()).toBe(true);
      await expect(
        page.getByRole("heading", { name: "Proyectos" }),
      ).toBeVisible();
      await expect(page.getByRole("navigation")).toBeVisible();
      expect(page.url()).toContain("/proyectos");
    });
  });
});
