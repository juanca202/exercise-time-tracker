# TC-008 — Dado que no existe ningún Proyecto creado, Cuando el usuario accede a la sección Proyectos, Entonces el sistema muestra el listado vacío sin errores

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit/Integration)
**Prioridad**: Baja
**Criterio de aceptación**: AC-004 — Mostrar el listado de todos los Proyectos creados
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- El componente de listado de Proyectos está disponible para ser renderizado de forma aislada.
- El almacenamiento local no contiene ningún Proyecto (estado inicial/limpio).

## Datos de prueba

N/A — se ejercita con una colección de Proyectos vacía (`[]`) [propuesto].

## Pasos de ejecución

| #   | Actor   | Acción                                                                  | Resultado esperado del paso                                                           |
| --- | ------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | Sistema | Renderiza el componente de listado de Proyectos con una colección vacía | No se produce ningún error en la renderización                                        |
| 2   | Usuario | Observa la sección Proyectos                                            | Se muestra un estado vacío (listado sin elementos), sin filas ni tarjetas de Proyecto |

## Resultado esperado final

Con cero Proyectos creados, el sistema muestra el listado en su estado vacío de forma consistente y sin errores, en lugar de fallar o mostrar datos incorrectos.

## Observaciones

Este TC valida el límite inferior (cero elementos) del listado cubierto por AC-004; no se define explícitamente en la historia un mensaje o ilustración de estado vacío, por lo que solo se exige ausencia de errores y de elementos falsos.
