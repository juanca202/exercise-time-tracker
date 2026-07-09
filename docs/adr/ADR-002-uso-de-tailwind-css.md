# ADR-002: Uso de Tailwind CSS como framework de presentación

Estado: Accepted
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06
Decisores: Equipo de desarrollo
Etiquetas: css, styling, tailwindcss, presentation

## Contexto

El proyecto requiere una convención de estilos consistente en toda la capa de presentación. Sin un enfoque unificado, la coexistencia de distintas soluciones de estilado (CSS Modules, CSS-in-JS, clases utilitarias ad-hoc) fragmenta el sistema de diseño, dificulta el mantenimiento y complica el onboarding de nuevos desarrolladores.

## Decision

Todos los estilos de la capa de presentación se implementan usando Tailwind CSS (utility-first). No se introducen otras soluciones de estilado (CSS Modules, styled-components, CSS-in-JS, etc.) como convención vigente. Los ajustes de tema (colores, tipografías, espaciados) se centralizan en la configuración de Tailwind en lugar de definirse de forma dispersa por componente.

## Consecuencias

### Positivas

- Consistencia visual en toda la aplicación al compartir un único sistema de diseño (tokens de Tailwind).
- Bundle de CSS optimizado: solo se incluyen las clases utilitarias efectivamente usadas.
- Mayor velocidad de desarrollo al no alternar entre archivos de componente y de estilos.

### Negativas / trade-offs

- Curva de aprendizaje del enfoque utility-first para quienes vienen de CSS tradicional o CSS-in-JS.
- El marcado (JSX/HTML) puede volverse verboso cuando un elemento acumula muchas clases utilitarias.

## Referencias

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
