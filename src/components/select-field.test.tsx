import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectField } from "./select-field";

describe("SelectField", () => {
  it("should_show_placeholder_when_no_value_is_selected", () => {
    // Arrange & Act
    render(
      <SelectField
        label="Proyecto"
        value={null}
        onValueChange={vi.fn()}
        placeholder="Selecciona un proyecto"
        groups={[{ options: [{ value: "p1", label: "Proyecto 1" }] }]}
      />,
    );

    // Assert
    expect(screen.getByText("Selecciona un proyecto")).toBeInTheDocument();
  });

  it("should_call_onValueChange_when_an_option_is_selected", async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SelectField
        label="Proyecto"
        value={null}
        onValueChange={onValueChange}
        groups={[
          {
            options: [
              { value: "p1", label: "Proyecto 1" },
              { value: "p2", label: "Proyecto 2" },
            ],
          },
        ]}
      />,
    );

    // Act
    await user.click(screen.getByRole("combobox", { name: "Proyecto" }));
    await user.click(await screen.findByRole("option", { name: "Proyecto 2" }));

    // Assert
    expect(onValueChange).toHaveBeenCalledWith("p2");
  });

  it("should_be_disabled_when_there_are_no_options", () => {
    // Arrange & Act
    render(
      <SelectField
        label="Tarea"
        value={null}
        onValueChange={vi.fn()}
        groups={[{ options: [] }]}
      />,
    );

    // Assert
    expect(screen.getByRole("combobox", { name: "Tarea" })).toBeDisabled();
  });
});
