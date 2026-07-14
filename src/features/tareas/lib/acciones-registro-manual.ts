import type { RegistroDeTiempo } from "@/shared/domain";
import { generarId, useAppStore } from "@/shared/store";
import { validarDuracion } from "./validar-duracion";

export interface EntradaRegistroManual {
  tareaId: string;
  /** Día calendario del Registro, en formato `YYYY-MM-DD` (valor crudo de un `<input type="date">`). */
  fecha: string;
  duracionMinutos: number;
}

export type ResultadoCrearRegistroManual =
  | { ok: true; registro: RegistroDeTiempo }
  | { ok: false; error: string };

/**
 * Crea un Registro de Tiempo manual (Tarea, Fecha, Duración), validando en
 * la propia acción del store que la Duración sea mayor que cero (BR-04,
 * defensa en profundidad además de la validación de UI) antes de persistir
 * (AC-013, AC-014, AC-015).
 *
 * También verifica que `tareaId` corresponda a una Tarea **existente** en el
 * store, como defensa en profundidad más allá de lo que ya garantiza el
 * `<select>` de la UI.
 */
export function crearRegistroManual(
  input: EntradaRegistroManual,
): ResultadoCrearRegistroManual {
  if (!validarDuracion(input.duracionMinutos)) {
    return { ok: false, error: "La Duración debe ser mayor que cero." };
  }

  const store = useAppStore.getState();
  const tareaExiste = store.tareas.some((tarea) => tarea.id === input.tareaId);
  if (!tareaExiste) {
    return { ok: false, error: "La Tarea seleccionada no existe." };
  }

  const registro: RegistroDeTiempo = {
    id: generarId(),
    tareaId: input.tareaId,
    fecha: input.fecha,
    duracionMinutos: input.duracionMinutos,
    origen: "manual",
    creadoEn: new Date().toISOString(),
  };
  store.crearRegistroDeTiempo(registro);
  return { ok: true, registro };
}
