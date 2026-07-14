# TC-016 — Dado el formulario de ingreso manual de tiempo, cuando el usuario ingresa la Duración positiva más pequeña permitida por el sistema, entonces el sistema acepta y crea el registro

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit)
**Prioridad**: Alta
**Criterio de aceptación**: AC-014 — Validar que la Duración ingresada manualmente sea mayor que cero (límite inferior válido)
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- Existe la Tarea "Diseñar wireframes" en el listado "Tareas Recientes".
- El formulario/acción de ingreso manual de tiempo está disponible.

## Datos de prueba

| Campo    | Valor                            | Notas                                                                     |
| -------- | -------------------------------- | ------------------------------------------------------------------------- |
| Tarea    | "Diseñar wireframes" [propuesto] | Tarea existente                                                           |
| Fecha    | 2026-07-10 [propuesto]           | Válida                                                                    |
| Duración | 1 minuto [propuesto]             | Menor valor positivo representable por la granularidad del campo Duración |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                 | Resultado esperado del paso                |
| --- | ------- | -------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | usuario | Selecciona la Tarea "Diseñar wireframes", ingresa Fecha 2026-07-10 y Duración 1 minuto | Los campos reflejan los valores ingresados |
| 2   | usuario | Confirma el registro manual                                                            | El sistema crea el Registro de Tiempo      |

## Resultado esperado final

Se genera el Registro de Tiempo manual con Duración de 1 minuto, dado que es un valor mayor que cero; el registro queda disponible para la Tarea.

## Observaciones

Complementa a TC-015 (rechazo de Duración ≤ 0) validando el límite exacto de aceptación de BR-04. El valor "1 minuto" se propone como la unidad mínima representable; ajustar si la granularidad real del campo Duración difiere (p. ej. segundos).
