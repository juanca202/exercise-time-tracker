# TC-022 — Dado un Total Semanal acumulado, cuando el sistema calcula el porcentaje alcanzado de la Meta Semanal, entonces lo muestra como (Total Semanal ÷ Meta Semanal) × 100

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Unit)
**Prioridad**: Media
**Criterio de aceptación**: AC-019 — Mostrar el porcentaje alcanzado de la Meta Semanal
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La Meta Semanal es de 40 horas (fija, ver AC-017).
- El Total Semanal acumulado de la semana en curso es de 20 horas (ver AC-018).

## Datos de prueba

| Campo         | Valor           | Notas                                             |
| ------------- | --------------- | ------------------------------------------------- |
| Total Semanal | 20h [propuesto] | Suma de Registros de Tiempo de la semana en curso |
| Meta Semanal  | 40h             | Valor fijo (BR-05)                                |

## Pasos de ejecución

| #   | Actor   | Acción                                                                            | Resultado esperado del paso   |
| --- | ------- | --------------------------------------------------------------------------------- | ----------------------------- |
| 1   | sistema | Calcula el porcentaje como (Total Semanal ÷ Meta Semanal) × 100 = (20 ÷ 40) × 100 | El resultado calculado es 50% |
| 2   | usuario | Observa el widget "Meta semanal" en el panel principal de Tareas                  | Se muestra 50%                |

## Resultado esperado final

El porcentaje mostrado en el widget de Meta Semanal es 50%, consistente con el Total Semanal (20h) y la Meta Semanal fija (40h).

## Observaciones

El caso límite de un porcentaje superior a 100% (sobrecumplimiento de la meta) se cubre en TC-023.
