# TC-012 — Dado un Registro de Tiempo cuya jornada cruza la medianoche del último día de un mes, Cuando el sistema calcula el total acumulado por mes, Entonces la duración completa se contabiliza en el mes de la Hora de Inicio, sin prorratear con el mes siguiente

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit)
**Prioridad**: Alta
**Criterio de aceptación**: AC-004 — Cuando un Registro generado por el temporizador cruza la medianoche de fin de mes, se contabiliza íntegro en el mes de la Hora de Inicio
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La función/selector de cálculo de total por mes está disponible para ser invocada de forma aislada (sin interfaz).
- Existe un Registro de Tiempo cuyo inicio y fin caen en meses calendario distintos (cruce de fin de mes).

## Datos de prueba

| Campo             | Valor                                                                    | Notas                        |
| ----------------- | ------------------------------------------------------------------------ | ---------------------------- |
| RT-06 [propuesto] | inicio: 2026-07-31 23:00, fin: 2026-08-01 01:00, duración total: 120 min | Cruza de julio a agosto 2026 |

## Pasos de ejecución

| #   | Actor          | Acción                                                                                                                | Resultado esperado del paso                          |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | Sistema (test) | Invoca la función de cálculo de total por mes con RT-06                                                               | La función procesa el registro sin lanzar excepción  |
| 2   | Sistema        | Asigna la duración completa del registro (120 min) al mes de su Hora de Inicio (julio 2026), según la regla de AC-004 | El total de julio 2026 atribuible a RT-06 es 120 min |
| 3   | Sistema (test) | Verifica el total de agosto 2026 atribuible a RT-06                                                                   | El total de agosto 2026 atribuible a RT-06 es 0 min  |

## Resultado esperado final

El total de julio 2026 incluye los 120 minutos completos de RT-06 (mes de la Hora de Inicio, 2026-07-31 23:00); el total de agosto 2026 no incluye ninguna porción de RT-06, aunque el registro haya finalizado el 2026-08-01 01:00.

## Observaciones

Regla de asignación resuelta por [RS-001](../research/RS-001-regla-cruce-de-mes.md): un Registro de Tiempo que cruza la medianoche de fin de mes se contabiliza íntegro en el mes de su Hora de Inicio, sin prorratear. Esta regla aplica únicamente a Registros generados por el temporizador (Hora Inicio/Hora Fin reales); un Registro manual (Fecha única) nunca puede cruzar un límite de mes por diseño.
