## Context

Persistencia exclusivamente local vía Web Storage API (ADR-011), con separación entre el store raíz (CRUD crudo) y stores de feature (estado de negocio) según ADR-012, y manejo de estado con Zustand (ADR-004). Depende del shell de navegación de la change `layout-de-la-aplicacion`. Modelo de datos y flujos de edición/eliminación ya documentados en [technical-docs/timetracker.md](../../../docs/specs/technical-docs/timetracker.md) (`MD-01`, `FL-05`, `FL-06`).

## Goals / Non-Goals

**Goals:**

- CRUD completo de Proyecto (crear, editar, eliminar, listar) sobre `localStorage`.
- Bloquear la eliminación de un Proyecto con Tareas asociadas, con un mensaje claro y accionable.

**Non-Goals:**

- No implementa la Gestión de Tareas (cubierta por la change `gestion-de-tareas-y-registro-de-tiempo`), solo la verificación de si un Proyecto tiene Tareas asociadas (lectura de esa relación).
- No calcula ni muestra el tiempo total acumulado por Proyecto (cubierto por `reportes-e-historial-de-tiempo`); la tarjeta de Proyecto se entrega sin ese dato o con `0` por defecto.
- No incluye reasignación de Tareas ni eliminación en cascada.

## Decisiones

- **Store raíz vs. store de feature (ADR-012):** el store raíz (`useProjectStore`, `useTaskStore`) mantiene el CRUD crudo en `localStorage` vía `zustand/middleware`'s `persist` + `createJSONStorage` sobre el adaptador de `src/shared/persistence/`. **Revisión durante la implementación:** en vez de un segundo store de Zustand para Proyectos, la regla de bloqueo (BR-01) se implementó como un hook simple (`useProjectActions`) que compone los stores raíz de Proyecto y Tarea — no hay ningún estado de negocio propio y transitorio (sin wizard, sin máquina de estados) que justifique un store de Zustand adicional; ADR-012 reserva ese patrón para cuando sí existe tal estado. El hook sigue sin mezclar la regla de negocio dentro del store raíz.
- **Longitud y unicidad de Nombre:** máximo 100 caracteres, sin unicidad forzada (ver [RS-001](../../../docs/specs/user-stories/US-002-gestion-de-proyectos/research/RS-001-decisiones-tecnicas-pendientes/README.md)), validado de forma nativa en el formulario (`required`, `maxLength`) en vez de una capa de validación programática adicional.
- **Mensaje de bloqueo de eliminación:** mensaje específico (`"No se puede eliminar '{nombre}' porque tiene {N} Tarea(s) asociada(s). Elimina o reasigna esas Tareas primero."`), consistente con el mismo patrón usado para eliminar Tareas con Registros de Tiempo.
- **Manejo de fallo de `localStorage`:** delegado a `zustand/middleware`'s `persist`, que ya envuelve internamente cada `getItem`/`setItem` del adaptador en `try/catch` y no propaga la excepción a la UI.

## Riesgos / Trade-offs

- [Riesgo] Verificar "¿tiene Tareas asociadas?" requiere leer datos de la capability de Tareas antes de que esa change exista → Mitigación: el store raíz de Proyecto expone una consulta genérica sobre la colección de Tareas en `localStorage` (por `projectId`), independiente de que la UI de Tareas esté implementada.
- [Riesgo] Nombres duplicados de Proyecto pueden confundir al usuario en el selector de Proyecto de la pantalla de Tareas → Mitigación: aceptado como trade-off (ver RS-001); no se fuerza unicidad para evitar fricción.
