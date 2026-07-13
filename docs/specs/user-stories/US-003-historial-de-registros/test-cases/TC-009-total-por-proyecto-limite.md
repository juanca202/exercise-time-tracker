# TC-009 — Dado que un Proyecto no tiene ninguna Tarea con Registros de Tiempo, Cuando el sistema calcula el total acumulado por Proyecto, Entonces el total mostrado es 0

**Perspectiva**: Límite
**Automatización**: Automatizable (Integration)
**Prioridad**: Alta
**Criterio de aceptación**: AC-003 (Procesamiento de datos)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La función de cálculo de total por Proyecto está disponible, integrando Proyectos, Tareas y Registros de Tiempo.
- Existe un Proyecto sin Tareas, o con Tareas que no tienen ningún Registro de Tiempo asociado.

## Datos de prueba

| Campo                        | Valor                                         | Notas                                            |
| ---------------------------- | --------------------------------------------- | ------------------------------------------------ |
| Proyecto "Gamma" [propuesto] | id: "P-3", sin Tareas con Registros de Tiempo | Cero registros en toda la jerarquía del Proyecto |

## Pasos de ejecución

| #   | Actor          | Acción                                                                            | Resultado esperado del paso                |
| --- | -------------- | --------------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | Sistema (test) | Invoca la función de cálculo de total por Proyecto incluyendo el Proyecto "Gamma" | El cálculo se ejecuta sin lanzar excepción |
| 2   | Sistema (test) | Verifica el total devuelto para el Proyecto "Gamma"                               | El total es 0                              |

## Resultado esperado final

El total acumulado del Proyecto "Gamma" es 0 minutos (no `undefined`, `null` ni `NaN`).

## Observaciones

Ninguna.
