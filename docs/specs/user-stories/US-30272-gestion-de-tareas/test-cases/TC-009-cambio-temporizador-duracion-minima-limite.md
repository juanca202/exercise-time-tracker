# TC-009 — Cambio inmediato de temporizador con duración mínima registrada para la tarea detenida automáticamente

Tipo: Límite
Prioridad: Media
Criterio de aceptación: AC-005 (Reglas de negocio) — Único temporizador activo a la vez
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar el comportamiento del sistema (BR-02 en combinación con BR-03) cuando el usuario cambia de temporizador casi inmediatamente después de iniciarlo, generando una Duración mínima (pero mayor que cero) para el Registro de Tiempo detenido automáticamente.

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existen las Tareas "Diseñar wireframes" y "Revisar backlog", ambas asociadas a Proyectos existentes.
- El temporizador de la Tarea "Diseñar wireframes" acaba de iniciarse (segundos antes).

## Datos de prueba

| Campo                                | Valor                  | Notas                                                              |
| ------------------------------------ | ---------------------- | ------------------------------------------------------------------ |
| Tiempo transcurrido antes del cambio | ~1 segundo [propuesto] | Intervalo mínimo perceptible entre inicio y cambio de temporizador |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                                              | Resultado esperado del paso                                                |
| --- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | Usuario | Inicia el temporizador de la Tarea "Diseñar wireframes"                                                                             | El temporizador queda "En Ejecución"                                       |
| 2   | Usuario | Inmediatamente (aproximadamente 1 segundo después), hace clic en la acción de iniciar temporizador sobre la Tarea "Revisar backlog" | El sistema detiene automáticamente el temporizador de "Diseñar wireframes" |
| 3   | Sistema | Calcula la Duración del temporizador detenido                                                                                       | La Duración calculada es mayor que cero (aunque mínima)                    |
| 4   | Sistema | Persiste el Registro de Tiempo de "Diseñar wireframes" e inicia el temporizador de "Revisar backlog"                                | Ambas operaciones se completan correctamente                               |

## Resultado esperado final

Se guarda un Registro de Tiempo válido para "Diseñar wireframes" con una Duración mínima mayor que cero, y el temporizador de "Revisar backlog" queda activo.

## Observaciones

Escenario borde de BR-02 combinado con BR-03: si el cambio ocurriera en el mismo instante exacto (Duración = 0), aplica el mismo tratamiento de error que TC-013.
