# TC-021 — Dado un Registro de Tiempo con fecha en la semana anterior, cuando el sistema calcula el Total Semanal de la semana laboral en curso, entonces ese registro NO se incluye en la suma

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit)
**Prioridad**: Media
**Criterio de aceptación**: AC-018 — Calcular el Total Semanal solo con Registros de Tiempo de la semana laboral en curso (límite de frontera de semana)
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La fecha actual del sistema es 2026-07-13, Lunes (semana laboral en curso: 2026-07-13 Lunes al 2026-07-17 Viernes, según BR-05/AC-018).
- Existe un Registro de Tiempo manual con fecha 2026-07-12, Domingo (último día de la semana calendario anterior, un día antes del inicio de la semana laboral en curso), Duración 2 horas.
- Existe un Registro de Tiempo manual con fecha 2026-07-13, Lunes (primer día de la semana laboral en curso), Duración 1 hora.

## Datos de prueba

| Campo                    | Valor                            | Notas                                         |
| ------------------------ | -------------------------------- | --------------------------------------------- |
| Registro fuera de rango  | 2h, fecha 2026-07-12 [propuesto] | Un día antes del inicio de la semana en curso |
| Registro dentro de rango | 1h, fecha 2026-07-13 [propuesto] | Primer día de la semana en curso              |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                          | Resultado esperado del paso                                              |
| --- | ------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | sistema | Calcula el Total Semanal de la semana laboral en curso (2026-07-13 Lunes al 2026-07-17 Viernes) | El sistema evalúa las fechas de todos los Registros de Tiempo existentes |
| 2   | sistema | Excluye el Registro con fecha 2026-07-12 por pertenecer a la semana calendario anterior         | Ese Registro no se suma al total                                         |
| 3   | usuario | Observa el stat card "Total Semanal"                                                            | Se muestra 1h (solo el registro del 2026-07-13)                          |

## Resultado esperado final

El Total Semanal mostrado es 1h, excluyendo correctamente el Registro de Tiempo del 2026-07-12 por no pertenecer a la semana laboral en curso.

## Observaciones

Valida la frontera exacta de inicio del cálculo de "semana laboral en curso" mencionado en AC-018/BR-05, resuelto por [RS-001](../research/RS-001-inicio-semana-total-semanal.md): la semana laboral empieza el Lunes. El caso de exclusión de Sábado/Domingo (fin de la semana laboral) se cubre en TC-024.
