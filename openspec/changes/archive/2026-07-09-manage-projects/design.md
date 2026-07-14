## Context

Time Tracker es una aplicación offline-first (SRS-001, sección 2.4): toda la información se persiste exclusivamente en el almacenamiento local del dispositivo, sin backend ni sincronización externa. Esta es la primera capability implementada en el proyecto — no existe todavía código de features (`src/features/` está vacío) — por lo que sienta el patrón que seguirán `track-task-time` y `view-time-history`.

El proyecto ya fija, vía ADR, el stack a usar: App Router exclusivo (ADR-001), Tailwind CSS (ADR-002), Base UI (ADR-003), Zustand para estado global (ADR-004), arquitectura feature-based (ADR-005) y `localStorage` a través del middleware `persist` de Zustand como único mecanismo de almacenamiento local (ADR-011).

## Goals / Non-Goals

**Goals:**

- Definir el modelo de datos de Proyecto y su store Zustand persistido en `localStorage`.
- Cubrir creación, listado y cálculo del tiempo total registrado por Proyecto (AC-001 a AC-005 de US-30273).
- Establecer la convención de carpeta (`src/features/projects/`) y de store persistido que reutilizarán las capabilities siguientes (tareas, historial).

**Non-Goals:**

- Edición o eliminación de Proyectos (no está en el alcance de US-30273; solo creación y visualización).
- Asociar Tareas a un Proyecto o registrar tiempo (cubierto por el change `track-task-time`).
- Migración a IndexedDB u otro motor de almacenamiento (fuera de alcance mientras ADR-011 siga vigente).

## Decisions

- **Modelo de datos**: `Project { id: string; name: string; description?: string; createdAt: string }`. El `id` se genera con `crypto.randomUUID()` (disponible de forma nativa en el navegador, sin dependencias nuevas).
- **Store**: un store de Zustand en `src/features/projects/store/projectsStore.ts`, persistido con `persist` + `createJSONStorage(() => localStorage)` bajo la clave `time-tracker/projects`, conforme a ADR-011.
- **Tiempo Registrado por proyecto**: se deriva (no se persiste) como una selección/selector sobre los Registros de Tiempo de las Tareas del proyecto. Hasta que exista el store de Registros de Tiempo (`track-task-time`), el selector retorna 0 para todo proyecto — evita acoplar este change a una capability que aún no existe.
- **Validación**: el Nombre es obligatorio (AC-001, TC-003); se valida en el formulario del modal antes de invocar la acción de creación del store, sin persistir estados inválidos.

## Risks / Trade-offs

- [El cálculo de tiempo total depende de datos que otro change introducirá] → Mitigación: el selector se diseña para leer de un store de Registros de Tiempo por nombre/interfaz conocida (aunque aún no exista), de forma que `track-task-time` solo necesite implementar ese store sin tocar `project-management`.
- [`localStorage` tiene una cuota de ~5 MiB (ADR-011)] → Mitigación: fuera de alcance de este change; ya asumido y documentado en ADR-011 para todo el dominio.

## Referencias

- [ADR-005: Arquitectura del proyecto basada en features](../../../docs/adr/ADR-005-arquitectura-feature-based.md)
- [ADR-011: Uso de localStorage vía Zustand persist para el almacenamiento local](../../../docs/adr/ADR-011-persistencia-local-con-localstorage.md)
