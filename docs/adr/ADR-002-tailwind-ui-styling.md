# ADR-002: Estrategia de estilos UI con Tailwind CSS

- Estado: Accepted
- Fecha de creación: 2026-05-28
- Última actualización: 2026-05-28
- Decisores: Tech lead
- Etiquetas: ui, estilos, tailwindcss, css, diseño

## Contexto

La interfaz del proyecto requiere una estrategia de estilos coherente, mantenible y alineada con Next.js 16 y React 19. Sin una decisión explícita, el equipo podría mezclar enfoques (CSS Modules, CSS-in-JS, hojas globales ad hoc, utilidades inline) y fragmentar el diseño visual.

El repositorio ya incluye Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/postcss`) y carga la capa de utilidades en `app/globals.css` mediante `@import "tailwindcss"`, con tokens definidos en `@theme inline`. Existe además `DESIGN.md` como referencia de paleta, tipografía y componentes visuales del producto.

## Decision

La **estrategia de estilos UI** del proyecto será **Tailwind CSS** (v4, convención actual del repo) como mecanismo principal para aplicar estilos en componentes y páginas.

- Los estilos de componentes se expresan con **clases de utilidad de Tailwind** en JSX/TSX.
- La configuración global y los **design tokens** compartidos viven en `app/globals.css` (p. ej. `@theme inline`, variables CSS en `:root`).
- `DESIGN.md` define el **sistema visual** (colores, espaciado, patrones); Tailwind es la capa de implementación, no un sustituto de esa guía.
- La implementación UI debe seguir el agente `/ui-specialist.md`, que prioriza el stack y el sistema de diseño ya presentes en el repositorio.

Queda **fuera de alcance** como estrategia principal: CSS-in-JS (styled-components, Emotion), librerías de componentes con estilos propietarios como base del producto, y la introducción de un segundo framework de utilidades en paralelo.

El uso puntual de **CSS Modules** o CSS plano queda limitado a casos excepcionales (p. ej. animaciones complejas o integraciones de terceros) y debe justificarse en revisión de código.

## Consecuencias

### Positivas

- Coherencia con el scaffolding actual y con PostCSS/Tailwind v4 ya integrados en el build.
- Estilos colocalizados con el markup, facilitando iteración en componentes React y App Router.
- Tokens centralizados en `globals.css` alineables con `DESIGN.md` vía `@theme` y variables CSS.
- Menor superficie de dependencias frente a soluciones CSS-in-JS en runtime.

### Negativas / trade-offs

- Markup con muchas clases de utilidad puede volverse verboso; conviene extraer patrones repetidos a componentes reutilizables.
- El equipo debe conocer convenciones de Tailwind v4 (distintas en parte de v3) y la documentación vigente.
- Desviarse de `DESIGN.md` sin actualizar tokens en `globals.css` puede producir inconsistencia visual.

## Referencias

- [Tailwind CSS — Documentación](https://tailwindcss.com/docs)
- [ADR-001: Enrutamiento exclusivo con App Router](ADR-001-app-router-only.md)
- `DESIGN.md` — sistema visual del producto
- `app/globals.css` — import de Tailwind y tokens `@theme`
- `AGENTS.md` — uso de `/ui-specialist.md` para implementación UI
