# TC-007 — Dada una Tarea en el listado sin temporizador activo, cuando el usuario hace clic en el ícono ▷ de esa Tarea, entonces el sistema inicia el temporizador y persiste su estado "En Ejecución"

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Media
**Criterio de aceptación**: AC-006 — Iniciar temporizador para una Tarea específica desde el ícono ▷
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- Existe la Tarea "Diseñar wireframes" en el listado "Tareas Recientes".
- No hay ningún temporizador activo en la aplicación.

## Datos de prueba

| Campo | Valor                            | Notas                                   |
| ----- | -------------------------------- | --------------------------------------- |
| Tarea | "Diseñar wireframes" [propuesto] | Tarea existente sin temporizador activo |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                         | Resultado esperado del paso                           |
| --- | ------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | usuario | Hace clic en el ícono ▷ junto a "Diseñar wireframes"                                           | El sistema registra la hora de inicio actual          |
| 2   | sistema | Persiste localmente el estado "En Ejecución", la hora de inicio y el identificador de la Tarea | El estado queda disponible en el almacenamiento local |

## Resultado esperado final

El temporizador de "Diseñar wireframes" queda en estado "En Ejecución", con la hora de inicio persistida y visible en la interfaz asociada a esa Tarea.

## Observaciones

El comportamiento de auto-detención cuando ya existe un temporizador activo en otra Tarea se cubre en TC-008 (AC-007), no en este TC.
