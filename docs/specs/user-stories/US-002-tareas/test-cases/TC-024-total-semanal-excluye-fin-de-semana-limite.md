# TC-024 — Dado un Registro de Tiempo con fecha en Sábado o Domingo dentro del rango calendario de la semana en curso, cuando el sistema calcula el Total Semanal, entonces ese registro NO se incluye en la suma

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit)
**Prioridad**: Media
**Criterio de aceptación**: AC-018 — Calcular el Total Semanal solo con Registros de Tiempo de la semana laboral en curso (Lunes a Viernes; excluye Sábado y Domingo)
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La fecha actual del sistema es 2026-07-13, Lunes (semana laboral en curso: 2026-07-13 Lunes al 2026-07-17 Viernes, según BR-05/AC-018).
- Existe un Registro de Tiempo manual con fecha 2026-07-13, Lunes (dentro de la semana laboral), Duración 3 horas.
- Existe un Registro de Tiempo manual con fecha 2026-07-18, Sábado (dentro del rango calendario de la semana pero fuera de la semana laboral), Duración 4 horas.
- Existe un Registro de Tiempo manual con fecha 2026-07-19, Domingo (dentro del rango calendario de la semana pero fuera de la semana laboral), Duración 2 horas.

## Datos de prueba

| Campo                             | Valor                                      | Notas                       |
| --------------------------------- | ------------------------------------------ | --------------------------- |
| Registro dentro de rango          | 3h, fecha 2026-07-13 (Lunes) [propuesto]   | Dentro de la semana laboral |
| Registro fuera de rango (Sábado)  | 4h, fecha 2026-07-18 (Sábado) [propuesto]  | Excluido del Total Semanal  |
| Registro fuera de rango (Domingo) | 2h, fecha 2026-07-19 (Domingo) [propuesto] | Excluido del Total Semanal  |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                            | Resultado esperado del paso                                              |
| --- | ------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | sistema | Calcula el Total Semanal de la semana laboral en curso (2026-07-13 Lunes al 2026-07-17 Viernes)                   | El sistema evalúa las fechas de todos los Registros de Tiempo existentes |
| 2   | sistema | Excluye los Registros con fecha 2026-07-18 (Sábado) y 2026-07-19 (Domingo) por caer fuera del rango Lunes-Viernes | Esos Registros no se suman al total                                      |
| 3   | usuario | Observa el stat card "Total Semanal" en el panel principal de Tareas                                              | Se muestra 3h (solo el registro del Lunes 2026-07-13)                    |

## Resultado esperado final

El Total Semanal mostrado es 3h, excluyendo correctamente los Registros de Tiempo del Sábado 2026-07-18 y el Domingo 2026-07-19 por no pertenecer a la semana laboral en curso (Lunes a Viernes), conforme a la decisión documentada en [RS-001](../research/RS-001-inicio-semana-total-semanal.md).

## Observaciones

Complementa a TC-020 (happy path) y TC-021 (excluye semana calendario anterior). Entre los tres, TC-020/TC-021/TC-024 cubren las tres fronteras del rango: contenido válido, semana anterior, y fin de semana dentro de la semana calendario actual.
