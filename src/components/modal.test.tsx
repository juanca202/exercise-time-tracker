import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./modal";

describe("Modal", () => {
  it("should_render_content_when_open", () => {
    // Arrange & Act
    render(
      <Modal open onOpenChange={vi.fn()} title="Nuevo Proyecto">
        <p>Contenido del formulario</p>
      </Modal>,
    );

    // Assert
    expect(
      screen.getByRole("heading", { name: "Nuevo Proyecto" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Contenido del formulario")).toBeInTheDocument();
  });

  it("should_not_render_content_when_closed", () => {
    // Arrange & Act
    render(
      <Modal open={false} onOpenChange={vi.fn()} title="Nuevo Proyecto">
        <p>Contenido del formulario</p>
      </Modal>,
    );

    // Assert
    expect(
      screen.queryByText("Contenido del formulario"),
    ).not.toBeInTheDocument();
  });

  it("should_call_onOpenChange_with_false_when_close_button_is_clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Nuevo Proyecto">
        <p>Contenido</p>
      </Modal>,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Cerrar" }));

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
});
