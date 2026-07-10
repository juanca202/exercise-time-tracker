# TC-014 — Dado que el temporizador de "Diseñar wireframes" está activo, Cuando el usuario detiene la sesión aproximadamente 1 segundo después de iniciarla, Entonces el sistema persiste el Registro de Tiempo con la Duración mínima válida mayor que cero

Perspectiva: Límite
Automatización: Automatizable (Unit)
Prioridad: Media
Criterio de aceptación: AC-008 (Reglas de negocio) — Validar Duración del temporizador mayor que cero
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- El temporizador de la Tarea "Diseñar wireframes" está activo, con Hora Inicio registrada.

## Datos de prueba

| Campo                                       | Valor                 | Notas                                          |
| ------------------------------------------- | --------------------- | ---------------------------------------------- |
| Duración calculada (Hora Fin − Hora Inicio) | 1 segundo [propuesto] | Valor justo por encima del límite inválido (0) |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                            | Resultado esperado del paso                                  |
| --- | ------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | Usuario | Hace clic en "Detener Sesión" aproximadamente 1 segundo después de haber iniciado el temporizador | El sistema calcula una Duración de aproximadamente 1 segundo |
| 2   | Sistema | Valida la Duración calculada contra la regla BR-03                                                | El sistema determina que la Duración es mayor que cero       |
| 3   | Sistema | Persiste el Registro de Tiempo                                                                    | El Registro de Tiempo queda guardado                         |

## Resultado esperado final

El nuevo Registro de Tiempo de "Diseñar wireframes" queda persistido con la Duración mínima calculada (mayor que cero), visible en el historial de la Tarea.

## Observaciones

Complementa el caso TC-013 (Duración = 0, rechazada) verificando el borde válido inmediatamente superior.
