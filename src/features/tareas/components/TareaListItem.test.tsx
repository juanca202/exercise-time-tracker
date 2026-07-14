import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { crearTareaDePrueba } from "@/shared/domain/object-mother";
import { TareaListItem } from "./TareaListItem";

describe("TareaListItem", () => {
  it("muestra el ícono ▷ y dispara iniciar el temporizador cuando la Tarea está inactiva", async () => {
    // Arrange
    const usuario = userEvent.setup();
    const tarea = crearTareaDePrueba({ nombre: "Diseñar wireframes" });
    const onIniciarTemporizador = vi.fn();
    render(
      <TareaListItem
        tarea={tarea}
        nombreProyecto="Proyecto Alpha"
        enEjecucion={false}
        onIniciarTemporizador={onIniciarTemporizador}
        onDetenerTemporizador={vi.fn()}
        onEditar={vi.fn()}
      />,
    );

    // Assert: estado inactivo
    expect(screen.queryByText("En Ejecución")).not.toBeInTheDocument();

    // Act
    await usuario.click(
      screen.getByRole("button", {
        name: `Iniciar temporizador de ${tarea.nombre}`,
      }),
    );

    // Assert
    expect(onIniciarTemporizador).toHaveBeenCalledWith(tarea.id);
  });

  it("muestra 'En Ejecución' y el control de detener cuando la Tarea está activa", async () => {
    // Arrange
    const usuario = userEvent.setup();
    const tarea = crearTareaDePrueba({ nombre: "Diseñar wireframes" });
    const onDetenerTemporizador = vi.fn();
    render(
      <TareaListItem
        tarea={tarea}
        nombreProyecto="Proyecto Alpha"
        enEjecucion
        onIniciarTemporizador={vi.fn()}
        onDetenerTemporizador={onDetenerTemporizador}
        onEditar={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByText("En Ejecución")).toBeInTheDocument();

    // Act
    await usuario.click(
      screen.getByRole("button", {
        name: `Detener temporizador de ${tarea.nombre}`,
      }),
    );

    // Assert
    expect(onDetenerTemporizador).toHaveBeenCalled();
  });

  it("dispara la acción de editar sobre la Tarea correspondiente", async () => {
    // Arrange
    const usuario = userEvent.setup();
    const tarea = crearTareaDePrueba();
    const onEditar = vi.fn();
    render(
      <TareaListItem
        tarea={tarea}
        nombreProyecto="Proyecto Alpha"
        enEjecucion={false}
        onIniciarTemporizador={vi.fn()}
        onDetenerTemporizador={vi.fn()}
        onEditar={onEditar}
      />,
    );

    // Act
    await usuario.click(
      screen.getByRole("button", { name: `Editar ${tarea.nombre}` }),
    );

    // Assert
    expect(onEditar).toHaveBeenCalledWith(tarea);
  });

  it("muestra la Duración acumulada formateada como HH:MM:SS", () => {
    // Arrange & Act
    const tarea = crearTareaDePrueba({ nombre: "Diseñar wireframes" });
    render(
      <TareaListItem
        tarea={tarea}
        nombreProyecto="Proyecto Alpha"
        enEjecucion={false}
        duracionAcumuladaMinutos={90}
        onIniciarTemporizador={vi.fn()}
        onDetenerTemporizador={vi.fn()}
        onEditar={vi.fn()}
      />,
    );

    // Assert: 90 minutos = 01:30:00
    expect(screen.getByText("01:30:00")).toBeInTheDocument();
  });

  it("muestra el texto de recencia cuando se provee ultimaActividadEn", () => {
    // Arrange & Act
    const tarea = crearTareaDePrueba({ nombre: "Diseñar wireframes" });
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    render(
      <TareaListItem
        tarea={tarea}
        nombreProyecto="Proyecto Alpha"
        enEjecucion={false}
        ultimaActividadEn={haceUnaHora}
        onIniciarTemporizador={vi.fn()}
        onDetenerTemporizador={vi.fn()}
        onEditar={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByText("hace 1h")).toBeInTheDocument();
  });

  it("no muestra ningún texto de recencia cuando no se provee ultimaActividadEn", () => {
    // Arrange & Act
    const tarea = crearTareaDePrueba({ nombre: "Diseñar wireframes" });
    render(
      <TareaListItem
        tarea={tarea}
        nombreProyecto="Proyecto Alpha"
        enEjecucion={false}
        onIniciarTemporizador={vi.fn()}
        onDetenerTemporizador={vi.fn()}
        onEditar={vi.fn()}
      />,
    );

    // Assert
    expect(screen.queryByText(/^hace /)).not.toBeInTheDocument();
    expect(screen.queryByText("Ayer")).not.toBeInTheDocument();
  });
});
