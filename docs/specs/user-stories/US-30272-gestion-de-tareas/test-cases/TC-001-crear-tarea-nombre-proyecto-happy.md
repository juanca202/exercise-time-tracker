# TC-001 — Dado que existe un Proyecto creado y el usuario está en la pantalla "Tareas", Cuando crea una nueva Tarea con Nombre y Proyecto seleccionados, Entonces la Tarea queda listada y asociada al Proyecto

Perspectiva: Happy Path
Automatización: Automatizable (E2E)
Prioridad: Alta
Criterio de aceptación: AC-001 (Casos de uso) — Crear Tarea con Nombre y Proyecto existente
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existe al menos un Proyecto previamente creado (dependencia de US-002).

## Datos de prueba

| Campo              | Valor                            | Notas                                        |
| ------------------ | -------------------------------- | -------------------------------------------- |
| Proyecto           | "Proyecto Alfa" [propuesto]      | Proyecto existente seleccionable en el modal |
| Nombre de la Tarea | "Diseñar wireframes" [propuesto] | Cadena de texto no vacía                     |

## Pasos de ejecución

| #   | Actor   | Acción                                                                | Resultado esperado del paso                       |
| --- | ------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| 1   | Usuario | Abre la pantalla principal "Tareas" en el entorno de desarrollo local | Se muestra el panel de Tareas                     |
| 2   | Usuario | Hace clic en la acción para crear una nueva Tarea                     | Se abre el modal "Nueva Tarea"                    |
| 3   | Usuario | Selecciona el Proyecto "Proyecto Alfa" en el campo Proyecto           | El campo Proyecto queda con el valor seleccionado |
| 4   | Usuario | Ingresa "Diseñar wireframes" en el campo Nombre                       | El campo Nombre queda con el valor ingresado      |
| 5   | Usuario | Hace clic en "Crear Tarea"                                            | El sistema crea la Tarea y cierra el modal        |

## Resultado esperado final

La nueva Tarea "Diseñar wireframes" aparece listada en el panel de Tareas, asociada al "Proyecto Alfa".

## Observaciones

Depende de que exista al menos un Proyecto creado (US-002).
