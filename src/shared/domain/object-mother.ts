import type {
  OrigenRegistroDeTiempo,
  Proyecto,
  RegistroDeTiempo,
  Tarea,
  TemporizadorActivo,
} from "./index";

/**
 * Fixtures Object Mother (ADR-007) para instanciar entidades de dominio
 * completas en pruebas, sin necesitar repetir su forma completa en cada test.
 */

let contadorDeIds = 0;

function generarId(prefijo: string): string {
  contadorDeIds += 1;
  return `${prefijo}-prueba-${contadorDeIds}`;
}

export function crearProyectoDePrueba(
  sobrescrituras: Partial<Proyecto> = {},
): Proyecto {
  return {
    id: generarId("proyecto"),
    nombre: "Proyecto de prueba",
    descripcion: "Descripción de prueba",
    creadoEn: "2026-01-01T00:00:00.000Z",
    ...sobrescrituras,
  };
}

export function crearTareaDePrueba(sobrescrituras: Partial<Tarea> = {}): Tarea {
  return {
    id: generarId("tarea"),
    proyectoId: generarId("proyecto"),
    nombre: "Tarea de prueba",
    creadoEn: "2026-01-01T00:00:00.000Z",
    ...sobrescrituras,
  };
}

export function crearRegistroDeTiempoDePrueba(
  sobrescrituras: Partial<RegistroDeTiempo> = {},
): RegistroDeTiempo {
  const origen: OrigenRegistroDeTiempo = "manual";

  return {
    id: generarId("registro"),
    tareaId: generarId("tarea"),
    fecha: "2026-01-15",
    duracionMinutos: 30,
    origen,
    creadoEn: "2026-01-15T00:00:00.000Z",
    ...sobrescrituras,
  };
}

export function crearTemporizadorActivoDePrueba(
  sobrescrituras: Partial<TemporizadorActivo> = {},
): TemporizadorActivo {
  return {
    tareaId: generarId("tarea"),
    horaInicio: "2026-01-15T09:00:00.000Z",
    ...sobrescrituras,
  };
}
