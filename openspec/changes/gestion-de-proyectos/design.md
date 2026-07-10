## Context

Time Tracker es offline-first: no hay backend, toda la información vive en el dispositivo. El manejo de estado global usa Zustand exclusivamente ([ADR-004](../../../docs/adr/ADR-004-uso-de-zustand.md)) y la persistencia local usa `localStorage` vía el middleware `persist` de Zustand ([ADR-011](../../../docs/adr/ADR-011-uso-de-localstorage-para-persistencia.md)). La arquitectura del código es feature-based bajo `src/features/` ([ADR-005](../../../docs/adr/ADR-005-arquitectura-feature-based.md)). `project-management` es la capability base de la aplicación: no depende de ninguna otra, pero `task-time-tracking` (US-30272) sí depende de ella para asociar Tareas a un Proyecto, por lo que el modelo de datos del Proyecto y su identificador deben quedar estables antes de esa implementación.

## Goals / Non-Goals

**Goals:**

- Definir el modelo de datos de Proyecto y su identificador estable (referenciado por Tarea).
- Definir cómo se calcula el Tiempo Registrado por Proyecto sin acoplar el store de Proyectos al store de Tareas/Registros.

**Non-Goals:**

- Edición o eliminación de Proyectos (no forma parte de US-30273).
- Creación o listado de Tareas (cubierta por `task-time-tracking`, change `gestion-de-tareas`).
- Filtrado del Tiempo Registrado por periodo (eso es historial, cubierto por la capability de historial, change `historial-de-registros`); aquí el total es acumulado sin filtro de fecha.

## Decisions

- **Store de Proyectos independiente y persistido por separado:** un store de Zustand propio para `Project`, con `persist` sobre `localStorage` bajo su propia clave (p. ej. `time-tracker:projects`), separado del store de Tareas/Registros de Tiempo — mismo criterio anti-"god store" aplicado en el design de `gestion-de-tareas`.
- **Tiempo Registrado por Proyecto como valor derivado, no almacenado:** se calcula en tiempo de lectura leyendo los Registros de Tiempo del store de Tareas/Registros y sumando los que correspondan a Tareas del Proyecto — evita mantener un contador denormalizado que pueda desincronizarse del detalle real.
- **Identificador de Proyecto generado localmente:** un id único generado en el cliente (p. ej. `crypto.randomUUID()`) al crear el Proyecto, ya que no existe backend que lo asigne.

## Risks / Trade-offs

- [Acoplamiento entre stores para calcular el total] → el store de Proyectos no importa el store de Tareas directamente; el cálculo del total se expone como un selector/hook de la capa de features que combina ambos stores, manteniendo cada store independiente y testeable por separado.
- [Recalcular la suma en cada render con muchas Tareas/Registros] → aceptable para el volumen de uso personal esperado (ver ADR-011); no se introduce memoización adicional en esta capability salvo que el rendimiento lo justifique.
