import type { RegistroDeTiempo } from "../domain";

/**
 * Calcula el mes calendario (formato `YYYY-MM`, en UTC) al que pertenece un
 * Registro de Tiempo, a partir de su fecha de inicio. Función pura y sin
 * estado: Tareas e Historial de registros la consumen de forma idéntica sin
 * duplicar la lógica ni depender entre sí (ver
 * `fundamentos-infraestructura-compartida`).
 */
export const obtenerMesCalendario = (registro: RegistroDeTiempo): string => {
  const fecha = new Date(registro.inicio);
  const anio = fecha.getUTCFullYear();
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");

  return `${anio}-${mes}`;
};
