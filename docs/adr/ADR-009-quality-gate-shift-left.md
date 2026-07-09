# ADR-009: Adopción de un Quality Gate shift-left

Estado: Accepted
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06
Decisores: Equipo de desarrollo
Etiquetas: quality-gate, shift-left, lint, prettier, husky, lint-staged, sonar, ci

## Contexto

El proyecto necesita detectar problemas de calidad de código (errores de estilo, fallos de pruebas, cobertura insuficiente, code smells) lo antes posible en el ciclo de desarrollo, en lugar de descubrirlos recién en integración continua o en revisión de código. Sin un conjunto de verificaciones automatizadas que se ejecute de forma temprana (shift-left), estos problemas llegan tarde: encarecen su corrección, sobrecargan la revisión humana con hallazgos que podrían automatizarse y permiten que código con baja calidad avance en el flujo de integración.

## Decision

Se adopta un Quality Gate aplicado shift-left —lo más cerca posible del momento en que se escribe el código— compuesto por:

- **Lint**, para detectar errores y violaciones de convenciones de código.
- **Formato automático (Prettier)**, para eliminar discusiones y diffs de estilo.
- **Pruebas y cobertura (Vitest)**, según lo definido en [ADR-007](ADR-007-estrategia-pruebas-unitarias.md).
- **Git hooks (Husky)**, que disparan estas verificaciones en puntos clave del flujo de git (p. ej. pre-commit, pre-push).
- **Ejecución acotada a archivos modificados (lint-staged)**, para mantener las verificaciones locales rápidas en cada commit.
- **Pruebas E2E (Playwright)**, según lo definido en [ADR-008](ADR-008-uso-de-playwright-para-e2e.md).
- **Análisis de calidad de código (Sonar Scanner)**, como verificación adicional de mantenibilidad, duplicación y vulnerabilidades.

Ningún cambio se integra a la rama principal sin pasar estas verificaciones.

## Consecuencias

### Positivas

- Detección temprana de problemas, reduciendo el costo de corregirlos frente a encontrarlos en CI o en producción.
- Feedback rápido dentro del propio flujo de git, sin esperar a una ejecución de CI completa.
- Cobertura y calidad de código medidas de forma objetiva y continua en cada cambio.
- `lint-staged` mantiene los hooks locales rápidos al no re-verificar todo el repositorio en cada commit.

### Negativas / trade-offs

- Añade fricción y tiempo de espera en el flujo local de git (commits/pushes), que el equipo asume como costo del shift-left.
- Requiere mantener sincronizada la configuración de varias herramientas (ESLint, Prettier, Husky, lint-staged, Vitest, Playwright, Sonar Scanner) a medida que el proyecto evoluciona.
- Hooks mal configurados o excesivamente lentos pueden incentivar a saltarlos (p. ej. `--no-verify`), debilitando el propósito del Quality Gate.

## Referencias

- [ADR-007: Estrategia de pruebas unitarias](ADR-007-estrategia-pruebas-unitarias.md)
- [ADR-008: Uso de Playwright para las pruebas E2E](ADR-008-uso-de-playwright-para-e2e.md)
- [Husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [Prettier](https://prettier.io/)
- [SonarQube / Sonar Scanner](https://docs.sonarsource.com/sonarqube-server/latest/analyzing-source-code/scanners/sonar-scanner/)
