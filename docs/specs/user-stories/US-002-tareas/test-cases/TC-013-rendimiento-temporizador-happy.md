# TC-013 — Dado el panel de Tareas, cuando el usuario inicia o detiene un temporizador, entonces el sistema completa la acción y persiste el resultado en menos de 1 segundo

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Media
**Criterio de aceptación**: AC-012 — Iniciar/detener el temporizador y persistir el Registro de Tiempo en menos de 1 segundo
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- Existe la Tarea "Diseñar wireframes" en el listado "Tareas Recientes".

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                                                  | Resultado esperado del paso                 |
| --- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1   | usuario | Hace clic en el ícono ▷ de "Diseñar wireframes" y se mide el tiempo transcurrido hasta que la interfaz refleja el estado "En Ejecución" | El tiempo transcurrido es menor a 1 segundo |
| 2   | usuario | Hace clic en el control de detener temporizador y se mide el tiempo transcurrido hasta que el Registro de Tiempo queda persistido       | El tiempo transcurrido es menor a 1 segundo |

## Resultado esperado final

Tanto el inicio como la detención (con persistencia del Registro de Tiempo) del temporizador se completan en menos de 1 segundo desde la acción del usuario, en ambos casos.

## Observaciones

La medición se realiza sobre el entorno local de desarrollo; los tiempos pueden variar según el hardware de ejecución. Se recomienda automatizar la medición con las APIs de rendimiento del navegador (Performance API) dentro del test E2E.
