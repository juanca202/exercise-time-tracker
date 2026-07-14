# TC-023 — Dado un Total Semanal acumulado superior a la Meta Semanal, cuando el sistema calcula el porcentaje alcanzado, entonces lo muestra correctamente por encima del 100%

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit)
**Prioridad**: Baja
**Criterio de aceptación**: AC-019 — Mostrar el porcentaje alcanzado de la Meta Semanal cuando el Total Semanal supera la Meta Semanal
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La Meta Semanal es de 40 horas (fija, ver AC-017).
- El Total Semanal acumulado de la semana en curso es de 44 horas (superior a la meta), producto de Registros de Tiempo por temporizador y manuales.

## Datos de prueba

| Campo         | Valor           | Notas                         |
| ------------- | --------------- | ----------------------------- |
| Total Semanal | 44h [propuesto] | Supera la Meta Semanal de 40h |
| Meta Semanal  | 40h             | Valor fijo (BR-05)            |

## Pasos de ejecución

| #   | Actor   | Acción                                                                            | Resultado esperado del paso                                                              |
| --- | ------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | sistema | Calcula el porcentaje como (Total Semanal ÷ Meta Semanal) × 100 = (44 ÷ 40) × 100 | El resultado calculado es 110%                                                           |
| 2   | usuario | Observa el widget "Meta semanal" en el panel principal de Tareas                  | Se muestra 110% (o una representación visual equivalente que no trunque el valor a 100%) |

## Resultado esperado final

El porcentaje mostrado refleja fielmente el sobrecumplimiento de la Meta Semanal (110%), sin que el sistema oculte o trunque artificialmente el valor calculado.

## Observaciones

El AC-019 no especifica un límite superior de visualización (p. ej. tope visual en 100%); este TC documenta el comportamiento esperado según la fórmula literal del criterio. Si en `work-plan`/`TK-XXX` se decide un tope visual distinto, este TC deberá actualizarse.
