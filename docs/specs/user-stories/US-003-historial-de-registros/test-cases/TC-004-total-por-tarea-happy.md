# TC-004 — Dado que existen múltiples Registros de Tiempo asociados a una misma Tarea, Cuando el sistema calcula el total acumulado por Tarea, Entonces el total corresponde a la suma exacta de las duraciones de esos registros

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Unit)
**Prioridad**: Alta
**Criterio de aceptación**: AC-002 (Procesamiento de datos)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La función/selector de cálculo de total por Tarea está disponible para ser invocada de forma aislada (sin interfaz), recibiendo como entrada un arreglo de Registros de Tiempo.
- No se requiere estado del navegador ni autenticación (prueba unitaria pura).

## Datos de prueba

| Campo              | Valor                                           | Notas          |
| ------------------ | ----------------------------------------------- | -------------- |
| RT-01 [propuesto]  | tareaId: "T-1" (Diseño UI), duración: 90 min    |                |
| RT-02 [propuesto]  | tareaId: "T-1" (Diseño UI), duración: 45 min    |                |
| RT-03 [propuesto]  | tareaId: "T-2" (Backend API), duración: 120 min |                |
| Total esperado T-1 | 135 min                                         | 90 + 45        |
| Total esperado T-2 | 120 min                                         | único registro |

## Pasos de ejecución

| #   | Actor          | Acción                                                                                          | Resultado esperado del paso                                   |
| --- | -------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Sistema (test) | Invoca la función de cálculo de total por Tarea con el arreglo de Registros de Tiempo de prueba | La función procesa los 3 registros                            |
| 2   | Sistema        | Agrupa los registros por tareaId y suma sus duraciones                                          | Se generan los totales por cada Tarea presente en el conjunto |
| 3   | Sistema (test) | Verifica el valor devuelto para cada Tarea                                                      | Los valores coinciden con los totales esperados               |

## Resultado esperado final

El total calculado para la Tarea "Diseño UI" (T-1) es 135 minutos y para "Backend API" (T-2) es 120 minutos, coincidiendo con la suma manual de los datos de prueba.

## Observaciones

Ninguna.
