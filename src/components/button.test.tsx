import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("should_invoke_onClick_when_clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);

    // Act
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should_not_invoke_onClick_when_disabled", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Guardar
      </Button>,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    // Assert
    expect(onClick).not.toHaveBeenCalled();
  });
});
