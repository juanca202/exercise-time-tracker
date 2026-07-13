# TC-006 — Dado que una Tarea no tiene ningún Registro de Tiempo asociado, Cuando el sistema calcula el total acumulado por Tarea, Entonces el total mostrado es 0

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit)
**Prioridad**: Alta
**Criterio de aceptación**: AC-002 (Procesamiento de datos)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La función/selector de cálculo de total por Tarea está disponible para ser invocada de forma aislada (sin interfaz).
- Existe una Tarea sin ningún Registro de Tiempo asociado en el conjunto de entrada.

## Datos de prueba

| Campo                   | Valor                             | Notas          |
| ----------------------- | --------------------------------- | -------------- |
| Tarea "T-3" [propuesto] | Sin Registros de Tiempo asociados | Cero registros |

## Pasos de ejecución

| #   | Actor          | Acción                                                                                  | Resultado esperado del paso                      |
| --- | -------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | Sistema (test) | Invoca la función de cálculo de total por Tarea incluyendo la Tarea "T-3" sin registros | La función procesa la Tarea sin lanzar excepción |
| 2   | Sistema (test) | Verifica el total devuelto para "T-3"                                                   | El total es 0                                    |

## Resultado esperado final

El total acumulado para la Tarea "T-3" es 0 minutos (no `undefined`, `null` ni `NaN`).

## Observaciones

Ninguna.
