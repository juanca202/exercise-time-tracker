import type { RegistroDeTiempo } from "@/shared/domain";
import { useRaizStore } from "@/shared/store";
import { validarDuracion } from "./validar-duracion";

export interface EntradaRegistroManual {
  tareaId: string;
  fecha: string;
  duracionMs: number;
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
  if (!validarDuracion(input.duracionMs)) {
    return { ok: false, error: "La Duración debe ser mayor que cero." };
  }

  const store = useRaizStore.getState();
  const tareaExiste = store.tareas.some((tarea) => tarea.id === input.tareaId);
  if (!tareaExiste) {
    return { ok: false, error: "La Tarea seleccionada no existe." };
  }

  const registro = store.crearRegistroDeTiempo({
    tareaId: input.tareaId,
    fecha: input.fecha,
    duracionMs: input.duracionMs,
    origen: "manual",
  });
  return { ok: true, registro };
}
