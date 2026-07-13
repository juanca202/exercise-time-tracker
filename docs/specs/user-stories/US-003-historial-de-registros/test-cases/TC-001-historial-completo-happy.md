# TC-001 — Dado que existen Registros de Tiempo almacenados localmente, Cuando el usuario abre la pantalla de Historial de registros, Entonces se muestra la lista completa de todos los Registros de Tiempo

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Alta
**Criterio de aceptación**: AC-001 (Salidas del sistema)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo (`npm run dev`).
- El almacenamiento local del navegador (localStorage) contiene Proyectos, Tareas y Registros de Tiempo previamente persistidos (ver Datos de prueba).
- No se requiere autenticación (rol único "usuario" de Time Tracker, sin login, según SRS-001/RSG-001).

## Datos de prueba

| Campo                      | Valor                                                      | Notas                                         |
| -------------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| Registro RT-01 [propuesto] | Tarea "Diseño UI" (Proyecto "Alfa"), 2026-05-10, 90 min    | Registro de tiempo persistido en localStorage |
| Registro RT-02 [propuesto] | Tarea "Diseño UI" (Proyecto "Alfa"), 2026-05-12, 45 min    | Registro de tiempo persistido en localStorage |
| Registro RT-03 [propuesto] | Tarea "Backend API" (Proyecto "Beta"), 2026-06-01, 120 min | Registro de tiempo persistido en localStorage |

## Pasos de ejecución

| #   | Actor   | Acción                                                    | Resultado esperado del paso                                                |
| --- | ------- | --------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | Usuario | Navega a la pantalla "Historial de registros"             | El sistema inicia la carga del historial                                   |
| 2   | Sistema | Lee los Registros de Tiempo desde el almacenamiento local | El sistema obtiene los 3 registros de prueba (RT-01, RT-02, RT-03)         |
| 3   | Usuario | Observa la lista/tabla de historial                       | Se listan los 3 registros con sus datos (Tarea, Proyecto, fecha, duración) |

## Resultado esperado final

La pantalla de Historial de registros muestra los 3 Registros de Tiempo persistidos, sin omisiones ni duplicados, con los datos correctos de cada uno (Tarea, Proyecto, fecha y duración).

## Observaciones

Este TC asume que los Registros de Tiempo ya existen en el almacenamiento local (precondición), sin pasar por el flujo de creación descrito en US-002 (Tareas), dado que US-003 cubre exclusivamente lectura, agregación y presentación.
