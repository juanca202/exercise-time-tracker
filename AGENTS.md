# Agents

## Reglas operativas y arquitectónicas

- @.agents/MEMORY.md — memoria persistente del proyecto
- @docs/adr/README.md — índice de Architecture Decision Records (decisiones arquitectónicas vigentes)

### Consideraciones

- Si la información es arquitectónica → consultar ADRs
- Si es preferencia o regla operativa → usar MEMORY.md
- Si hay conflicto → ADRs tienen prioridad sobre MEMORY.md

## Stack tecnológico

- **Framework**: Next.js 16.2.10 — enrutamiento vía App Router (`src/app/`) según [ADR-001](docs/adr/ADR-001-adopcion-exclusiva-app-router.md).
- **UI**: React 19.2.4
- **Lenguaje**: TypeScript 5 (modo `strict`)
- **Estilos**: Tailwind CSS 4 (vía `@tailwindcss/postcss`) según [ADR-002](docs/adr/ADR-002-uso-de-tailwind-css.md).
- **Componentes**: Base UI (`@base-ui/react`) según [ADR-003](docs/adr/ADR-003-uso-de-base-ui.md).
- **Manejo de estado**: Zustand según [ADR-004](docs/adr/ADR-004-uso-de-zustand.md).
- **Arquitectura**: basada en features (`src/features/`, `src/shared/`) según [ADR-005](docs/adr/ADR-005-arquitectura-feature-based.md).
- **Documentación de código**: TSDoc (`eslint-plugin-tsdoc`) según [ADR-006](docs/adr/ADR-006-documentacion-con-tsdoc.md).
- **Testing unitario**: Vitest + Testing Library (`@testing-library/react`, `jsdom`) según [ADR-007](docs/adr/ADR-007-estrategia-pruebas-unitarias.md).
- **Testing E2E**: Playwright (`@playwright/test`) según [ADR-008](docs/adr/ADR-008-uso-de-playwright-para-e2e.md).
- **Quality gate**: ESLint 9 (`eslint-config-next`), Prettier, Husky + lint-staged (pre-commit) y Sonar Scanner, según [ADR-009](docs/adr/ADR-009-quality-gate-shift-left.md).
- **Branching y commits**: GitFlow (`main`/`develop`) con Conventional Commits validados por commitlint (hook `commit-msg` de Husky), según [ADR-010](docs/adr/ADR-010-branching-gitflow-conventional-commits.md).
- **Bundler/dev server**: Turbopack (configurado en `next.config.ts`)
- **Gestor de paquetes**: pnpm (`pnpm-lock.yaml`)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
