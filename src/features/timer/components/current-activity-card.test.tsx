import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CurrentActivityCard } from "./current-activity-card";

const task = { id: "t1", projectId: "p1", name: "Refinando Logotipos" };
const project = { id: "p1", name: "Brand Redesign", description: "" };

describe("CurrentActivityCard", () => {
  it("muestra el estado inactivo cuando no hay temporizador activo", () => {
    render(
      <CurrentActivityCard
        activeTimer={null}
        task={undefined}
        project={undefined}
        onStop={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Ningún temporizador en ejecución"),
    ).toBeInTheDocument();
  });

  it('invoca onStop al hacer clic en "Detener Sesión"', async () => {
    const onStop = vi.fn();
    render(
      <CurrentActivityCard
        activeTimer={{ taskId: "t1", startTime: "2026-07-30T09:15:00.000Z" }}
        task={task}
        project={project}
        onStop={onStop}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Detener Sesión/ }),
    );

    expect(onStop).toHaveBeenCalledOnce();
  });

  describe("con reloj simulado", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-30T09:16:10.000Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("muestra la Tarea, el Proyecto y el tiempo transcurrido tras el primer tick", () => {
      render(
        <CurrentActivityCard
          activeTimer={{ taskId: "t1", startTime: "2026-07-30T09:15:00.000Z" }}
          task={task}
          project={project}
          onStop={vi.fn()}
        />,
      );

      expect(screen.getByText("Refinando Logotipos")).toBeInTheDocument();
      expect(screen.getByText("Brand Redesign")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText("00:01:11")).toBeInTheDocument();
    });
  });
});
