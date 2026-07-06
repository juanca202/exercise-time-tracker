# Agents

## Reglas operativas y arquitectónicas

- @.agents/MEMORY.md — memoria persistente del proyecto
- @docs/adr/README.md — índice de Architecture Decision Records (decisiones arquitectónicas vigentes)

### Consideraciones

- Si la información es arquitectónica → consultar ADRs
- Si es preferencia o regla operativa → usar MEMORY.md
- Si hay conflicto → ADRs tienen prioridad sobre MEMORY.md

## Reglas generales

### Regla clave de Next.js

Esta versión introduce cambios incompatibles: las APIs, las convenciones y la estructura de archivos pueden diferir de los datos de entrenamiento.

- Usar como referencia principal el skill `/next-best-practices`.
- Como respaldo, consultar `node_modules/next/dist/docs/`.
- No asumir que prácticas históricas de Next.js siguen vigentes.
- Atender avisos de obsolescencia.

## Stack tecnológico

- **Framework:** Next.js 16 (App Router) con React 19
- **Lenguaje:** TypeScript (modo `strict`)
- **Estilos:** Tailwind CSS 4
- **Componentes UI:** Base UI (`@base-ui/react`)
- **Estado cliente:** Zustand
- **Testing unitario/integración:** Vitest + Testing Library (jsdom)
- **Testing E2E:** Playwright
- **Calidad de código:** ESLint + Prettier + Husky + lint-staged
- **Commits:** Commitlint (Conventional Commits)
