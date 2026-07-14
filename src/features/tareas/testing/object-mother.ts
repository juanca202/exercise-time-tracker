import type {
  Proyecto,
  RegistroDeTiempo,
  Tarea,
  TemporizadorActivo,
} from "@/shared/domain";

/**
 * Object Mother (ADR-007) para construir fixtures de dominio de la feature
 * Tareas en las pruebas unitarias, con valores por defecto sobreescribibles.
 */

let contador = 0;

function siguienteId(prefijo: string): string {
  contador += 1;
  return `${prefijo}-${contador}`;
}

export function unProyecto(overrides: Partial<Proyecto> = {}): Proyecto {
  return {
    id: siguienteId("proyecto"),
    nombre: "Proyecto Alpha",
    descripcion: "",
    ...overrides,
  };
}

export function unaTarea(overrides: Partial<Tarea> = {}): Tarea {
  return {
    id: siguienteId("tarea"),
    proyectoId: "proyecto-1",
    nombre: "Diseñar wireframes",
    ...overrides,
  };
}

export function unRegistroDeTiempo(
  overrides: Partial<RegistroDeTiempo> = {},
): RegistroDeTiempo {
  return {
    id: siguienteId("registro"),
    tareaId: "tarea-1",
    fecha: new Date(2026, 6, 13, 12, 0, 0, 0).toISOString(),
    duracionMs: 60 * 60 * 1000,
    origen: "manual",
    ...overrides,
  };
}

export function unTemporizadorActivo(
  overrides: Partial<TemporizadorActivo> = {},
): TemporizadorActivo {
  return {
    tareaId: "tarea-1",
    horaInicio: new Date(2026, 6, 13, 9, 0, 0, 0).toISOString(),
    ...overrides,
  };
}

/**
 * Construye una fecha ISO 8601 a partir de componentes en hora local, para
 * evitar que las pruebas dependan de la zona horaria del entorno de ejecución.
 */
export function fechaLocalIso(
  anio: number,
  mesIndiceCero: number,
  dia: number,
  hora = 12,
  minuto = 0,
): string {
  return new Date(anio, mesIndiceCero, dia, hora, minuto, 0, 0).toISOString();
}
