# TK-001: Tipos de dominio compartidos

**Estado**: Ready
**Historia**: [US-000](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Definir en un único módulo compartido los tipos de dominio de Proyecto, Tarea, Registro de Tiempo y Temporizador Activo, con todos sus campos derivados de los requisitos funcionales (SRS-001 RF-001 a RF-013) y sin campos placeholder ni marcados como "por definir", de modo que Proyectos, Tareas e Historial de registros los consuman de forma idéntica desde su primer commit.

## Dependencias

- TypeScript 5 (modo `strict`) — los tipos se definen sin `any` ni aserciones, aprovechando el chequeo estricto del compilador.

## Referencias

- **Arquitectura:** [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) (ubicación en módulo compartido), [ADR-006: Documentación de código con TSDoc](../../../adr/ADR-006-documentacion-con-tsdoc.md) (documentación de los tipos públicos).
- **Documentación técnica:** [SRS-001: Especificación de Requisitos - Time Tracker](../../requirements/SRS-001-timetracker-app/README.md) (RF-001 a RF-013, restricción 2.4) — fuente de los campos de cada tipo.

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── shared/
        └── domain/
            └── + types.ts   # Proyecto, Tarea, RegistroDeTiempo, TemporizadorActivo
```

## Plan de implementación

- [ ] **IT-01** — Definir `Proyecto` (`id: string`, `nombre: string`, `descripcion?: string`).
      Nombre obligatorio, descripción opcional, según RF-001/RF-002.
- [ ] **IT-02** — Definir `Tarea` (`id: string`, `proyectoId: string`, `nombre: string`).
      Según RF-003/RF-004 y la restricción 2.4 (una Tarea pertenece obligatoriamente a un único Proyecto).
- [ ] **IT-03** — Definir `RegistroDeTiempo` (`id: string`, `tareaId: string`, `fecha: string`, `duracionMinutos: number`, `origen: "temporizador" | "manual"`).
      `fecha` en formato ISO 8601 (`YYYY-MM-DD`), consumida por el helper de mes calendario (TK-004). `origen` distingue el flujo automatizado (RF-005–RF-009) del manual (RF-011). Según RF-006, RF-009, RF-011 y la restricción 2.4 (un Registro pertenece obligatoriamente a una única Tarea; duración > 0 por RF-010/RF-013).
- [ ] **IT-04** — Definir `TemporizadorActivo` (`tareaId: string`, `inicio: string`).
      `inicio` en formato ISO 8601 (datetime). Según RF-005–RF-008 y la restricción 2.4 (un único temporizador activo a la vez en toda la aplicación). Este módulo solo define el tipo; su ausencia (ningún temporizador corriendo) se modela como `null` en quien lo consuma — el almacenamiento del temporizador activo queda fuera de alcance de esta historia (ver Observaciones de US-000).
- [ ] **IT-05** — Documentar cada tipo y cada campo no evidente por su nombre con TSDoc, según ADR-006.
