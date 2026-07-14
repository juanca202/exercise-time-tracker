# TC-008 — Dado que el Proyecto "Rediseño Web" tiene dos Tareas con tiempos registrados de 2h 00m y 1h 30m, Cuando el sistema calcula el tiempo total del Proyecto, Entonces la tarjeta muestra un Tiempo Registrado de 3h 30m

Perspectiva: Happy Path
Automatización: Automatizable (Unit)
Prioridad: Alta
Criterio de aceptación: AC-005 (Salidas del sistema) — Cálculo y visualización del tiempo total registrado por Proyecto como suma de los tiempos de sus Tareas
Artefacto padre: US-30273
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación Time Tracker está abierta en el entorno de desarrollo local.
- Existe un Proyecto `Rediseño Web` con dos Tareas asociadas (según US-001), cada una con Registros de Tiempo ya guardados.

## Datos de prueba

| Campo                              | Valor    | Notas                                                        |
| ---------------------------------- | -------- | ------------------------------------------------------------ |
| Tarea 1 — Tiempo registrado        | `2h 00m` | [propuesto] Suma de sus Registros de Tiempo.                 |
| Tarea 2 — Tiempo registrado        | `1h 30m` | [propuesto] Suma de sus Registros de Tiempo.                 |
| Tiempo total esperado del Proyecto | `3h 30m` | [propuesto] Resultado esperado de la suma (2h 00m + 1h 30m). |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                           | Resultado esperado del paso                      |
| --- | ------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | Sistema | Recupera los Registros de Tiempo de la Tarea 1 (`2h 00m`) y de la Tarea 2 (`1h 30m`) del Proyecto `Rediseño Web` | El sistema dispone de ambos totales por Tarea    |
| 2   | Sistema | Calcula la suma de los tiempos de ambas Tareas                                                                   | El resultado calculado es `3h 30m`               |
| 3   | Usuario | Navega a la sección "Proyectos" y observa la tarjeta del Proyecto `Rediseño Web`                                 | La tarjeta muestra el Tiempo Registrado `3h 30m` |

## Resultado esperado final

La tarjeta del Proyecto "Rediseño Web" en el listado muestra un Tiempo Registrado de `3h 30m`, coincidiendo exactamente con la suma de los tiempos de sus dos Tareas.

## Observaciones

Depende de que existan Tareas y Registros de Tiempo asociados al Proyecto (funcionalidad cubierta por US-001). Complementa a TC-005.

- **Automatización:** Parcial. La lógica de suma de tiempos es automatizable como prueba unitaria pura, pero la precondición del TC (Proyecto con 2 Tareas y Registros de Tiempo ya guardados) depende de funcionalidad de otra historia (US-001). Verificarlo end-to-end requiere fixtures/seeding especial (poblar el almacenamiento local directamente) en lugar de un flujo autocontenido dentro de US-002.
