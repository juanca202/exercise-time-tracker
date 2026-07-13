# TC-009 — Dado un temporizador activo en una Tarea, cuando el usuario lo detiene, entonces el sistema registra la Hora Fin y calcula la Duración correctamente

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Media
**Criterio de aceptación**: AC-008 — Detener temporizador activo y calcular Duración
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- El temporizador de la Tarea "Diseñar wireframes" está activo ("En Ejecución") con una Hora Inicio conocida.

## Datos de prueba

| Campo               | Valor                            | Notas                                    |
| ------------------- | -------------------------------- | ---------------------------------------- |
| Tarea               | "Diseñar wireframes" [propuesto] | Con temporizador activo                  |
| Hora Inicio         | 09:00:00 [propuesto]             | Hora simulada de inicio del temporizador |
| Hora Fin (simulada) | 09:25:00 [propuesto]             | 25 minutos después del inicio            |

## Pasos de ejecución

| #   | Actor   | Acción                                                                       | Resultado esperado del paso            |
| --- | ------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| 1   | usuario | Hace clic en el control para detener el temporizador de "Diseñar wireframes" | El sistema registra la Hora Fin actual |
| 2   | sistema | Calcula la Duración como (Hora Fin − Hora Inicio)                            | La Duración calculada es 00:25:00      |

## Resultado esperado final

El temporizador pasa a estado inactivo y se genera un Registro de Tiempo para "Diseñar wireframes" con Hora Inicio 09:00:00, Hora Fin 09:25:00 y Duración de 25 minutos.

## Observaciones

La persistencia inmediata del Registro de Tiempo generado se valida en TC-011 (AC-010); el caso límite de Duración igual a cero se cubre en TC-010 (AC-009).
