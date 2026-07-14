import type { RegistroDeTiempo, TareaId } from "@/shared/domain/types";

/**
 * Verifica que un Registro de Tiempo tenga una `duracion` numérica, finita y
 * mayor que cero. Cualquier otro valor (negativo, `NaN`, no numérico) se
 * considera inválido y se excluye del cálculo (AC-002/TC-005).
 */
function tieneDuracionValida(registro: RegistroDeTiempo): boolean {
  const { duracion } = registro;
  return (
    typeof duracion === "number" && Number.isFinite(duracion) && duracion > 0
  );
}

/**
 * Calcula el total de tiempo acumulado por Tarea (AC-002).
 *
 * Agrupa por `tareaId` y suma `duracion`, descartando Registros con
 * `tareaId` ausente o `duracion` inválida (negativa o no numérica) sin
 * lanzar una excepción. Una Tarea sin Registros válidos simplemente no
 * aparece en el `Map` devuelto; se resuelve a `0` en la capa de
 * presentación mediante {@link obtenerTotal}.
 *
 * Selector puro y O(n): un único recorrido del arreglo con acumulación en
 * un `Map`, apto para memoizarse sobre la identidad de `registros`.
 */
export function calcularTotalPorTarea(
  registros: RegistroDeTiempo[],
): Map<TareaId, number> {
  const totales = new Map<TareaId, number>();

  for (const registro of registros) {
    if (
      !registro ||
      typeof registro.tareaId !== "string" ||
      registro.tareaId.length === 0
    ) {
      continue;
    }
    if (!tieneDuracionValida(registro)) {
      continue;
    }
    totales.set(
      registro.tareaId,
      (totales.get(registro.tareaId) ?? 0) + registro.duracion,
    );
  }

  return totales;
}

/** Resuelve el total de un `Map` de totales a `0` cuando la clave no existe. */
export function obtenerTotal(
  totales: Map<string, number>,
  clave: string,
): number {
  return totales.get(clave) ?? 0;
}
