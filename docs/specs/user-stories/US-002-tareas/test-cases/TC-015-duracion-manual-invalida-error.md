# TC-015 — Dado el formulario de ingreso manual de tiempo, cuando el usuario ingresa una Duración igual o menor a cero, entonces el sistema rechaza el registro

**Perspectiva**: Error
**Automatización**: Automatizable (Unit)
**Prioridad**: Alta
**Criterio de aceptación**: AC-014 — Validar que la Duración ingresada manualmente sea mayor que cero
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- Existe la Tarea "Diseñar wireframes" en el listado "Tareas Recientes".
- El formulario/acción de ingreso manual de tiempo está disponible.

## Datos de prueba

| Campo                  | Valor                            | Notas                                              |
| ---------------------- | -------------------------------- | -------------------------------------------------- |
| Tarea                  | "Diseñar wireframes" [propuesto] | Tarea existente                                    |
| Fecha                  | 2026-07-10 [propuesto]           | Válida                                             |
| Duración               | 0 minutos [propuesto]            | Caso 1: igual a cero                               |
| Duración (alternativa) | -30 minutos [propuesto]          | Caso 2: negativa (si el campo lo permite ingresar) |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                  | Resultado esperado del paso                             |
| --- | ------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | usuario | Selecciona la Tarea "Diseñar wireframes", ingresa Fecha 2026-07-10 y Duración 0 minutos | Los campos reflejan los valores ingresados              |
| 2   | usuario | Intenta confirmar el registro manual                                                    | El sistema NO crea el Registro de Tiempo                |
| 3   | sistema | Repite la validación con Duración -30 minutos (si la entrada lo permite)                | El sistema NO crea el Registro de Tiempo en ningún caso |

## Resultado esperado final

Ningún Registro de Tiempo manual con Duración menor o igual a cero se persiste; el sistema informa que la Duración debe ser mayor que cero.

## Observaciones

Verifica BR-04 para el flujo de ingreso manual. El caso límite del valor mínimo positivo válido se cubre en TC-016.
