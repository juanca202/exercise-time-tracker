# TC-005 — Dado que existe el Proyecto "Rediseño Web" con Tareas y tiempo registrado, Cuando el usuario navega a la sección "Proyectos", Entonces la tarjeta del Proyecto muestra su Nombre, Descripción y Tiempo Registrado conforme al prototipo

Perspectiva: Happy Path
Automatización: Automatizable (E2E)
Prioridad: Alta
Criterio de aceptación: AC-003 (Interacción de usuario) — Listado de Proyectos en tarjetas con Nombre, Descripción y Tiempo Registrado, conforme al prototipo
Artefacto padre: US-30273
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación Time Tracker está abierta en el entorno de desarrollo local.
- Existe al menos un Proyecto creado (`Rediseño Web`, con Descripción `Actualización del sitio corporativo`) que tiene Tareas con tiempo registrado asociado (según US-001).

## Datos de prueba

| Campo                      | Valor                                 | Notas                                                            |
| -------------------------- | ------------------------------------- | ---------------------------------------------------------------- |
| Nombre del Proyecto        | `Rediseño Web`                        | [propuesto] Proyecto ya existente (ver TC-001).                  |
| Descripción del Proyecto   | `Actualización del sitio corporativo` | [propuesto] Proyecto ya existente.                               |
| Tiempo Registrado esperado | `3h 30m`                              | [propuesto] Suma de tiempos de las Tareas asociadas al Proyecto. |

## Pasos de ejecución

| #   | Actor   | Acción                                           | Resultado esperado del paso                                                               |
| --- | ------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| 1   | Usuario | Navega a la sección "Proyectos"                  | El sistema muestra el listado de Proyectos en formato de tarjetas                         |
| 2   | Sistema | Renderiza la tarjeta del Proyecto `Rediseño Web` | La tarjeta muestra el Nombre "Rediseño Web"                                               |
| 3   | Sistema | Renderiza el resto de la tarjeta                 | La tarjeta muestra la Descripción "Actualización del sitio corporativo"                   |
| 4   | Sistema | Renderiza el resto de la tarjeta                 | La tarjeta muestra el Tiempo Registrado `3h 30m`, conforme al prototipo de alta fidelidad |

## Resultado esperado final

El listado de Proyectos muestra la tarjeta del Proyecto "Rediseño Web" con su Nombre, Descripción y Tiempo Registrado visibles y correctos, siguiendo el diseño del prototipo Figma referenciado en la US.

## Observaciones

Depende de que exista un Proyecto creado (ver TC-001) con Tareas y registros de tiempo asociados (US-001). El valor exacto del Tiempo Registrado depende del cálculo de agregación validado en TC-008.

- **Automatización:** Parcial. El contenido funcional de la tarjeta (Nombre, Descripción, Tiempo Registrado) es aserteable con e2e estándar, pero la fidelidad visual exacta al prototipo de alta fidelidad (layout, spacing, colores de la tarjeta) no lo es. Se requiere una herramienta de regresión visual (ej. Percy, Chromatic o comparación de capturas) contra una baseline exportada del diseño de Figma.
