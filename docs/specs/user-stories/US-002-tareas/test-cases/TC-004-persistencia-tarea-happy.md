# TC-004 — Dado que se creó una Tarea asociada a un Proyecto, cuando se recarga la aplicación, entonces la Tarea y su asociación al Proyecto persisten en el almacenamiento local

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Integration)
**Prioridad**: Media
**Criterio de aceptación**: AC-003 — Persistir datos de la Tarea (incluida su asociación al Proyecto) en almacenamiento local
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- Existe un Proyecto previamente creado.
- Se creó exitosamente la Tarea "Diseñar wireframes" asociada a "Proyecto Alpha" (ver TC-001).

## Datos de prueba

| Campo           | Valor                            | Notas                       |
| --------------- | -------------------------------- | --------------------------- |
| Proyecto        | "Proyecto Alpha" [propuesto]     | Proyecto ya persistido      |
| Nombre de Tarea | "Diseñar wireframes" [propuesto] | Tarea ya creada previamente |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                  | Resultado esperado del paso                                                                               |
| --- | ------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | sistema | Persiste la Tarea "Diseñar wireframes" en el almacenamiento local al momento de crearla | El registro queda disponible en el almacenamiento local (localStorage/IndexedDB) con su Proyecto asociado |
| 2   | usuario | Recarga la aplicación (F5) o cierra y vuelve a abrir el navegador                       | La aplicación se reinicia sin backend, leyendo del almacenamiento local                                   |
| 3   | usuario | Navega al panel principal de Tareas                                                     | El listado de Tareas se reconstruye desde el almacenamiento local                                         |

## Resultado esperado final

La Tarea "Diseñar wireframes" sigue visible en el listado tras la recarga, con su asociación intacta al Proyecto "Proyecto Alpha", confirmando que los datos no se perdieron.

## Observaciones

Depende de que TC-001 (creación) se haya ejecutado o simulado previamente. No se prueba aquí la corrección del contenido creado, solo la persistencia.
