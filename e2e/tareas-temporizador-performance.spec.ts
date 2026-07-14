import { test, expect } from "@playwright/test";

const CLAVE_ALMACENAMIENTO = "time-tracker:estado";

const ESTADO_SEMILLA = {
  version: 1,
  proyectos: [{ id: "proyecto-1", nombre: "Proyecto Alpha", descripcion: "" }],
  tareas: [
    { id: "tarea-1", proyectoId: "proyecto-1", nombre: "Diseñar wireframes" },
  ],
  registrosDeTiempo: [],
  temporizadorActivo: null,
};

test.describe("Temporizador · rendimiento (AC-012, TC-013)", () => {
  test.beforeEach(async ({ page }) => {
    // Siembra el almacenamiento local con un Proyecto y una Tarea existentes
    // antes de que cargue cualquier script de la app, para poder ejercitar
    // el temporizador sin depender del CRUD de Proyectos (fuera de alcance
    // de esta historia).
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

  test("inicia y detiene el temporizador en menos de 1 segundo (AC-012)", async ({
    page,
  }) => {
    const botonIniciar = page.getByRole("button", {
      name: "Iniciar temporizador de Diseñar wireframes",
    });

    await page.evaluate(() => performance.mark("click-iniciar"));
    await botonIniciar.click();
    await expect(page.getByText("En Ejecución")).toBeVisible();
    await page.evaluate(() => performance.mark("temporizador-en-ejecucion"));

    const duracionInicioMs = await page.evaluate(() => {
      performance.measure(
        "duracion-inicio",
        "click-iniciar",
        "temporizador-en-ejecucion",
      );
      return performance.getEntriesByName("duracion-inicio")[0].duration;
    });
    expect(duracionInicioMs).toBeLessThan(1000);

    const botonDetener = page.getByRole("button", {
      name: "Detener temporizador de Diseñar wireframes",
    });

    await page.evaluate(() => performance.mark("click-detener"));
    await botonDetener.click();
    await expect(page.getByText("En Ejecución")).not.toBeVisible();
    await page.evaluate(() => performance.mark("temporizador-detenido"));

    const duracionDetenerMs = await page.evaluate(() => {
      performance.measure(
        "duracion-detener",
        "click-detener",
        "temporizador-detenido",
      );
      return performance.getEntriesByName("duracion-detener")[0].duration;
    });
    expect(duracionDetenerMs).toBeLessThan(1000);

    // El Registro de Tiempo debe quedar persistido de forma inmediata
    // (AC-010), sin requerir una acción adicional del usuario.
    const estadoPersistido = await page.evaluate(
      (clave) => JSON.parse(window.localStorage.getItem(clave) ?? "{}"),
      CLAVE_ALMACENAMIENTO,
    );
    expect(estadoPersistido.registrosDeTiempo).toHaveLength(1);
    expect(estadoPersistido.registrosDeTiempo[0]).toMatchObject({
      tareaId: "tarea-1",
      origen: "temporizador",
    });
    expect(estadoPersistido.registrosDeTiempo[0].duracionMs).toBeGreaterThan(0);
    expect(estadoPersistido.temporizadorActivo).toBeNull();
  });
});
