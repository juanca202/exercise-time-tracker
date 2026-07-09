# TC-019 — Ingresar una Duración manual igual a cero (BR-03)

Tipo: Error
Prioridad: Alta
Criterio de aceptación: AC-011 (Reglas de negocio) — Validar Duración manual mayor que cero
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que, en cumplimiento de BR-03, el sistema no acepta un Registro de Tiempo manual con una Duración igual a cero.

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existe la Tarea "Diseñar wireframes" asociada al "Proyecto Alfa".
- El formulario "Entrada Manual" está abierto.

## Datos de prueba

| Campo          | Valor                                              | Notas                                    |
| -------------- | -------------------------------------------------- | ---------------------------------------- |
| Fecha          | 2026-07-08 [propuesto]                             | Fecha válida                             |
| Proyecto/Tarea | "Proyecto Alfa" / "Diseñar wireframes" [propuesto] | Tarea existente seleccionada             |
| Duración       | 0 horas [propuesto]                                | Valor igual a cero, inválido según BR-03 |

## Pasos de ejecución

| #   | Actor   | Acción                                              | Resultado esperado del paso               |
| --- | ------- | --------------------------------------------------- | ----------------------------------------- |
| 1   | Usuario | Completa Fecha y Proyecto/Tarea con valores válidos | Los campos quedan completados             |
| 2   | Usuario | Ingresa 0 horas en el campo Duración                | El campo Duración queda con el valor cero |
| 3   | Usuario | Hace clic en "Guardar Registro"                     | El sistema no crea el Registro de Tiempo  |

## Resultado esperado final

El formulario "Entrada Manual" permanece abierto y no se agrega ningún Registro de Tiempo con Duración igual a cero al historial de la Tarea "Diseñar wireframes".

## Observaciones

Complementa TC-018 (Duración negativa) cubriendo el otro extremo prohibido por BR-03 ("menores o iguales a cero").
