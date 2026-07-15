# ADR-013: Convenciones de código según la Google TypeScript Style Guide

**Estado**: Accepted
**Fecha de creación**: 2026-07-15
**Última actualización**: 2026-07-15
**Decisores**: Equipo de desarrollo
**Etiquetas**: code-style, conventions, typescript, eslint, google-style-guide, gts

## Contexto

El proyecto cuenta con un Quality Gate shift-left (ver [ADR-009](ADR-009-quality-gate-shift-left.md)) compuesto por ESLint y Prettier, pero la configuración vigente (`eslint-config-next`) se centra en reglas específicas de Next.js/React y accesibilidad, sin imponer un estándar propio de convenciones de código (nombres, organización de imports, uso de tipos, estructura de módulos, etc.). Sin un estándar de estilo explícito y ampliamente adoptado en la industria, estas decisiones quedan libradas al criterio individual de cada desarrollador o se resuelven de forma ad-hoc en revisión de código, generando inconsistencia entre archivos y fricción evitable en las revisiones.

## Decision

El proyecto adopta las convenciones de código de la **Google TypeScript Style Guide** como estándar de estilo y estructura para todo el código TypeScript/JavaScript del repositorio. Estas convenciones se aplican mediante la herramienta oficial **`gts`** (Google TypeScript Style), integrada como una capa adicional de reglas de ESLint sobre la configuración existente (`eslint-config-next`, ver [ADR-009](ADR-009-quality-gate-shift-left.md)), sin reemplazarla. Ante un conflicto entre una regla de `gts` y una regla de `eslint-config-next` (en particular las de accesibilidad o las específicas de Next.js/React), prevalece la de `eslint-config-next`.

El alcance de esta decisión es el código TypeScript/JavaScript del proyecto; no incluye convenciones de HTML/CSS, dado que la capa de presentación usa Tailwind CSS utility-first (ver [ADR-002](ADR-002-uso-de-tailwind-css.md)) en lugar de CSS tradicional.

**Excepción documentada — nombrado de archivos:** la Google TypeScript Style Guide indica `snake_case` para nombres de archivo. El proyecto mantiene en su lugar **kebab-case** (guiones, p. ej. `local-storage-adapter.ts`), por ser la convención ya extendida en todo el repositorio y en las specs existentes. Esta es la única desviación intencional respecto a la guía.

**Aclaración — idioma de los identificadores:** la Google TypeScript Style Guide solo exige que los identificadores usen caracteres ASCII; no impone un idioma humano. El proyecto refuerza esto con una regla propia más estricta: todo identificador de código (nombres de clase/interfaz/tipo, funciones, métodos, variables, propiedades, componentes, hooks) se escribe en **inglés**, incluidos los nombres de archivo que los reflejan. Esto no altera el idioma del resto del proyecto (historias de usuario, tareas, criterios de aceptación, comentarios TSDoc y texto de interfaz de usuario siguen en español, ver `.agents/MEMORY.md`); la excepción aplica únicamente a los identificadores de código.

## Consecuencias

### Positivas

- Consistencia de estilo y estructura de código en todo el repositorio, independiente de quién lo escriba.
- Revisiones de código más objetivas: menos discusiones de estilo, más foco en diseño y lógica.
- Alineación con un estándar ampliamente adoptado y documentado en la industria, reduciendo la curva de entrada para nuevos desarrolladores ya familiarizados con él.

### Negativas / trade-offs

- Requiere resolver y mantener la convivencia entre dos configuraciones de ESLint (`gts` y `eslint-config-next`) a medida que ambas evolucionen.
- Puede introducir un conjunto adicional de advertencias/errores de lint al adoptarse sobre código ya existente, que deberá corregirse de forma incremental.

## Fitness function

Apto: Sí
Estado: Creada
Herramienta: gts (Google TypeScript Style) vía ESLint
Ubicación: eslint.config.mjs
Comando: npm run lint

## Referencias

- [ADR-002: Uso de Tailwind CSS como framework de presentación](ADR-002-uso-de-tailwind-css.md)
- [ADR-009: Adopción de un Quality Gate shift-left](ADR-009-quality-gate-shift-left.md)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [gts (Google TypeScript Style)](https://github.com/google/gts)
