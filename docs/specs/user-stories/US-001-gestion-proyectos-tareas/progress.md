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
  Estado: Done
  Implementador: "juanca202"
  Archivos:
  - src/app/globals.css
  - src/app/layout.tsx
  - src/components/button.tsx
  - src/components/modal.tsx
  - src/components/field.tsx
  - src/components/textarea-field.tsx
  - src/components/select-field.tsx
  - src/components/button.test.tsx
  - src/components/modal.test.tsx
  - src/components/select-field.test.tsx
    Notas:
  - Se agregó también un test de `SelectField` (no listado explícitamente en el plan) por ser el componente más complejo (Base UI Select + portal); confirma que renderiza, selecciona opción y se deshabilita sin opciones.
    Decisiones adicionales:
  - `TextareaField` usa `<textarea>` nativo (Base UI no expone un primitivo de textarea), conforme al orden de prioridad de ADR-006.
  - `Field`/`TextareaField`/`SelectField` implementan su propio mensaje de error controlado (prop `error`) en lugar de la validación nativa de `Field.Root`/`Field.Error`, porque la validación del dominio es síncrona y controlada desde los componentes de historia (no basada en `ValidityState`).
  - Se eliminó el soporte de `prefers-color-scheme: dark` de `globals.css`: `DESIGN.md` (Precision Focus) no define paleta oscura.

- TK-003 Layout de aplicación y navegación lateral
  Estado: Done
  Implementador: "juanca202"
  Archivos:
  - src/features/time-tracking/components/sidebar.tsx
  - src/features/time-tracking/components/sidebar.test.tsx
  - src/app/layout.tsx
  - src/app/page.tsx
    Notas:
  - `npm run build` verificado en verde tras el cambio (redirect en "/" no requiere que /tasks exista aún en build time).
    Decisiones adicionales:
  - Ancho del sidebar aplicado como valor arbitrario `w-[280px]` (no hay step de espaciado Tailwind exacto para 280px).

- TK-004 Vista "Proyectos" y modal "Nuevo Proyecto"
  Estado: Done
  Implementador: "juanca202"
  Archivos:
  - src/features/time-tracking/lib/totals.ts
  - src/features/time-tracking/lib/totals.test.ts
  - src/features/time-tracking/components/new-project-modal.tsx
  - src/features/time-tracking/components/project-grid.tsx
  - src/features/time-tracking/components/project-grid.test.tsx
  - src/app/projects/page.tsx
    Notas:
  - `npm run build` en verde; ruta `/projects` generada como estática.
    Decisiones adicionales:
  - Se añadió `formatHoursAndMinutes(seconds)` a `totals.ts` (formato "Nh MMm") para las tarjetas de tiempo total; es un formato distinto del `formatDuration` HH:MM:SS que introducirá TK-002 de US-002 para el temporizador en vivo. Se reutilizará en la vista de Historial (US-003).

- TK-005 Vista "Tareas" (esqueleto) y modal "Nueva Tarea"
  Estado: Pending
  Implementador: "juanca202"
  Archivos: []
  Notas: []
  Decisiones adicionales: []
