# TC-010 — Dado que existen Registros de Tiempo distribuidos en distintos meses, Cuando el sistema calcula el total acumulado por mes, Entonces cada mes muestra la suma exacta de las duraciones de sus registros

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Unit)
**Prioridad**: Alta
**Criterio de aceptación**: AC-004 (Procesamiento de datos)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La función/selector de cálculo de total por mes está disponible para ser invocada de forma aislada (sin interfaz), recibiendo un arreglo de Registros de Tiempo con fecha.

## Datos de prueba

| Campo                     | Valor                                | Notas          |
| ------------------------- | ------------------------------------ | -------------- |
| RT-01 [propuesto]         | fecha: 2026-05-10, duración: 90 min  | Mayo 2026      |
| RT-02 [propuesto]         | fecha: 2026-05-12, duración: 45 min  | Mayo 2026      |
| RT-03 [propuesto]         | fecha: 2026-06-01, duración: 120 min | Junio 2026     |
| Total esperado mayo 2026  | 135 min                              | 90 + 45        |
| Total esperado junio 2026 | 120 min                              | único registro |

## Pasos de ejecución

| #   | Actor          | Acción                                                                 | Resultado esperado del paso                      |
| --- | -------------- | ---------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | Sistema (test) | Invoca la función de cálculo de total por mes con RT-01, RT-02 y RT-03 | La función procesa los 3 registros               |
| 2   | Sistema        | Agrupa los registros por año-mes y suma sus duraciones                 | Se generan los totales de mayo 2026 y junio 2026 |
| 3   | Sistema (test) | Verifica los totales devueltos por mes                                 | Los valores coinciden con los esperados          |

## Resultado esperado final

El total acumulado de mayo 2026 es 135 minutos y el de junio 2026 es 120 minutos, coincidiendo con la suma manual de los datos de prueba.

## Observaciones

Ninguna.
