# TC-022 — Dado que el temporizador de "Diseñar wireframes" está activo, Cuando el usuario hace clic en "Detener Sesión", Entonces el Registro de Tiempo queda persistido y visible en el historial en menos de 1 segundo

Perspectiva: Happy Path
Automatización: Automatizable (E2E)
Prioridad: Media
Criterio de aceptación: AC-013 (Eficiencia de rendimiento) — Detención del temporizador y persistencia en menos de 1 segundo
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- El temporizador de la Tarea "Diseñar wireframes" está activo desde hace varios minutos.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                                                                                              | Resultado esperado del paso                                                            |
| --- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | Usuario | Hace clic en "Detener Sesión" sobre el temporizador activo de "Diseñar wireframes" y mide el tiempo transcurrido hasta que el Registro de Tiempo aparece persistido en el historial | El Registro de Tiempo queda persistido y visible en el historial en menos de 1 segundo |

## Resultado esperado final

El nuevo Registro de Tiempo de "Diseñar wireframes" aparece en el historial de la Tarea en un tiempo menor a 1 segundo desde el clic del usuario en "Detener Sesión".

## Observaciones

- Medición realizada en el entorno de desarrollo local; los tiempos pueden variar en otros entornos.
- **Automatización:** Parcial. Igual limitante que TC-021: la aserción "< 1 segundo" para detener el temporizador y persistir el registro mide latencia real y es sensible a flakiness en CI. Requiere el mismo harness de medición dedicado con margen de tolerancia.
