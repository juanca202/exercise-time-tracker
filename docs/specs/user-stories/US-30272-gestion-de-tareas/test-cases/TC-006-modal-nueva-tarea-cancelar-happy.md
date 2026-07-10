# TC-006 — Dado que el modal "Nueva Tarea" está abierto con Proyecto y Nombre completados, Cuando el usuario hace clic en "Cancelar", Entonces el modal se cierra sin crear ni persistir ninguna Tarea

Perspectiva: Happy Path
Automatización: Automatizable (E2E)
Prioridad: Media
Criterio de aceptación: AC-003 (Interacción de usuario) — Presentación del modal "Nueva Tarea"
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existe al menos un Proyecto previamente creado.
- El modal "Nueva Tarea" está abierto.

## Datos de prueba

| Campo              | Valor                            | Notas                           |
| ------------------ | -------------------------------- | ------------------------------- |
| Proyecto           | "Proyecto Alfa" [propuesto]      | Proyecto existente seleccionado |
| Nombre de la Tarea | "Diseñar wireframes" [propuesto] | Cadena de texto no vacía        |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                   | Resultado esperado del paso               |
| --- | ------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1   | Usuario | Selecciona el Proyecto "Proyecto Alfa" e ingresa "Diseñar wireframes" en el campo Nombre | Los campos quedan completados en el modal |
| 2   | Usuario | Hace clic en "Cancelar"                                                                  | El modal "Nueva Tarea" se cierra          |

## Resultado esperado final

El modal "Nueva Tarea" se cierra y el panel de Tareas no muestra ninguna Tarea nueva; no se persiste ningún dato en el almacenamiento local.

## Observaciones

Ninguna.
