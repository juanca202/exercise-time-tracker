# TC-011 — Dado que un Registro de Tiempo tiene una fecha inválida, Cuando el sistema calcula el total acumulado por mes, Entonces el registro inválido no corrompe los totales de los meses válidos

**Perspectiva**: Error
**Automatización**: Automatizable (Unit)
**Prioridad**: Alta
**Criterio de aceptación**: AC-004 (Procesamiento de datos)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La función/selector de cálculo de total por mes está disponible para ser invocada de forma aislada (sin interfaz).
- El conjunto de entrada incluye al menos un Registro de Tiempo con fecha inválida (ver Datos de prueba).

## Datos de prueba

| Campo             | Valor                                | Notas                       |
| ----------------- | ------------------------------------ | --------------------------- |
| RT-01 [propuesto] | fecha: 2026-06-01, duración: 120 min | Registro válido, junio 2026 |
| RT-02 [propuesto] | fecha: "2026-13-45" (inválida)       | Fecha no parseable          |

## Pasos de ejecución

| #   | Actor          | Acción                                                                  | Resultado esperado del paso                                           |
| --- | -------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | Sistema (test) | Invoca la función de cálculo de total por mes con RT-01 y RT-02         | La función procesa el conjunto sin lanzar una excepción no controlada |
| 2   | Sistema        | Excluye el registro con fecha inválida del cálculo de totales mensuales | Solo RT-01 se contabiliza en junio 2026                               |
| 3   | Sistema (test) | Verifica el total devuelto para junio 2026                              | El total es 120 minutos, sin afectación por el registro inválido      |

## Resultado esperado final

El total de junio 2026 es 120 minutos; el Registro con fecha inválida se excluye del cálculo y no genera un mes espurio ni corrompe los totales de los meses válidos.

## Observaciones

Ninguna.
