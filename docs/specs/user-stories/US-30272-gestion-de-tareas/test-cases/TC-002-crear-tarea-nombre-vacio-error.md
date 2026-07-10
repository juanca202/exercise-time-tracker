# TC-002 — Dado que el modal "Nueva Tarea" está abierto con un Proyecto seleccionado y el campo Nombre vacío, Cuando el usuario hace clic en "Crear Tarea", Entonces el sistema no crea la Tarea y el modal permanece abierto

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

| Campo              | Valor                       | Notas                           |
| ------------------ | --------------------------- | ------------------------------- |
| Proyecto           | "Proyecto Alfa" [propuesto] | Proyecto existente seleccionado |
| Nombre de la Tarea | "" (vacío) [propuesto]      | Campo obligatorio sin completar |

## Pasos de ejecución

| #   | Actor   | Acción                                                           | Resultado esperado del paso                       |
| --- | ------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| 1   | Usuario | Selecciona el Proyecto "Proyecto Alfa" en el modal "Nueva Tarea" | El campo Proyecto queda con el valor seleccionado |
| 2   | Usuario | Deja el campo Nombre vacío                                       | El campo Nombre permanece sin valor               |
| 3   | Usuario | Hace clic en "Crear Tarea"                                       | El sistema no crea la Tarea                       |

## Resultado esperado final

El modal "Nueva Tarea" permanece abierto, no se crea ninguna Tarea nueva y no se agrega ningún registro al panel de Tareas.

## Observaciones

Ninguna.
