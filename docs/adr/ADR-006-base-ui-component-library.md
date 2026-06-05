# ADR-006: Librería de componentes UI con Base UI

- Estado: Accepted
- Fecha de creación: 2026-05-28
- Última actualización: 2026-05-28
- Decisores: Tech lead
- Etiquetas: ui, componentes, base-ui, react, accesibilidad, arquitectura

## Contexto

La aplicación necesita controles interactivos consistentes (formularios, diálogos, menús, selects, etc.) en Next.js 16 y React 19 ([ADR-001](ADR-001-app-router-only.md)). Sin una decisión explícita, el equipo podría mezclar primitivas de distintas librerías, reimplementar patrones complejos (focus trap, portales, teclado) o depender solo de HTML nativo, aumentando deuda de accesibilidad y mantenimiento.

Los estilos del producto están fijados en [ADR-002](ADR-002-tailwind-ui-styling.md) con Tailwind CSS v4 y `DESIGN.md`. Se requiere una librería de **componentes sin estilos propietarios** que aporte comportamiento, composición y accesibilidad, dejando la capa visual a Tailwind y a los tokens del proyecto.

La organización por features ([ADR-004](ADR-004-feature-based-architecture.md)) prevé componentes de presentación reutilizables en `src/components/`; conviene definir qué primitiva de UI usa el equipo por defecto.

## Decision

El proyecto adoptará **`@base-ui/react` (Base UI)** como **librería de componentes por defecto** para construir la interfaz.

Documentación de referencia para agentes y desarrolladores: [Base UI — índice para LLMs](https://base-ui.com/llms.txt).

### Orden de prioridad al implementar UI

1. **Base UI** — usar el componente o utilidad de Base UI que cubra el caso (p. ej. `Button`, `Input`, `Select`, `Dialog`, `Checkbox`, `Field`, `Form`), estilizado con clases Tailwind según [ADR-002](ADR-002-tailwind-ui-styling.md) y `DESIGN.md`.
2. **HTML nativo semántico** — solo cuando Base UI no ofrezca un primitivo adecuado, el caso sea trivial (texto, contenedores sin interacción compleja) o un elemento nativo sea suficiente sin sacrificar accesibilidad.

No invertir el orden: no introducir un `<div>` clickeable o un `<select>` nativo estilizado ad hoc si existe un equivalente razonable en Base UI para ese patrón.

### Relación con estilos y arquitectura

- Base UI es **styling-agnostic** (sin tema embebido); los estilos se aplican con **Tailwind** en el proyecto, no compiten con [ADR-002](ADR-002-tailwind-ui-styling.md).
- Los **wrappers de diseño** del producto (p. ej. `Button`, `TextField`, `Modal`) viven en `src/components/` o en la capa de UI de una feature, componiendo primitivas de `@base-ui/react` y tokens de `DESIGN.md`.
- Los componentes que usen estado del DOM, eventos o APIs de Base UI que requieran cliente deben ser **Client Components** cuando corresponda ([ADR-001](ADR-001-app-router-only.md)).
- Consultar la documentación oficial de cada componente (enlaces desde [llms.txt](https://base-ui.com/llms.txt)) antes de APIs nuevas; los ejemplos Tailwind del sitio asumen **Tailwind v4**, alineado con el repo.

### Alcance y exclusiones

- **Paquete estándar:** `@base-ui/react` (y subpaths documentados por Base UI).
- **Fuera de alcance** como librería principal de primitivas: Radix Themes, MUI, Chakra, Ant Design y kits con estilos propietarios que sustituyan el sistema Tailwind + `DESIGN.md` ([ADR-002](ADR-002-tailwind-ui-styling.md)).
- **shadcn/ui** u otros copiar-pegar sobre otra base: no son la fuente de verdad del proyecto salvo decisión futura explícita; si se reutiliza un patrón, debe adaptarse a Base UI + Tailwind del repo.
- Este ADR no prescribe implementación concreta (instalación en `package.json`, wrappers nombrados); solo la elección tecnológica y el orden de preferencia.

## Alternativas consideradas

- **Solo HTML nativo:** menor dependencia, pero mayor costo en accesibilidad, teclado y comportamiento avanzado (modales, combobox, etc.).
- **Radix UI / primitivas similares:** solape funcional con Base UI (mismo ecosistema de ideas); Base UI se elige como estándar único documentado y mantenido para este producto, con referencia central en [llms.txt](https://base-ui.com/llms.txt).
- **Librerías con estilos incluidos (MUI, etc.):** conflicto con la estrategia Tailwind + `DESIGN.md`; descartadas como base del producto.

## Consecuencias

### Positivas

- Comportamiento y accesibilidad consistentes en controles complejos sin acoplar estilos al vendor.
- Alineación con Tailwind v4 y `DESIGN.md` mediante wrappers propios.
- Documentación machine-friendly (`llms.txt`) para agentes y revisión de código.
- Orden de prioridad claro reduce debates en PR (“¿Base UI o nativo?”).

### Negativas / trade-offs

- Nueva dependencia (`@base-ui/react`) y curva de aprendizaje de APIs composables.
- Wrappers en `src/components/` añaden capa de mantenimiento respecto a usar Base UI directamente en features.
- Algunos primitivos requieren Client Components; hay que respetar límites RSC.
- Hasta instalar y configurar el paquete, el ADR es decisión anticipada respecto al `package.json` actual.

## Referencias

- [Base UI — llms.txt (índice de documentación)](https://base-ui.com/llms.txt)
- [Base UI — Quick start](https://base-ui.com/react/overview/quick-start.md)
- [Base UI — Styling](https://base-ui.com/react/handbook/styling.md)
- [Base UI — Accessibility](https://base-ui.com/react/overview/accessibility.md)
- [ADR-001: Enrutamiento exclusivo con App Router](ADR-001-app-router-only.md)
- [ADR-002: Estrategia de estilos UI con Tailwind CSS](ADR-002-tailwind-ui-styling.md)
- [ADR-004: Estructura del proyecto con arquitectura por features](ADR-004-feature-based-architecture.md)
- `DESIGN.md` — sistema visual del producto
- [Documenting Architecture Decisions — Cognitect](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
