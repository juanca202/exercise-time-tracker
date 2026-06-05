<!--
Sync Impact Report
- Version change: (unratified template) → 1.0.0
- Modified principles: N/A (initial ratification from template placeholders)
- Added sections:
  - Core Principles (5 principles)
  - Restricciones técnicas y stack
  - Flujo de calidad y entrega
  - Governance
- Removed sections: none (placeholders replaced)
- Templates:
  - .specify/templates/plan-template.md ✅ updated (Constitution Check gates)
  - .specify/templates/tasks-template.md ✅ updated (TDD mandatory, not optional)
  - .specify/templates/spec-template.md ✅ reviewed (no change required)
  - .specify/templates/commands/*.md ⚠ N/A (directory does not exist)
  - README.md ⚠ pending (still create-next-app boilerplate; no constitution refs)
  - AGENTS.md ✅ reviewed (already references ADRs and specialist agents)
- Deferred TODOs: none
-->

# Time Tracker Constitution

## Core Principles

### I. Desarrollo guiado por especificación (NON-NEGOTIABLE)

Toda feature MUST iniciarse con artefactos Spec Kit bajo `specs/<feature>/`:
`spec.md` → `plan.md` → `tasks.md` antes de implementación.

Las user stories MUST ser independientes, priorizadas (P1, P2, …) y verificables
sin depender de historias posteriores para entregar un MVP.

**Rationale**: Evita implementación ad hoc, mantiene trazabilidad requisito→código y
permite entregas incrementales revisables.

### II. Arquitectura por features

El código de aplicación MUST residir bajo `src/` con módulos de dominio en
`src/features/<feature>/` (componentes, store, lib, testing co-located).

`src/app/` MUST limitarse a rutas, layouts y composición; la lógica de negocio
MUST NOT vivir en páginas del App Router.

Componentes UI genéricos van en `src/components/ui/`; infraestructura transversal
en `src/lib/`.

**Rationale**: Cohesión por capacidad de negocio ([ADR-004](../../docs/adr/ADR-004-feature-based-architecture.md)).

### III. Test-First / TDD (NON-NEGOTIABLE)

Los módulos con lógica de negocio MUST seguir ciclo RED → GREEN → REFACTOR:

1. Escribir test co-located (`*.test.ts(x)`) que falle.
2. Implementar el mínimo código para pasar.
3. Refactorizar sin romper tests.

Tests MUST usar patrón AAA y Object Mothers para datos repetidos.
Cobertura de ramas MUST alcanzar ≥ 80 % en `lib/`, `store/` y componentes con
lógica de negocio antes de merge.

**Rationale**: Calidad verificable y diseño emergente ([ADR-005](../../docs/adr/ADR-005-unit-testing-strategy.md)).

### IV. Decisiones técnicas gobernadas por ADR

Cambios arquitectónicos MUST documentarse en `docs/adr/` antes o junto con la
implementación. Los ADRs Accepted son gates obligatorios en `plan.md`.

Stack vigente (no sustituir sin nuevo ADR):

- Next.js 16 App Router exclusivo ([ADR-001](../../docs/adr/ADR-001-app-router-only.md))
- Tailwind CSS v4 para estilos ([ADR-002](../../docs/adr/ADR-002-tailwind-ui-styling.md))
- Zustand para estado cliente ([ADR-003](../../docs/adr/ADR-003-zustand-state-management.md))
- Base UI para primitivas accesibles ([ADR-006](../../docs/adr/ADR-006-base-ui-component-library.md))

**Rationale**: Decisiones explícitas, auditables y consistentes entre features.

### V. Simplicidad y entrega incremental

Preferir la solución más simple que cumpla la spec. YAGNI: no añadir backend,
auth, observabilidad ni abstracciones hasta que un requisito lo exija.

Cada user story MUST ser desplegable y demostrable de forma independiente tras su
checkpoint en `tasks.md`.

**Rationale**: Reduce deuda técnica y acelera feedback en productos pequeños.

## Restricciones técnicas y stack

| Área      | Regla                                                       |
| --------- | ----------------------------------------------------------- |
| Lenguaje  | TypeScript strict; Node.js 20+                              |
| Framework | Next.js 16 + React 19; convenciones actuales del App Router |
| Estilos   | Tailwind v4; tokens alineados con `DESIGN.md` cuando exista |
| Estado    | Zustand; persistencia local solo si la spec lo define       |
| UI        | Base UI headless + wrappers en `src/components/ui/`         |
| Tests     | Vitest + Testing Library + jsdom                            |
| i18n UI   | Español por defecto salvo spec explícita                    |
| Commits   | Conventional Commits; hooks de lint/format activos          |

Las convenciones de agentes (`AGENTS.md`) y memoria del proyecto
(`.agents/MEMORY.md`) complementan esta constitución; en conflicto, esta
constitución y los ADRs Accepted prevalecen sobre preferencias ad hoc.

## Flujo de calidad y entrega

1. **Specify** — spec con escenarios Given/When/Then y criterios medibles.
2. **Plan** — research, data-model, contracts; Constitution Check en `plan.md`.
3. **Tasks** — desglose TDD con pares RED/GREEN y checkpoints por user story.
4. **Implement** — ejecutar `tasks.md`; marcar tareas completadas; tests en verde.
5. **Gate** — `npm run test:run`, `npm run lint`, `npm run build` antes de merge.

Agentes especializados MUST usarse según `AGENTS.md`: UI (`ui-specialist`),
testing (`quality-specialist`), documentación (`docs-specialist`).

Code review MUST ejecutarse antes de integrar; veredicto **Apto** requerido.

## Governance

Esta constitución supersede prácticas informales del equipo cuando entren en
conflicto.

**Enmiendas**: Proponer cambio vía `/speckit-constitution`; incrementar versión
semántica; actualizar plantillas afectadas; registrar en Sync Impact Report.

**Versionado**:

- MAJOR: eliminación o redefinición incompatible de principios.
- MINOR: nuevo principio o expansión material de gates.
- PATCH: clarificaciones sin cambio semántico.

**Cumplimiento**: Todo PR MUST verificar Constitution Check en `plan.md` y ADRs
aplicables. Violaciones MUST documentarse en Complexity Tracking o resolverse
antes de merge.

**Guía operativa**: `AGENTS.md`, `.agents/MEMORY.md`, skill `next-best-practices`,
ADRs en `docs/adr/`.

**Version**: 1.0.0 | **Ratified**: 2026-05-29 | **Last Amended**: 2026-05-29
