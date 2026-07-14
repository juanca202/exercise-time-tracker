import type { Proyecto, RegistroDeTiempo, Tarea } from "@/shared/domain";
import { calcularTotalPorTarea } from "./calcularTotalPorTarea";

/**
 * Calcula el total de tiempo acumulado por Proyecto (AC-003), sumando los
 * totales de todas las Tareas que pertenecen a ese Proyecto.
 *
 * Compone {@link calcularTotalPorTarea} con la relación Tarea → Proyecto:
 * una Tarea huérfana (cuyo `proyectoId` no resuelve a un Proyecto existente)
 * se excluye de todo total de Proyecto sin abortar el cálculo del resto
 * (AC-003/TC-008). Un Proyecto sin Tareas con Registros válidos no aparece
 * en el `Map` devuelto y se resuelve a `0` en la capa de presentación
 * mediante {@link obtenerTotal} de `calcularTotalPorTarea`.
 *
 * Esta es la misma función que reutiliza (sin duplicar la regla de negocio)
 * la pantalla de Proyectos de `gestion-proyectos` para sus stat cards
 * (Observación de US-003): se exporta públicamente desde
 * `src/features/historial/` con ese propósito.
 */
export function calcularTotalPorProyecto(
  registros: RegistroDeTiempo[],
  tareas: Tarea[],
  proyectos: Proyecto[],
): Map<string, number> {
  const totalesPorTarea = calcularTotalPorTarea(registros);
  const totalesPorProyecto = new Map<string, number>();

  const tareasPorId = new Map(tareas.map((tarea) => [tarea.id, tarea]));
  const proyectoIds = new Set(proyectos.map((proyecto) => proyecto.id));

  for (const [tareaId, total] of totalesPorTarea) {
    const tarea = tareasPorId.get(tareaId);
    if (!tarea || !proyectoIds.has(tarea.proyectoId)) {
      // Tarea inexistente o huérfana (proyectoId sin Proyecto válido): se
      // excluye de todo total de Proyecto sin interrumpir el cálculo.
      continue;
    }
    totalesPorProyecto.set(
      tarea.proyectoId,
      (totalesPorProyecto.get(tarea.proyectoId) ?? 0) + total,
    );
  }

  return totalesPorProyecto;
}
