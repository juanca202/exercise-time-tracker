import type { RegistroDeTiempo, TemporizadorActivo } from "@/shared/domain";
import { generarId, useAppStore } from "@/shared/store";
import { fechaLocalACalendario } from "./fecha-calendario";
import { validarDuracion } from "./validar-duracion";

/** Cantidad de milisegundos en un minuto, usada para convertir la Duración calculada. */
const MS_POR_MINUTO = 60_000;

function calcularDuracionMinutos(
  horaInicioIso: string,
  horaFinIso: string,
): number {
  const duracionMs =
    new Date(horaFinIso).getTime() - new Date(horaInicioIso).getTime();
  return duracionMs / MS_POR_MINUTO;
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
  const duracionMinutos = calcularDuracionMinutos(
    activo.horaInicio,
    horaFinIso,
  );
  if (!validarDuracion(duracionMinutos)) {
    return;
  }
  const registro: RegistroDeTiempo = {
    id: generarId(),
    tareaId: activo.tareaId,
    fecha: fechaLocalACalendario(new Date(activo.horaInicio)),
    duracionMinutos,
    origen: "temporizador",
    creadoEn: new Date().toISOString(),
  };
  useAppStore.getState().crearRegistroDeTiempo(registro);
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
  const store = useAppStore.getState();
  const activo = store.temporizadorActivo;
  const ahoraIso = ahora.toISOString();

  if (activo?.tareaId === tareaId) {
    return;
  }

  if (activo) {
    detenerYPersistirRegistro(activo, ahoraIso);
  }

  store.establecerTemporizadorActivo({ tareaId, horaInicio: ahoraIso });
}

/**
 * Detiene el temporizador activo, calculando su Duración (Hora Fin − Hora
 * Inicio) y persistiendo su Registro de Tiempo si la Duración es mayor que
 * cero (AC-008, AC-010). No-op si no hay ningún temporizador activo.
 */
export function detenerTemporizador(ahora: Date = new Date()): void {
  const store = useAppStore.getState();
  const activo = store.temporizadorActivo;
  if (!activo) {
    return;
  }

  detenerYPersistirRegistro(activo, ahora.toISOString());
  store.establecerTemporizadorActivo(null);
}
