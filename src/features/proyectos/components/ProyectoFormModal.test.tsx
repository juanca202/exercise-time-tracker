import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Proyecto } from "@/shared/domain";
import { useStoreRaiz } from "@/shared/store";
import { ProyectoFormModal } from "./ProyectoFormModal";

/** Object Mother: construye un Proyecto persistido completo. */
const unProyecto = (overrides: Partial<Proyecto> = {}): Proyecto => ({
  id: "proyecto-1",
  nombre: "Proyecto original",
  descripcion: "Descripción original",
  creadoEn: "2026-07-13T10:00:00.000Z",
  actualizadoEn: "2026-07-13T10:00:00.000Z",
  ...overrides,
});

const reiniciarStore = (proyectos: Proyecto[] = []): void => {
  useStoreRaiz.setState({
    haHidratado: true,
    proyectos,
    tareas: [],
    registrosDeTiempo: [],
    temporizadorActivo: null,
  });
};

describe("ProyectoFormModal - creación", () => {
  beforeEach(() => {
    reiniciarStore();
  });

  // TC-001
  it("crea el Proyecto con Nombre y Descripción completos y cierra el modal sin errores", async () => {
    const usuario = userEvent.setup();
    const onCerrar = vi.fn();
    render(<ProyectoFormModal abierto onCerrar={onCerrar} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Proyecto nuevo");
    await usuario.type(
      screen.getByPlaceholderText(/Descripción/),
      "Una descripción",
    );
    await usuario.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));

    expect(onCerrar).toHaveBeenCalledTimes(1);
    const proyectos = useStoreRaiz.getState().listarProyectos();
    expect(proyectos).toHaveLength(1);
    expect(proyectos[0]).toMatchObject({
      nombre: "Proyecto nuevo",
      descripcion: "Una descripción",
    });
  });

  // TC-002
  it("crea el Proyecto solo con Nombre sin bloquear el guardado por falta de Descripción", async () => {
    const usuario = userEvent.setup();
    const onCerrar = vi.fn();
    render(<ProyectoFormModal abierto onCerrar={onCerrar} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Solo nombre");
    await usuario.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));

    expect(onCerrar).toHaveBeenCalledTimes(1);
    const proyectos = useStoreRaiz.getState().listarProyectos();
    expect(proyectos[0]).toMatchObject({
      nombre: "Solo nombre",
      descripcion: "",
    });
  });

  // TC-003
  it("bloquea la creación con Nombre vacío, mantiene el modal abierto y muestra el error", async () => {
    const usuario = userEvent.setup();
    const onCerrar = vi.fn();
    render(<ProyectoFormModal abierto onCerrar={onCerrar} />);

    await usuario.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));

    expect(onCerrar).not.toHaveBeenCalled();
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(useStoreRaiz.getState().listarProyectos()).toHaveLength(0);
  });

  // TC-004
  it("bloquea la creación cuando el Nombre contiene solo espacios en blanco", async () => {
    const usuario = userEvent.setup();
    const onCerrar = vi.fn();
    render(<ProyectoFormModal abierto onCerrar={onCerrar} />);

    await usuario.type(screen.getByLabelText("Nombre"), "    ");
    await usuario.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));

    expect(onCerrar).not.toHaveBeenCalled();
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(useStoreRaiz.getState().listarProyectos()).toHaveLength(0);
  });
});

describe("ProyectoFormModal - edición", () => {
  beforeEach(() => {
    reiniciarStore([unProyecto()]);
  });

  // TC-009
  it("precarga Nombre y Descripción y persiste los cambios al confirmar", async () => {
    const usuario = userEvent.setup();
    const onCerrar = vi.fn();
    const proyecto = useStoreRaiz.getState().listarProyectos()[0]!;

    render(
      <ProyectoFormModal abierto onCerrar={onCerrar} proyecto={proyecto} />,
    );

    expect(
      screen.getByRole("heading", { name: "Editar Proyecto" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Proyecto original");

    await usuario.clear(screen.getByLabelText("Nombre"));
    await usuario.type(screen.getByLabelText("Nombre"), "Proyecto editado");
    await usuario.clear(screen.getByPlaceholderText(/Descripción/));
    await usuario.type(
      screen.getByPlaceholderText(/Descripción/),
      "Descripción editada",
    );
    await usuario.click(
      screen.getByRole("button", { name: "Editar Proyecto" }),
    );

    expect(onCerrar).toHaveBeenCalledTimes(1);
    const actualizado = useStoreRaiz.getState().listarProyectos()[0];
    expect(actualizado).toMatchObject({
      nombre: "Proyecto editado",
      descripcion: "Descripción editada",
    });
  });

  // TC-010
  it("permite vaciar la Descripción sin mostrar error de validación", async () => {
    const usuario = userEvent.setup();
    const onCerrar = vi.fn();
    const proyecto = useStoreRaiz.getState().listarProyectos()[0]!;

    render(
      <ProyectoFormModal abierto onCerrar={onCerrar} proyecto={proyecto} />,
    );

    await usuario.clear(screen.getByPlaceholderText(/Descripción/));
    await usuario.click(
      screen.getByRole("button", { name: "Editar Proyecto" }),
    );

    expect(onCerrar).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText("El nombre es obligatorio."),
    ).not.toBeInTheDocument();
    const actualizado = useStoreRaiz.getState().listarProyectos()[0];
    expect(actualizado).toMatchObject({
      nombre: "Proyecto original",
      descripcion: "",
    });
  });

  // TC-011
  it("bloquea el guardado con Nombre vacío y conserva el Nombre original", async () => {
    const usuario = userEvent.setup();
    const onCerrar = vi.fn();
    const proyecto = useStoreRaiz.getState().listarProyectos()[0]!;

    render(
      <ProyectoFormModal abierto onCerrar={onCerrar} proyecto={proyecto} />,
    );

    await usuario.clear(screen.getByLabelText("Nombre"));
    await usuario.click(
      screen.getByRole("button", { name: "Editar Proyecto" }),
    );

    expect(onCerrar).not.toHaveBeenCalled();
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    const proyectoTrasIntento = useStoreRaiz.getState().listarProyectos()[0];
    expect(proyectoTrasIntento?.nombre).toBe("Proyecto original");
  });

  // TC-012
  it("bloquea el guardado cuando el Nombre se reemplaza solo por espacios y conserva el Nombre original", async () => {
    const usuario = userEvent.setup();
    const onCerrar = vi.fn();
    const proyecto = useStoreRaiz.getState().listarProyectos()[0]!;

    render(
      <ProyectoFormModal abierto onCerrar={onCerrar} proyecto={proyecto} />,
    );

    await usuario.clear(screen.getByLabelText("Nombre"));
    await usuario.type(screen.getByLabelText("Nombre"), "    ");
    await usuario.click(
      screen.getByRole("button", { name: "Editar Proyecto" }),
    );

    expect(onCerrar).not.toHaveBeenCalled();
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    const proyectoTrasIntento = useStoreRaiz.getState().listarProyectos()[0];
    expect(proyectoTrasIntento?.nombre).toBe("Proyecto original");
  });
});
