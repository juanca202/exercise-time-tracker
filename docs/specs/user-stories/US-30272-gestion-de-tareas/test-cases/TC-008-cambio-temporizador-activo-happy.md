# TC-008 — Dado que el temporizador de la Tarea "Diseñar wireframes" está activo y existe la Tarea "Revisar backlog", Cuando el usuario inicia el temporizador de "Revisar backlog", Entonces el sistema detiene y persiste automáticamente el Registro de Tiempo de "Diseñar wireframes" e inicia el temporizador de "Revisar backlog", en cumplimiento de BR-02

Perspectiva: Happy Path
Automatización: Automatizable (Integration)
Prioridad: Alta
Criterio de aceptación: AC-005 (Reglas de negocio) — Único temporizador activo a la vez
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existen las Tareas "Diseñar wireframes" y "Revisar backlog", ambas asociadas a Proyectos existentes.
- El temporizador de la Tarea "Diseñar wireframes" está activo ("En Ejecución") desde hace varios minutos.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                                                         | Resultado esperado del paso                                                            |
| --- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | Usuario | Hace clic en la acción de iniciar temporizador sobre la Tarea "Revisar backlog", mientras el temporizador de "Diseñar wireframes" sigue activo | El sistema detiene automáticamente el temporizador de "Diseñar wireframes"             |
| 2   | Sistema | Calcula la Duración (Hora Fin − Hora Inicio) del temporizador detenido                                                                         | Se calcula una Duración mayor que cero                                                 |
| 3   | Sistema | Persiste el Registro de Tiempo de "Diseñar wireframes" en el almacenamiento local                                                              | El Registro de Tiempo queda guardado                                                   |
| 4   | Sistema | Inicia el nuevo temporizador para "Revisar backlog"                                                                                            | El estado "En Ejecución" y la hora de inicio quedan registrados para "Revisar backlog" |

## Resultado esperado final

El panel de Tareas muestra únicamente el temporizador de "Revisar backlog" como activo; la Tarea "Diseñar wireframes" muestra un nuevo Registro de Tiempo persistido correspondiente a la sesión detenida automáticamente.

## Observaciones

Ninguna.
