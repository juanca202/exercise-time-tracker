# TC-008 — Dado un temporizador activo en la Tarea A, cuando el usuario inicia un temporizador en la Tarea B, entonces el sistema detiene y persiste automáticamente el temporizador de A antes de iniciar el de B

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Alta
**Criterio de aceptación**: AC-007 — Auto-detención del temporizador anterior al iniciar uno nuevo en otra Tarea
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- Existen dos Tareas: "Diseñar wireframes" (Tarea A) y "Revisar backlog" (Tarea B), ambas en el listado "Tareas Recientes".
- El temporizador de la Tarea A está activo ("En Ejecución") desde hace al menos algunos segundos.

## Datos de prueba

| Campo   | Valor                            | Notas                   |
| ------- | -------------------------------- | ----------------------- |
| Tarea A | "Diseñar wireframes" [propuesto] | Con temporizador activo |
| Tarea B | "Revisar backlog" [propuesto]    | Sin temporizador activo |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                         | Resultado esperado del paso                                                      |
| --- | ------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1   | usuario | Verifica que el temporizador de "Diseñar wireframes" está "En Ejecución"                                       | La interfaz muestra el estado activo para la Tarea A                             |
| 2   | usuario | Hace clic en el ícono ▷ de "Revisar backlog" (Tarea B)                                                         | El sistema detecta un temporizador activo en una Tarea distinta                  |
| 3   | sistema | Detiene automáticamente el temporizador de la Tarea A, calcula su Duración y persiste su Registro de Tiempo    | El Registro de Tiempo de la Tarea A queda persistido con Duración mayor que cero |
| 4   | sistema | Inicia el temporizador de la Tarea B, guardando estado "En Ejecución", hora de inicio e identificador de Tarea | El temporizador de la Tarea B queda activo                                       |

## Resultado esperado final

Solo la Tarea B muestra el temporizador "En Ejecución"; la Tarea A ya no tiene temporizador activo y cuenta con un nuevo Registro de Tiempo persistido correspondiente al período en que estuvo corriendo.

## Observaciones

Verifica BR-02 (único temporizador activo a la vez) y BR-03 (auto-detención y persistencia antes de iniciar el nuevo). Es el escenario Happy Path central de la máquina de estados del temporizador.
