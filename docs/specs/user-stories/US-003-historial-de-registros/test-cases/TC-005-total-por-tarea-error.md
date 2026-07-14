# TC-005 — Dado que un Registro de Tiempo de una Tarea tiene una duración inválida, Cuando el sistema calcula el total acumulado por Tarea, Entonces el registro inválido no corrompe el total

**Perspectiva**: Error
**Automatización**: Automatizable (Unit)
**Prioridad**: Alta
**Criterio de aceptación**: AC-002 (Procesamiento de datos)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La función/selector de cálculo de total por Tarea está disponible para ser invocada de forma aislada (sin interfaz).
- El conjunto de entrada incluye al menos un Registro de Tiempo con duración inválida (ver Datos de prueba).

## Datos de prueba

| Campo             | Valor                                         | Notas                       |
| ----------------- | --------------------------------------------- | --------------------------- |
| RT-01 [propuesto] | tareaId: "T-1", duración: 60 min              | Registro válido             |
| RT-02 [propuesto] | tareaId: "T-1", duración: -30 min             | Duración negativa, inválida |
| RT-03 [propuesto] | tareaId: "T-1", duración: "abc" (no numérico) | Tipo inválido               |

## Pasos de ejecución

| #   | Actor          | Acción                                                                           | Resultado esperado del paso                                           |
| --- | -------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | Sistema (test) | Invoca la función de cálculo de total por Tarea con RT-01, RT-02 y RT-03         | La función procesa el conjunto sin lanzar una excepción no controlada |
| 2   | Sistema        | Excluye o normaliza los registros con duración inválida (negativa o no numérica) | Solo RT-01 se contabiliza en el total de T-1                          |
| 3   | Sistema (test) | Verifica el total devuelto para T-1                                              | El total es 60 minutos, sin NaN ni valores negativos                  |

## Resultado esperado final

El total por Tarea "T-1" es 60 minutos; los registros con duración inválida se excluyen del cálculo y no producen `NaN`, `undefined` ni un total negativo.

## Observaciones

La estrategia exacta (excluir vs. normalizar a 0) es una decisión técnica de `work-plan`/`TK-XXX`; este TC exige que, cualquiera sea la estrategia, el total final sea numérico y no incluya la duración inválida.
