# TC-004 — Dado que existe una Tarea creada y asociada a un Proyecto, Cuando se recarga la aplicación, Entonces la Tarea persiste en el almacenamiento local y sigue asociada al Proyecto

Perspectiva: Happy Path
Automatización: Automatizable (Integration)
Prioridad: Alta
Criterio de aceptación: AC-002 (Procesamiento de datos) — Almacenamiento de la Tarea y su asociación al Proyecto
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local.
- Existe al menos un Proyecto previamente creado.
- Se ha creado la Tarea "Diseñar wireframes" asociada al "Proyecto Alfa" (ver TC-001).

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                             | Resultado esperado del paso                                  |
| --- | ------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| 1   | Usuario | Recarga o reinicia la aplicación en el entorno de desarrollo local | La aplicación vuelve a cargar la pantalla principal "Tareas" |
| 2   | Sistema | Lee los datos persistidos en el almacenamiento local               | Se recuperan las Tareas previamente creadas                  |

## Resultado esperado final

La Tarea "Diseñar wireframes" sigue apareciendo en el panel de Tareas, correctamente asociada al "Proyecto Alfa", después de recargar la aplicación.

## Observaciones

Depende de la creación exitosa de una Tarea (TC-001).
