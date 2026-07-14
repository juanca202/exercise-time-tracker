import type { TemporizadorActivo } from "@/shared/domain";
import { useRaizStore } from "@/shared/store";
import { validarDuracion } from "./validar-duracion";

function calcularDuracionMs(horaInicioIso: string, horaFinIso: string): number {
  return new Date(horaFinIso).getTime() - new Date(horaInicioIso).getTime();
}

/**
 * Detiene el temporizador `activo`, calcula su Duración y, si es mayor que
 * cero (BR-04), persiste su Registro de Tiempo. Si la Duración calculada es
 * cero, no persiste ningún Registro (AC-009/TC-010).
 */
function detenerYPersistirRegistro(
  activo: TemporizadorActivo,
  horaFinIso: string,
): void {
  const duracionMs = calcularDuracionMs(activo.horaInicio, horaFinIso);
  if (!validarDuracion(duracionMs)) {
    return;
  }
  useRaizStore.getState().crearRegistroDeTiempo({
    tareaId: activo.tareaId,
    fecha: activo.horaInicio,
    duracionMs,
    origen: "temporizador",
  });
}

/**
 * Inicia el temporizador para `tareaId` (AC-006).
 *
 * Si ya existe un temporizador activo en otra Tarea, lo detiene, calcula su
 * Duración y persiste su Registro de Tiempo de forma síncrona antes de
 * iniciar el nuevo temporizador (BR-02, BR-03, AC-007), de modo que solo la
 * nueva Tarea queda con el temporizador activo.
 *
 * Si el temporizador activo ya corresponde a `tareaId`, la operación es un
 * no-op (evita reiniciar la hora de inicio de la misma Tarea en ejecución).
 */
export function iniciarTemporizador(
  tareaId: string,
  ahora: Date = new Date(),
): void {
  const store = useRaizStore.getState();
  const activo = store.temporizadorActivo;
  const ahoraIso = ahora.toISOString();

  if (activo?.tareaId === tareaId) {
    return;
  }

  if (activo) {
    detenerYPersistirRegistro(activo, ahoraIso);
  }

  store.setTemporizadorActivo({ tareaId, horaInicio: ahoraIso });
}

/**
 * Detiene el temporizador activo, calculando su Duración (Hora Fin − Hora
 * Inicio) y persistiendo su Registro de Tiempo si la Duración es mayor que
 * cero (AC-008, AC-010). No-op si no hay ningún temporizador activo.
 */
export function detenerTemporizador(ahora: Date = new Date()): void {
  const store = useRaizStore.getState();
  const activo = store.temporizadorActivo;
  if (!activo) {
    return;
  }

  detenerYPersistirRegistro(activo, ahora.toISOString());
  store.setTemporizadorActivo(null);
}
