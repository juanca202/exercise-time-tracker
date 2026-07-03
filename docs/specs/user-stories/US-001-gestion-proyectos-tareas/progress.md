# Progreso

## Trabajo: US-001-gestion-proyectos-tareas

- Tipo: historia de usuario
- Última actualización: 2026-07-03

### Unidades

- TK-001 Modelo de dominio y capa de persistencia local
  Estado: Done
  Implementador: "juanca202"
  Archivos:
  - src/features/time-tracking/types/domain.ts
  - src/features/time-tracking/lib/storage.ts
  - src/features/time-tracking/lib/id.ts
  - src/features/time-tracking/store/time-tracking-store.ts
  - src/features/time-tracking/testing/object-mothers.ts
  - vitest.config.ts (umbral de cobertura de ramas 80%)
    Notas:
  - Cobertura de ramas de este TK: 85% (17/20), por encima del umbral de ADR-005.
    Decisiones adicionales:
  - Se añadió `anActiveTimer()` al Object Mother compartido en este TK (aunque `ActiveTimer` se usa recién en US-002) para no duplicar el archivo de testing entre historias.
  - Se instaló `@vitest/coverage-v8` (no estaba en package.json) y se configuró `coverage.thresholds.branches: 80` en `vitest.config.ts`, acotado a `src/features/**/lib/**` y `src/features/**/store/**` (lógica crítica) conforme a ADR-005.

- TK-002 Componentes UI base y tokens de diseño
  Estado: Pending
  Implementador: "juanca202"
  Archivos: []
  Notas: []
  Decisiones adicionales: []

- TK-003 Layout de aplicación y navegación lateral
  Estado: Pending
  Implementador: "juanca202"
  Archivos: []
  Notas: []
  Decisiones adicionales: []

- TK-004 Vista "Proyectos" y modal "Nuevo Proyecto"
  Estado: Pending
  Implementador: "juanca202"
  Archivos: []
  Notas: []
  Decisiones adicionales: []

- TK-005 Vista "Tareas" (esqueleto) y modal "Nueva Tarea"
  Estado: Pending
  Implementador: "juanca202"
  Archivos: []
  Notas: []
  Decisiones adicionales: []
