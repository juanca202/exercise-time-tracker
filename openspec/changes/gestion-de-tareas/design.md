## Context

Time Tracker es offline-first: no hay backend, toda la información vive en el dispositivo. El manejo de estado global usa Zustand exclusivamente ([ADR-004](../../../docs/adr/ADR-004-uso-de-zustand.md)) y la persistencia local usa `localStorage` vía el middleware `persist` de Zustand ([ADR-011](../../../docs/adr/ADR-011-uso-de-localstorage-para-persistencia.md)). La arquitectura del código es feature-based bajo `src/features/` ([ADR-005](../../../docs/adr/ADR-005-arquitectura-feature-based.md)). Esta capability (`task-time-tracking`) es cross-cutting dentro de la pantalla "Tareas": agrupa CRUD de Tarea, el temporizador único de la aplicación y el ingreso manual, y comparte con `project-management` (US-30273) la relación Tarea → Proyecto, por lo que requiere decisiones explícitas sobre el modelo de datos y la concurrencia del temporizador antes de codificar.

## Goals / Non-Goals

**Goals:**

- Definir el modelo de datos de Tarea y Registro de Tiempo, y su relación con Proyecto.
- Definir cómo se garantiza un único temporizador activo en toda la aplicación (BR-02).
- Definir la estrategia de persistencia y recuperación ante cierre inesperado (RFB-001, RFB-002).

**Non-Goals:**

- Edición o eliminación de Tareas/Registros (no forma parte de US-30272).
- Creación de Proyectos (cubierta por la capability `project-management`, change `gestion-de-proyectos`).
- Visualización de historial/totales (cubierta por la capability de historial, change `historial-de-registros`).

## Decisions

- **Store dedicado por sub-dominio dentro de la feature:** un store de Zustand para Tareas + Registros de Tiempo (incluye el temporizador activo), separado del store de Proyectos, ambos persistidos con `persist` sobre `localStorage` bajo claves propias (p. ej. `time-tracker:tasks`, `time-tracker:time-entries`). Alternativa descartada: un único store global para todo el dominio — se evita para no crear un "god store" (riesgo señalado en ADR-004).
- **Temporizador activo como estado derivado, no como Registro de Tiempo parcial:** el temporizador en ejecución se modela como `{ taskId, startedAt }` en el store, sin crear un Registro de Tiempo hasta que se detiene (o se reemplaza automáticamente). Esto evita estados intermedios inválidos (duración parcial) y simplifica la validación de duración > 0, que solo aplica al momento de persistir.
- **Reemplazo automático de temporizador como una única operación atómica:** iniciar un nuevo temporizador con otro activo ejecuta, en una sola acción del store: calcular duración del anterior → validar > 0 → persistir su Registro de Tiempo → limpiar el temporizador anterior → setear el nuevo. Evita una ventana intermedia donde ambas Tareas parezcan "en ejecución".
- **Duración con precisión de segundos:** `Duración = Math.floor((finMs - inicioMs) / 1000)`, consistente con el escenario límite de "duración mínima válida = 1 segundo" para el temporizador.

## Risks / Trade-offs

- [Cierre del navegador/pestaña mientras el temporizador corre] → el `startedAt` persiste en `localStorage` en cuanto se inicia el temporizador (no solo al detenerlo), de modo que al recargar la aplicación pueda recuperar o cerrar consistentemente la sesión en curso (RFB-001/RFB-002); el criterio de recuperación exacto se resuelve en la tarea de implementación correspondiente.
- [Reloj del sistema retrocede entre inicio y fin] → fuera de alcance de esta capability; se asume reloj monótono del dispositivo, igual que el resto de la SRS.
- [Volumen de Registros de Tiempo dentro de `localStorage`] → aceptado por ADR-011; no se introduce paginación ni límites adicionales en esta capability.
