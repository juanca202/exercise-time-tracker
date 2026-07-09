# TC-013 — Detener el temporizador con duración calculada igual a cero (BR-03)

Tipo: Error
Prioridad: Alta
Criterio de aceptación: AC-008 (Reglas de negocio) — Validar Duración del temporizador mayor que cero
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que, en cumplimiento de BR-03, el sistema no acepta un Registro de Tiempo por temporizador cuya Duración calculada sea igual a cero.

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- El temporizador de la Tarea "Diseñar wireframes" está activo, con Hora Inicio registrada.

## Datos de prueba

| Campo                                       | Valor         | Notas                                                                              |
| ------------------------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| Duración calculada (Hora Fin − Hora Inicio) | 0 [propuesto] | Hora Fin igual a Hora Inicio; escenario simulado de detención en el mismo instante |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                            | Resultado esperado del paso                             |
| --- | ------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | Usuario | Hace clic en "Detener Sesión" en el mismo instante en que la Hora Fin coincide con la Hora Inicio | El sistema calcula una Duración igual a cero            |
| 2   | Sistema | Valida la Duración calculada contra la regla BR-03                                                | El sistema detecta que la Duración no es mayor que cero |

## Resultado esperado final

El sistema no persiste ningún Registro de Tiempo con Duración igual a cero para "Diseñar wireframes"; no se agrega ninguna entrada al historial de la Tarea.

## Observaciones

Escenario relacionado con TC-009 (cambio de temporizador con duración mínima).
