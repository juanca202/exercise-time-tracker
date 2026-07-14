import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppStore } from "@/shared/store";
import {
  crearProyectoDePrueba,
  crearTareaDePrueba,
} from "@/shared/domain/object-mother";
import { RegistroManualForm } from "./RegistroManualForm";

const proyecto = crearProyectoDePrueba({ nombre: "Proyecto Alpha" });
const tarea = crearTareaDePrueba({
  nombre: "Diseñar wireframes",
  proyectoId: proyecto.id,
});

function resetearStore(): void {
  window.localStorage.clear();
  useAppStore.setState({
    haHidratado: true,
    proyectos: [proyecto],
    tareas: [tarea],
    registrosDeTiempo: [],
    temporizadorActivo: null,
  });
}

describe("RegistroManualForm", () => {
  beforeEach(resetearStore);

  it("combina Proyecto y Tarea en cada opción del selector", () => {
    render(
      <RegistroManualForm
        tareas={[
          {
            id: tarea.id,
            nombre: tarea.nombre,
            nombreProyecto: proyecto.nombre,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("option", {
        name: "Proyecto Alpha / Diseñar wireframes",
      }),
    ).toBeInTheDocument();
  });

  it("mantiene el envío deshabilitado hasta completar Tarea, Fecha y Duración", async () => {
    const usuario = userEvent.setup();
    render(
      <RegistroManualForm
        tareas={[
          {
            id: tarea.id,
            nombre: tarea.nombre,
            nombreProyecto: proyecto.nombre,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Guardar Registro" }),
    ).toBeDisabled();

    await usuario.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      tarea.id,
    );
    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-07-13" },
    });
    await usuario.type(screen.getByLabelText("Duración"), "01:00");

    expect(
      screen.getByRole("button", { name: "Guardar Registro" }),
    ).toBeEnabled();
  });

  it("rechaza un formato de Duración inválido con un mensaje de error", async () => {
    const usuario = userEvent.setup();
    render(
      <RegistroManualForm
        tareas={[
          {
            id: tarea.id,
            nombre: tarea.nombre,
            nombreProyecto: proyecto.nombre,
          },
        ]}
      />,
    );

    await usuario.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      tarea.id,
    );
    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-07-13" },
    });
    await usuario.type(screen.getByLabelText("Duración"), "abc");
    fireEvent.submit(
      screen.getByRole("button", { name: "Guardar Registro" }).closest("form")!,
    );

    expect(
      screen.getByText("Ingresa la Duración en formato HH:MM (ej. 02:30)."),
    ).toBeInTheDocument();
    expect(useAppStore.getState().registrosDeTiempo).toHaveLength(0);
  });

  it("rechaza una Duración igual a cero (BR-04)", async () => {
    const usuario = userEvent.setup();
    render(
      <RegistroManualForm
        tareas={[
          {
            id: tarea.id,
            nombre: tarea.nombre,
            nombreProyecto: proyecto.nombre,
          },
        ]}
      />,
    );

    await usuario.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      tarea.id,
    );
    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-07-13" },
    });
    await usuario.type(screen.getByLabelText("Duración"), "00:00");
    fireEvent.submit(
      screen.getByRole("button", { name: "Guardar Registro" }).closest("form")!,
    );

    expect(
      screen.getByText("La Duración debe ser mayor que cero."),
    ).toBeInTheDocument();
    expect(useAppStore.getState().registrosDeTiempo).toHaveLength(0);
  });

  it("crea el Registro, limpia el formulario y notifica onRegistroCreado ante un envío válido", async () => {
    const usuario = userEvent.setup();
    const onRegistroCreado = vi.fn();
    render(
      <RegistroManualForm
        tareas={[
          {
            id: tarea.id,
            nombre: tarea.nombre,
            nombreProyecto: proyecto.nombre,
          },
        ]}
        onRegistroCreado={onRegistroCreado}
      />,
    );

    await usuario.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      tarea.id,
    );
    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-07-13" },
    });
    await usuario.type(screen.getByLabelText("Duración"), "02:30");
    await usuario.click(
      screen.getByRole("button", { name: "Guardar Registro" }),
    );

    expect(onRegistroCreado).toHaveBeenCalled();
    expect(useAppStore.getState().registrosDeTiempo).toHaveLength(1);
    expect(useAppStore.getState().registrosDeTiempo[0]).toMatchObject({
      tareaId: tarea.id,
      fecha: "2026-07-13",
      duracionMinutos: 150,
      origen: "manual",
    });
    expect(screen.getByLabelText("Duración")).toHaveValue("");
  });
});
