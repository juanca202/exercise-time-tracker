import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PeriodSelector } from "./PeriodSelector";

describe("PeriodSelector", () => {
  it("muestra el mes y año del periodo seleccionado", () => {
    render(
      <PeriodSelector
        year={2026}
        month={6}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />,
    );

    expect(screen.getByText("Julio 2026")).toBeVisible();
  });

  it("llama a onPrevious y onNext al hacer clic en los controles de navegación (TC-008)", async () => {
    const user = userEvent.setup();
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <PeriodSelector
        year={2026}
        month={6}
        onPrevious={onPrevious}
        onNext={onNext}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Mes anterior" }));
    await user.click(screen.getByRole("button", { name: "Mes siguiente" }));

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
