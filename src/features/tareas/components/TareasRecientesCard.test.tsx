import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { crearTareaDePrueba } from "@/shared/domain/object-mother";
import { TareasRecientesCard } from "./TareasRecientesCard";

describe("TareasRecientesCard", () => {
  it("muestra el estado vacío cuando no hay Tareas", () => {
    render(
      <TareasRecientesCard
        tareas={[]}
        onIniciarTemporizador={vi.fn()}
        onDetenerTemporizador={vi.fn()}
        onEditar={vi.fn()}
      />,
    );

    expect(screen.getByText(/Todavía no hay Tareas/)).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("muestra el encabezado con el enlace 'Ver Historial' hacia /historial", () => {
    render(
      <TareasRecientesCard
        tareas={[]}
        onIniciarTemporizador={vi.fn()}
        onDetenerTemporizador={vi.fn()}
        onEditar={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Tareas Recientes" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver Historial" })).toHaveAttribute(
      "href",
      "/historial",
    );
  });

  it("renderiza una fila por Tarea e inicia su temporizador al hacer clic en ▷", async () => {
    // Arrange
    const usuario = userEvent.setup();
    const tarea = crearTareaDePrueba({ nombre: "Diseñar wireframes" });
    const onIniciarTemporizador = vi.fn();
    render(
      <TareasRecientesCard
        tareas={[
          {
            tarea,
            nombreProyecto: "Proyecto Alpha",
            enEjecucion: false,
            duracionAcumuladaMinutos: 90,
          },
        ]}
        onIniciarTemporizador={onIniciarTemporizador}
        onDetenerTemporizador={vi.fn()}
        onEditar={vi.fn()}
      />,
    );

    const listado = screen.getByRole("list");
    expect(within(listado).getByText("Diseñar wireframes")).toBeInTheDocument();
    expect(within(listado).getByText("Proyecto Alpha")).toBeInTheDocument();

    // Act
    await usuario.click(
      screen.getByRole("button", {
        name: `Iniciar temporizador de ${tarea.nombre}`,
      }),
    );

    // Assert
    expect(onIniciarTemporizador).toHaveBeenCalledWith(tarea.id);
  });
});
