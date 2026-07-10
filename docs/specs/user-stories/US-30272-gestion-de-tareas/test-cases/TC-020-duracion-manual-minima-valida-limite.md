# TC-020 — Dado que el formulario "Entrada Manual" está abierto con Fecha y Proyecto/Tarea válidos, Cuando el usuario ingresa una Duración de 1 minuto y hace clic en "Guardar Registro", Entonces el sistema crea y persiste el Registro de Tiempo con la Duración mínima válida

Perspectiva: Límite
Automatización: Automatizable (Unit)
Prioridad: Media
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

| Campo          | Valor                                              | Notas                                          |
| -------------- | -------------------------------------------------- | ---------------------------------------------- |
| Fecha          | 2026-07-08 [propuesto]                             | Fecha válida                                   |
| Proyecto/Tarea | "Proyecto Alfa" / "Diseñar wireframes" [propuesto] | Tarea existente seleccionada                   |
| Duración       | 1 minuto [propuesto]                               | Valor justo por encima del límite inválido (0) |

## Pasos de ejecución

| #   | Actor   | Acción                                              | Resultado esperado del paso                    |
| --- | ------- | --------------------------------------------------- | ---------------------------------------------- |
| 1   | Usuario | Completa Fecha y Proyecto/Tarea con valores válidos | Los campos quedan completados                  |
| 2   | Usuario | Ingresa 1 minuto en el campo Duración               | El campo Duración queda con el valor ingresado |
| 3   | Usuario | Hace clic en "Guardar Registro"                     | El sistema crea el Registro de Tiempo          |

## Resultado esperado final

El nuevo Registro de Tiempo manual de 1 minuto queda persistido y visible en el historial de la Tarea "Diseñar wireframes".

## Observaciones

Complementa los casos TC-018 y TC-019 (valores inválidos) verificando el borde válido inmediatamente superior a cero.
