# TC-003 — Dado que el modal "Nueva Tarea" está abierto con el campo Proyecto sin seleccionar, Cuando el usuario ingresa un Nombre y hace clic en "Crear Tarea", Entonces el sistema no crea la Tarea, en cumplimiento de BR-01

Perspectiva: Error
Automatización: Automatizable (E2E)
Prioridad: Alta
Criterio de aceptación: AC-001 (Casos de uso) — Crear Tarea con Nombre y Proyecto existente
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existe al menos un Proyecto previamente creado.
- El modal "Nueva Tarea" está abierto.

## Datos de prueba

| Campo              | Valor                            | Notas                           |
| ------------------ | -------------------------------- | ------------------------------- |
| Proyecto           | (sin seleccionar) [propuesto]    | Campo obligatorio sin completar |
| Nombre de la Tarea | "Diseñar wireframes" [propuesto] | Cadena de texto no vacía        |

## Pasos de ejecución

| #   | Actor   | Acción                                                           | Resultado esperado del paso                  |
| --- | ------- | ---------------------------------------------------------------- | -------------------------------------------- |
| 1   | Usuario | Deja el campo Proyecto sin seleccionar en el modal "Nueva Tarea" | El campo Proyecto permanece sin valor        |
| 2   | Usuario | Ingresa "Diseñar wireframes" en el campo Nombre                  | El campo Nombre queda con el valor ingresado |
| 3   | Usuario | Hace clic en "Crear Tarea"                                       | El sistema no crea la Tarea                  |

## Resultado esperado final

El modal "Nueva Tarea" permanece abierto, no se crea ninguna Tarea nueva y no queda ninguna Tarea sin Proyecto asociado en el almacenamiento local.

## Observaciones

Ninguna.
