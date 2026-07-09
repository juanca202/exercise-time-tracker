# ADR-003: Uso de Base UI como librería de componentes

Estado: Accepted
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06
Decisores: Equipo de desarrollo
Etiquetas: ui, components, base-ui, accessibility

## Contexto

El proyecto necesita componentes de interfaz interactivos (overlays, formularios, navegación, etc.) que sean accesibles y no impongan un sistema de diseño propio. Construir cada uno de estos componentes desde cero implica reimplementar patrones de accesibilidad (roles ARIA, manejo de foco, navegación por teclado) que ya están resueltos y probados en librerías especializadas, además de duplicar esfuerzo entre features.

## Decision

Los componentes de interfaz interactivos se construyen sobre [Base UI](https://base-ui.com/) (librería headless de componentes), estilizados con Tailwind CSS (ver [ADR-002](ADR-002-uso-de-tailwind-css.md)). No se introducen otras librerías de componentes headless o con estilos propios (Radix, MUI, Chakra UI, Ant Design, etc.) como convención vigente.

## Consecuencias

### Positivas

- Comportamiento y accesibilidad (ARIA, foco, teclado) consistentes out-of-the-box en todos los componentes interactivos.
- Libertad total de estilo visual al ser una librería headless, integrable directamente con Tailwind CSS.
- Menor código custom para patrones de interacción complejos (diálogos, combobox, menús, etc.).

### Negativas / trade-offs

- Dependencia de la superficie de API y del ritmo de releases de Base UI.
- Posibles vacíos de cobertura si Base UI no ofrece un patrón de componente necesario, requiriendo desarrollo custom puntual.

## Referencias

- [Base UI Documentation](https://base-ui.com/)
- [ADR-002: Uso de Tailwind CSS como framework de presentación](ADR-002-uso-de-tailwind-css.md)
