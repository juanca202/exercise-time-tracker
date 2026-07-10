# TC-018 — Dado que el formulario "Entrada Manual" está abierto con Fecha y Proyecto/Tarea válidos, Cuando el usuario ingresa una Duración negativa y hace clic en "Guardar Registro", Entonces el sistema no crea el Registro de Tiempo, en cumplimiento de BR-03

Perspectiva: Error
Automatización: Automatizable (Unit)
Prioridad: Alta
Criterio de aceptación: AC-011 (Reglas de negocio) — Validar Duración manual mayor que cero
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existe la Tarea "Diseñar wireframes" asociada al "Proyecto Alfa".
- El formulario "Entrada Manual" está abierto.

## Datos de prueba

| Campo          | Valor                                              | Notas                                |
| -------------- | -------------------------------------------------- | ------------------------------------ |
| Fecha          | 2026-07-08 [propuesto]                             | Fecha válida                         |
| Proyecto/Tarea | "Proyecto Alfa" / "Diseñar wireframes" [propuesto] | Tarea existente seleccionada         |
| Duración       | -1 hora [propuesto]                                | Valor negativo, inválido según BR-03 |

## Pasos de ejecución

| #   | Actor   | Acción                                              | Resultado esperado del paso                   |
| --- | ------- | --------------------------------------------------- | --------------------------------------------- |
| 1   | Usuario | Completa Fecha y Proyecto/Tarea con valores válidos | Los campos quedan completados                 |
| 2   | Usuario | Ingresa -1 hora en el campo Duración                | El campo Duración queda con el valor negativo |
| 3   | Usuario | Hace clic en "Guardar Registro"                     | El sistema no crea el Registro de Tiempo      |

## Resultado esperado final

El formulario "Entrada Manual" permanece abierto y no se agrega ningún Registro de Tiempo con Duración negativa al historial de la Tarea "Diseñar wireframes".

## Observaciones

Ninguna.
