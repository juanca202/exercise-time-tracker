# TC-007 — Dado que existen Proyectos creados, Cuando el usuario accede a la sección Proyectos, Entonces el sistema muestra el listado completo de todos los Proyectos

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Alta
**Criterio de aceptación**: AC-004 — Mostrar el listado de todos los Proyectos creados
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo.
- Existen al menos dos Proyectos previamente creados en el almacenamiento local.

## Datos de prueba

| Campo      | Valor                                                                | Notas                                                  |
| ---------- | -------------------------------------------------------------------- | ------------------------------------------------------ |
| Proyecto 1 | Nombre `Proyecto Alfa`, Descripción `Primer proyecto` [propuesto]    | —                                                      |
| Proyecto 2 | Nombre `Proyecto Beta`, Descripción `` (sin descripción) [propuesto] | Cubre además un Proyecto sin Descripción en el listado |

## Pasos de ejecución

| #   | Actor   | Acción                                                           | Resultado esperado del paso                                                 |
| --- | ------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | Usuario | Crea `Proyecto Alfa` y `Proyecto Beta` según los datos de prueba | Ambos Proyectos quedan persistidos                                          |
| 2   | Usuario | Navega/permanece en la sección Proyectos                         | La sección muestra el listado de Proyectos                                  |
| 3   | Sistema | Renderiza cada Proyecto existente en el almacenamiento local     | Se listan `Proyecto Alfa` y `Proyecto Beta`, cada uno con su Nombre visible |

## Resultado esperado final

El listado de Proyectos muestra todos los Proyectos creados (`Proyecto Alfa` y `Proyecto Beta`), sin omitir ninguno, reflejando el estado actual del almacenamiento local.

## Observaciones

Complementa a TC-008, que cubre el caso límite de listado vacío (sin Proyectos creados).
