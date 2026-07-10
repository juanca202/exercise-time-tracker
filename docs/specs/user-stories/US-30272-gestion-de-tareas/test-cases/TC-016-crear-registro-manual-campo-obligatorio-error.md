# TC-016 — Dado que el formulario "Entrada Manual" está abierto con el campo Fecha sin completar, Cuando el usuario hace clic en "Guardar Registro", Entonces el sistema no crea el Registro de Tiempo y el formulario permanece abierto

Perspectiva: Error
Automatización: Automatizable (E2E)
Prioridad: Alta
Criterio de aceptación: AC-009 (Casos de uso) — Crear Registro de Tiempo manual
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existe la Tarea "Diseñar wireframes" asociada al "Proyecto Alfa".
- El formulario "Entrada Manual" está abierto.

## Datos de prueba

| Campo          | Valor                                              | Notas                           |
| -------------- | -------------------------------------------------- | ------------------------------- |
| Fecha          | (sin completar) [propuesto]                        | Campo obligatorio sin completar |
| Proyecto/Tarea | "Proyecto Alfa" / "Diseñar wireframes" [propuesto] | Tarea existente seleccionada    |
| Duración       | 2 horas [propuesto]                                | Valor numérico mayor que cero   |

## Pasos de ejecución

| #   | Actor   | Acción                                                       | Resultado esperado del paso                             |
| --- | ------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| 1   | Usuario | Deja el campo Fecha sin completar                            | El campo Fecha permanece sin valor                      |
| 2   | Usuario | Selecciona la Tarea "Diseñar wireframes" del "Proyecto Alfa" | El campo Proyecto/Tarea queda con el valor seleccionado |
| 3   | Usuario | Ingresa 2 horas en el campo Duración                         | El campo Duración queda con el valor ingresado          |
| 4   | Usuario | Hace clic en "Guardar Registro"                              | El sistema no crea el Registro de Tiempo                |

## Resultado esperado final

El formulario "Entrada Manual" permanece abierto y no se agrega ningún Registro de Tiempo al historial de la Tarea "Diseñar wireframes".

## Observaciones

Este caso ejemplifica la ausencia de Fecha; el mismo tratamiento de error aplica de forma análoga a la ausencia de Proyecto/Tarea.
