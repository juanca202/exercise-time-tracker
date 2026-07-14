# TC-011 — Dado que se detuvo un temporizador activo, cuando se genera el Registro de Tiempo, entonces el sistema lo persiste de forma inmediata en el almacenamiento local

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Integration)
**Prioridad**: Media
**Criterio de aceptación**: AC-010 — Persistir de forma inmediata el Registro de Tiempo generado al detener el temporizador
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- El temporizador de la Tarea "Diseñar wireframes" está activo, con Hora Inicio 09:00:00.
- La aplicación está corriendo en entorno local de desarrollo, sin backend.

## Datos de prueba

| Campo               | Valor                            | Notas                             |
| ------------------- | -------------------------------- | --------------------------------- |
| Tarea               | "Diseñar wireframes" [propuesto] | Con temporizador activo           |
| Hora Fin (simulada) | 09:25:00 [propuesto]             | Duración resultante de 25 minutos |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                            | Resultado esperado del paso                                                    |
| --- | ------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | usuario | Detiene el temporizador de "Diseñar wireframes"                                                                   | El sistema calcula la Duración (25 minutos)                                    |
| 2   | sistema | Persiste el Registro de Tiempo generado en el almacenamiento local inmediatamente después de calcular la Duración | El Registro queda disponible en el almacenamiento local sin recargar la página |
| 3   | usuario | Consulta directamente el almacenamiento local del navegador (o recarga la aplicación)                             | El Registro de Tiempo persistido sigue presente                                |

## Resultado esperado final

El Registro de Tiempo de "Diseñar wireframes" (Hora Inicio 09:00:00, Hora Fin 09:25:00, Duración 25 min) está disponible en el almacenamiento local inmediatamente después de detener el temporizador, sin requerir una acción adicional del usuario.

## Observaciones

Complementa a TC-009 (cálculo de Duración) enfocándose exclusivamente en la persistencia inmediata.
