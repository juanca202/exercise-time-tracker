import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { colorFromString } from "@/shared/color-from-string";
import { FeaturedProjectCards } from "./featured-project-cards";

describe("FeaturedProjectCards", () => {
  it("no renderiza nada cuando la lista está vacía", () => {
    const { container } = render(<FeaturedProjectCards items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra el nombre y el tiempo de cada proyecto destacado", () => {
    render(
      <FeaturedProjectCards
        items={[
          {
            project: {
              id: "p1",
              name: "Quantum Redesign",
              description: "",
            },
            totalSeconds: 3600 * 13,
          },
          {
            project: { id: "p2", name: "Nexus App", description: "" },
            totalSeconds: 3600 * 9 + 60 * 30,
          },
        ]}
      />,
    );

    expect(screen.getByText("Quantum Redesign")).toBeInTheDocument();
    expect(screen.getByText("13h 00m")).toBeInTheDocument();
    expect(screen.getByText("Nexus App")).toBeInTheDocument();
    expect(screen.getByText("09h 30m")).toBeInTheDocument();
  });

  it("aplica colorFromString al fondo del icono, no al borde de la tarjeta", () => {
    render(
      <FeaturedProjectCards
        items={[
          {
            project: { id: "p1", name: "Quantum Redesign", description: "" },
            totalSeconds: 3600,
          },
        ]}
      />,
    );

    const icon = screen.getByTestId("featured-project-icon");
    expect(icon).toHaveStyle({
      backgroundColor: colorFromString("Quantum Redesign"),
    });
    expect(icon.parentElement?.parentElement).toHaveClass(
      "border-outline-variant",
    );
    expect(icon.parentElement?.parentElement).not.toHaveClass("border-l-4");
  });
});
