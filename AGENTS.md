# Agents

## Contexto estático
- @.agents/MEMORY.md — memoria persistente del proyecto
- @docs/adr/README.md — índice de Architecture Decision Records (decisiones arquitectónicas vigentes)

## Regla de precedencia

- Si la información es arquitectónica → consultar ADRs
- Si es preferencia o regla operativa → usar MEMORY.md
- Si hay conflicto → ADRs tienen prioridad sobre MEMORY.md

## Regla clave de Next.js

Esta versión introduce cambios incompatibles: las APIs, las convenciones y la estructura de archivos pueden diferir de los datos de entrenamiento.

- Usar como referencia principal el skill `/next-best-practices`.
- Como respaldo, consultar `node_modules/next/dist/docs/`.
- No asumir que prácticas históricas de Next.js siguen vigentes.
- Atender avisos de obsolescencia.

## Uso obligatorio de agentes especializados

- Implementación HTML/UI: usar `/ui-specialist.md`.
- Testing: usar `/quality-specialist.md`.
- Documentación: usar `/docs-specialist.md`.
