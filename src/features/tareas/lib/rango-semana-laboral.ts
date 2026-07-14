/** Rango de fechas (hora local) de la semana laboral actual: Lunes a Viernes. */
export interface RangoSemanaLaboral {
  /** Lunes de la semana que contiene `fecha`, a las 00:00:00.000 (hora local). */
  inicio: Date;
  /** Viernes de la semana que contiene `fecha`, a las 23:59:59.999 (hora local). */
  fin: Date;
}

/**
 * Devuelve el Lunes 00:00:00.000 y el Viernes 23:59:59.999 (hora local) de la
 * semana que contiene `fecha`, según la decisión de RS-001.
 *
 * No usa `Intl.Locale` ni librerías de fechas de terceros: la semana laboral
 * (Lunes-Viernes) es una regla de negocio fija, independiente del locale del
 * navegador.
 */
export function rangoSemanaLaboralActual(fecha: Date): RangoSemanaLaboral {
  const inicio = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
  );
  const diaSemana = inicio.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
  const diasDesdeElLunes = diaSemana === 0 ? 6 : diaSemana - 1;
  inicio.setDate(inicio.getDate() - diasDesdeElLunes);
  inicio.setHours(0, 0, 0, 0);

  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 4); // Lunes + 4 días = Viernes
  fin.setHours(23, 59, 59, 999);

  return { inicio, fin };
}
