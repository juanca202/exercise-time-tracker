import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppStore } from "@/shared/store";
import { crearProyectoDePrueba } from "@/shared/domain/object-mother";
import { TareaFormModal } from "./TareaFormModal";

const proyectoAlpha = crearProyectoDePrueba({
  id: "proyecto-1",
  nombre: "Proyecto Alpha",
});
const proyectos = [{ id: proyectoAlpha.id, nombre: proyectoAlpha.nombre }];

function resetearStore(): void {
  window.localStorage.clear();
  useAppStore.setState({
    haHidratado: true,
    proyectos: [proyectoAlpha],
    tareas: [],
    registrosDeTiempo: [],
    temporizadorActivo: null,
  });
}

/**
 * Verifica accesibilidad básica del modal (foco, roles ARIA, navegación por
 * teclado), apoyándose en las garantías nativas de Base UI `Dialog`
 * (ADR-003): rol `dialog`, `aria-modal`, foco inicial dentro del modal y
 * cierre mediante Escape.
 */
describe("TareaFormModal · accesibilidad", () => {
  beforeEach(resetearStore);

  it("expone el rol 'dialog' asociado por ARIA a su título y descripción", () => {
    // Arrange & Act
    render(
      <TareaFormModal
        open
        modo="crear"
        proyectos={proyectos}
        onOpenChange={vi.fn()}
      />,
    );

    // Assert
    const dialogo = screen.getByRole("dialog");
    expect(dialogo).toHaveAccessibleName("Nueva Tarea");
    expect(dialogo.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("ubica el foco dentro del modal al abrirse", async () => {
    // Arrange & Act
    render(
      <TareaFormModal
        open
        modo="crear"
        proyectos={proyectos}
        onOpenChange={vi.fn()}
      />,
    );

    // Assert: el elemento con foco queda contenido en el diálogo
    const dialogo = screen.getByRole("dialog");
    await waitFor(() => {
      expect(dialogo).toContainElement(document.activeElement as HTMLElement);
    });
  });

  it("cierra el modal al presionar Escape", async () => {
    // Arrange
    const usuario = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <TareaFormModal
        open
        modo="crear"
        proyectos={proyectos}
        onOpenChange={onOpenChange}
      />,
    );

    // Act
    await usuario.keyboard("{Escape}");

    // Assert
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
  });

  it("marca los campos inválidos con aria-invalid y los asocia a su mensaje de error vía aria-describedby", async () => {
    // Arrange
    const usuario = userEvent.setup();
    render(
      <TareaFormModal
        open
        modo="crear"
        proyectos={proyectos}
        onOpenChange={vi.fn()}
      />,
    );

    // Act: confirmar sin completar ningún campo
    await usuario.click(screen.getByRole("button", { name: "Nueva Tarea" }));

    // Assert
    const campoProyecto = screen.getByLabelText("Proyecto");
    expect(campoProyecto).toHaveAttribute("aria-invalid", "true");
    const idDescripcion = campoProyecto.getAttribute("aria-describedby");
    expect(idDescripcion).toBeTruthy();
    expect(document.getElementById(idDescripcion as string)).toHaveTextContent(
      "El Proyecto es obligatorio.",
    );
  });
});
