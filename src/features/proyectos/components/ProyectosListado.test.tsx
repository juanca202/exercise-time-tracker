import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import type { Proyecto } from "@/shared/domain";
import { useStoreRaiz } from "@/shared/store";
import { ProyectosListado } from "./ProyectosListado";

/** Object Mother: construye un Proyecto persistido completo. */
const unProyecto = (overrides: Partial<Proyecto> = {}): Proyecto => ({
  id: "proyecto-1",
  nombre: "Proyecto A",
  descripcion: "Descripción A",
  creadoEn: "2026-07-13T10:00:00.000Z",
  actualizadoEn: "2026-07-13T10:00:00.000Z",
  ...overrides,
});

const reiniciarStore = (proyectos: Proyecto[] = []): void => {
  useStoreRaiz.setState({
    haHidratado: true,
    proyectos,
    tareas: [],
    registrosDeTiempo: [],
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
});
