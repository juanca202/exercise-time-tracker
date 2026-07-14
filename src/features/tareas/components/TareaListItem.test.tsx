import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TareaListItem } from "./TareaListItem";
import { unaTarea } from "../testing/object-mother";

describe("TareaListItem", () => {
  it("muestra el ícono ▷ y dispara iniciar el temporizador cuando la Tarea está inactiva", async () => {
    // Arrange
    const usuario = userEvent.setup();
    const tarea = unaTarea({ nombre: "Diseñar wireframes" });
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
    const tarea = unaTarea({ nombre: "Diseñar wireframes" });
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
    const tarea = unaTarea();
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
});
