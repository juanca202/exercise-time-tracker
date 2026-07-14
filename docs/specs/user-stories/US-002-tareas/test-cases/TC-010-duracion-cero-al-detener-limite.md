# TC-010 — Dado un temporizador activo, cuando el usuario lo detiene en el mismo instante en que se inició (Duración calculada igual a cero), entonces el sistema rechaza la persistencia del Registro de Tiempo

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit)
**Prioridad**: Alta
**Criterio de aceptación**: AC-009 — Validar que la Duración calculada al detener el temporizador sea mayor que cero
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- El temporizador de una Tarea está activo, con Hora Inicio registrada.
- Se simula (o fuerza en la capa de estado) que la Hora Fin coincide exactamente con la Hora Inicio, produciendo una Duración calculada de cero.

## Datos de prueba

| Campo       | Valor                            | Notas                                 |
| ----------- | -------------------------------- | ------------------------------------- |
| Tarea       | "Diseñar wireframes" [propuesto] | Con temporizador activo               |
| Hora Inicio | 09:00:00.000 [propuesto]         | Hora simulada                         |
| Hora Fin    | 09:00:00.000 [propuesto]         | Idéntica a Hora Inicio → Duración = 0 |

## Pasos de ejecución

| #   | Actor   | Acción                                                                 | Resultado esperado del paso  |
| --- | ------- | ---------------------------------------------------------------------- | ---------------------------- |
| 1   | sistema | Invoca la acción de detener el temporizador con Hora Inicio = Hora Fin | Se calcula una Duración de 0 |
| 2   | sistema | Evalúa la validación de Duración mayor que cero antes de persistir     | La validación falla          |

## Resultado esperado final

El sistema NO persiste ningún Registro de Tiempo con Duración igual a cero; la operación se rechaza conforme a BR-04.

## Observaciones

Este caso límite normalmente no es alcanzable por interacción manual del usuario en la UI (detener en el mismo milisegundo del inicio), por lo que se recomienda ejecutarlo a nivel de la función/acción de la capa de estado (store) en lugar de a través de la interfaz.
