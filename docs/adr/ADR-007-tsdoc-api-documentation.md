# ADR-007: Documentación de código con TSDoc

- Estado: Accepted
- Fecha de creación: 2026-05-28
- Última actualización: 2026-05-28
- Decisores: Tech lead
- Etiquetas: documentación, tsdoc, typescript, calidad, mantenibilidad

## Contexto

El proyecto está escrito en **TypeScript** (`package.json`) y organiza el código por features ([ADR-004](ADR-004-feature-based-architecture.md)), con hooks, servicios, utilidades y componentes compartidos que otros módulos consumen. Sin convenciones explícitas, la documentación de APIs internas queda dispersa (comentarios ad hoc, README desactualizados o ausencia de contexto en el IDE), lo que ralentiza revisiones, onboarding y el trabajo de agentes de IA que generan código.

Se necesita un estándar ligero, alineado con el ecosistema TypeScript, que documente **qué hace** y **cómo usar** el código reutilizable sin duplicar la implementación ni documentar ruido en piezas triviales.

## Decision

El proyecto adopta **[TSDoc](https://tsdoc.org/)** como formato estándar de documentación en el código fuente para APIs reutilizables y públicas.

### Idioma del contenido

Los bloques TSDoc (`/** ... */`) se redactan en el **idioma preferido del proyecto** definido en `.agents/MEMORY.md` (`preferred language: es`). Si no existe esa clave, se usa el idioma del mensaje o acuerdo del equipo y se persiste en `MEMORY.md`.

### Momento de redacción

La documentación TSDoc se escribe **mientras se genera o modifica el código** que entra en alcance (no como tarea diferida). En revisiones de PR, la ausencia de TSDoc en código nuevo que cumple los criterios de abajo se trata como incumplimiento de convención, salvo excepción justificada en la descripción del cambio.

### Cuándo documentar (alcance obligatorio)

Se documentan con TSDoc, como mínimo la descripción del símbolo exportado y los parámetros/retorno cuando aplique:

| Ámbito                        | Ejemplos en el repo                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| Hooks reutilizables           | Hooks en `src/features/*/hooks/` o `src/shared/hooks/` consumidos por más de un módulo    |
| Services                      | Capa de acceso a datos, APIs o orquestación de dominio                                    |
| Utilidades complejas          | Funciones con reglas de negocio, validaciones no obvias o varios parámetros opcionales    |
| SDKs internos                 | Módulos pensados para consumo cross-feature                                               |
| Componentes compartidos       | UI en `src/shared/` o design system interno                                               |
| Librerías / paquetes internos | Cualquier módulo publicado como API estable para otras features                           |
| Funciones públicas            | Exportaciones desde `index.ts` de features o `shared` destinadas a uso externo al archivo |

### Cuándo no documentar (fuera de alcance)

No se exige TSDoc en:

- **Componentes simples** de presentación sin API reutilizable (props estándar de React evidentes por tipos).
- **Lógica trivial** (helpers de una línea, getters obvios, constantes autodescriptivas).
- **Handlers pequeños** locales (p. ej. `onClick` inline, route handlers de unas pocas líneas sin contrato reutilizable).

Si un handler o utilidad **crece** hasta ser reutilizable o exportado, pasa a estar en alcance y debe documentarse en el mismo cambio que introduce esa responsabilidad.

### Convenciones mínimas

- Usar bloques `/** ... */` compatibles con TSDoc; evitar JSDoc con etiquetas obsoletas no soportadas por el toolchain del proyecto.
- Documentar `@param`, `@returns` y `@throws` cuando el contrato no sea obvio solo con los tipos de TypeScript.
- Incluir `@example` cuando el uso correcto no sea evidente (hooks con efectos, factories, opciones de configuración).
- No repetir en prosa lo que ya expresan los tipos; añadir semántica, invariantes y efectos secundarios relevantes.
- Mantener comentarios en español (o el idioma preferido vigente) de forma consistente con el resto de la documentación del proyecto.

### Relación con otros artefactos

- Los **ADRs** y specs en `docs/` registran decisiones arquitectónicas y requisitos; **no sustituyen** TSDoc en código ejecutable.
- Las pruebas ([ADR-005](ADR-005-unit-testing-strategy.md)) validan comportamiento; TSDoc describe el contrato previsto para quien consume el módulo.

## Consecuencias

### Positivas

- Contratos de APIs internas visibles en el IDE (hover, autocompletado enriquecido).
- Menor fricción en revisiones y onboarding al leer código en `src/features/` y `src/shared/`.
- Alineación con agentes de IA que generan código: criterios claros de cuándo añadir TSDoc y en qué idioma.

### Negativas / trade-offs

- Coste inicial al documentar módulos reutilizables existentes de forma gradual (priorizar exports públicos y `shared`).
- Riesgo de comentarios desactualizados si no se actualizan junto al cambio de firma; mitigación: exigir TSDoc en el mismo PR que modifica la API.
- TSDoc no genera por sí solo sitios de documentación en este ADR; si más adelante se adopta TypeDoc u otro generador, será decisión aparte.

## Referencias

- [TSDoc — Especificación](https://tsdoc.org/)
- [TypeScript — JSDoc reference (compatibilidad)](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [ADR-004: Estructura del proyecto con arquitectura por features](ADR-004-feature-based-architecture.md)
- [ADR-005: Estrategia de pruebas unitarias](ADR-005-unit-testing-strategy.md)
- [Documenting Architecture Decisions — Cognitect](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
