# TC-019 — Dado el panel principal de Tareas, cuando el usuario visualiza el widget de Meta Semanal, entonces el sistema muestra un valor fijo de 40 horas no configurable

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Unit)
**Prioridad**: Media
**Criterio de aceptación**: AC-017 — Calcular la Meta Semanal como valor fijo de 40 horas, no configurable
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- El panel principal de Tareas está visible, con o sin Registros de Tiempo previos.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                           | Resultado esperado del paso                                                                 |
| --- | ------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | sistema | Calcula la Meta Semanal como 8 horas × 5 días laborales          | El resultado es 40 horas                                                                    |
| 2   | usuario | Observa el widget "Meta semanal" en el panel principal de Tareas | El widget muestra 40 horas como meta, sin ningún control de edición o configuración visible |

## Resultado esperado final

La Meta Semanal mostrada es siempre 40 horas, independientemente de los Registros de Tiempo existentes, y no existe ninguna forma en la interfaz de modificar ese valor.

## Observaciones

Verifica BR-05. Al ser un valor fijo (constante de negocio), la lógica de cálculo es trivialmente unitaria; se complementa con inspección visual de que no exista control de configuración en la UI.
