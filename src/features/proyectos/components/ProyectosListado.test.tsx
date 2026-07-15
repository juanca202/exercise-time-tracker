import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import type { Proyecto, RegistroDeTiempo, Tarea } from "@/shared/domain";
import { useAppStore } from "@/shared/store";
import { ProyectosListado } from "./ProyectosListado";

/** Object Mother: construye un Proyecto persistido completo. */
const unProyecto = (overrides: Partial<Proyecto> = {}): Proyecto => ({
  id: "proyecto-1",
  nombre: "Proyecto A",
  descripcion: "Descripción A",
  creadoEn: "2026-07-13T10:00:00.000Z",
  ...overrides,
});

/** Object Mother: construye una Tarea perteneciente a un Proyecto. */
const unaTarea = (overrides: Partial<Tarea> = {}): Tarea => ({
  id: "tarea-1",
  proyectoId: "proyecto-1",
  nombre: "Tarea A",
  creadoEn: "2026-07-13T10:00:00.000Z",
  ...overrides,
});

/** Object Mother: construye un Registro de Tiempo de una Tarea. */
const unRegistro = (
  overrides: Partial<RegistroDeTiempo> = {},
): RegistroDeTiempo => ({
  id: "registro-1",
  tareaId: "tarea-1",
  fecha: "2026-07-13",
  duracionMinutos: 60,
  origen: "manual",
  creadoEn: "2026-07-13T10:00:00.000Z",
  ...overrides,
});

const reiniciarStore = (
  proyectos: Proyecto[] = [],
  tareas: Tarea[] = [],
  registrosDeTiempo: RegistroDeTiempo[] = [],
): void => {
  useAppStore.setState({
    haHidratado: true,
    proyectos,
    tareas,
    registrosDeTiempo,
    temporizadorActivo: null,
  });
};

describe("ProyectosListado", () => {
  beforeEach(() => {
    reiniciarStore();
  });

  // TC-008
  it("muestra el estado vacío sin errores cuando no existen Proyectos", () => {
    render(<ProyectosListado />);

    expect(screen.getByTestId("proyectos-listado-vacio")).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  // TC-007
  it("renderiza todos los Proyectos existentes sin omitir ninguno", () => {
    reiniciarStore([
      unProyecto({ id: "proyecto-1", nombre: "Proyecto A" }),
      unProyecto({ id: "proyecto-2", nombre: "Proyecto B" }),
    ]);

    render(<ProyectosListado />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Proyecto A")).toBeInTheDocument();
    expect(screen.getByText("Proyecto B")).toBeInTheDocument();
  });

  it("abre el modal en modo creación al hacer clic en 'Nuevo Proyecto'", async () => {
    const usuario = userEvent.setup();
    render(<ProyectosListado />);

    await usuario.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));

    const dialogo = screen.getByRole("dialog");
    expect(
      within(dialogo).getByRole("heading", { name: "Nuevo Proyecto" }),
    ).toBeInTheDocument();
    expect(within(dialogo).getByLabelText("Nombre")).toHaveValue("");
  });

  it("abre el modal en modo edición precargado al hacer clic en 'Editar' de una tarjeta", async () => {
    reiniciarStore([
      unProyecto({ nombre: "Proyecto A", descripcion: "Desc A" }),
    ]);
    const usuario = userEvent.setup();
    render(<ProyectosListado />);

    await usuario.click(screen.getByRole("button", { name: "Editar" }));

    const dialogo = screen.getByRole("dialog");
    expect(
      within(dialogo).getByRole("heading", { name: "Editar Proyecto" }),
    ).toBeInTheDocument();
    expect(within(dialogo).getByLabelText("Nombre")).toHaveValue("Proyecto A");
    expect(within(dialogo).getByPlaceholderText(/Descripción/)).toHaveValue(
      "Desc A",
    );
  });

  // AC-003: la tarjeta de Proyecto muestra el Tiempo Registrado, reutilizando
  // `calcularTotalPorProyecto` (Historial de registros) sobre las Tareas y
  // Registros de Tiempo del store, en formato "HH:MM".
  it("muestra el Tiempo Registrado del Proyecto como la suma de los Registros de sus Tareas", () => {
    reiniciarStore(
      [unProyecto({ id: "proyecto-1", nombre: "Proyecto A" })],
      [unaTarea({ id: "tarea-1", proyectoId: "proyecto-1" })],
      [
        unRegistro({
          id: "registro-1",
          tareaId: "tarea-1",
          duracionMinutos: 90,
        }),
        unRegistro({
          id: "registro-2",
          tareaId: "tarea-1",
          duracionMinutos: 45,
        }),
      ],
    );

    render(<ProyectosListado />);

    expect(screen.getByText("Tiempo Registrado")).toBeInTheDocument();
    // 90 + 45 = 135 minutos = 02:15.
    expect(screen.getByText("02:15")).toBeInTheDocument();
  });

  it("muestra '00:00' de Tiempo Registrado para un Proyecto sin Registros de Tiempo", () => {
    reiniciarStore([unProyecto({ id: "proyecto-1", nombre: "Proyecto A" })]);

    render(<ProyectosListado />);

    expect(screen.getByText("00:00")).toBeInTheDocument();
  });

  // Tarjeta "ghost": segundo disparador del mismo modal de creación, además
  // del botón "Nuevo Proyecto" del TopAppBar.
  it("abre el modal en modo creación al hacer clic en la tarjeta 'Crear Nuevo Proyecto'", async () => {
    reiniciarStore([unProyecto({ nombre: "Proyecto A" })]);
    const usuario = userEvent.setup();
    render(<ProyectosListado />);

    await usuario.click(
      screen.getByRole("button", { name: "Crear Nuevo Proyecto" }),
    );

    const dialogo = screen.getByRole("dialog");
    expect(
      within(dialogo).getByRole("heading", { name: "Nuevo Proyecto" }),
    ).toBeInTheDocument();
    expect(within(dialogo).getByLabelText("Nombre")).toHaveValue("");
  });

  it("muestra la tarjeta 'Crear Nuevo Proyecto' incluso cuando ya existen Proyectos", () => {
    reiniciarStore([unProyecto({ nombre: "Proyecto A" })]);

    render(<ProyectosListado />);

    expect(
      screen.getByRole("button", { name: "Crear Nuevo Proyecto" }),
    ).toBeInTheDocument();
    // La tarjeta ghost no es un Proyecto: no debe contarse como `listitem`.
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("muestra la tarjeta 'Crear Nuevo Proyecto' también en el estado vacío", () => {
    render(<ProyectosListado />);

    expect(screen.getByTestId("proyectos-listado-vacio")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear Nuevo Proyecto" }),
    ).toBeInTheDocument();
  });
});
