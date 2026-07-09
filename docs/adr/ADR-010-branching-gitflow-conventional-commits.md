# ADR-010: Estrategia de branching GitFlow con Conventional Commits

Estado: Accepted
Fecha de creación: 2026-07-06
Última actualización: 2026-07-07
Decisores: Equipo de desarrollo
Etiquetas: git, branching, gitflow, conventional-commits, release

## Contexto

El proyecto necesita un modelo de ramas y una convención de mensajes de commit compartidos para coordinar trabajo en paralelo (features, releases, correcciones urgentes) y mantener un historial legible y procesable por herramientas. Sin un modelo acordado, cada colaborador nombra ramas y escribe mensajes de commit a su criterio, lo que dificulta saber qué rama integrar en cada release, distinguir código en desarrollo de código listo para producción, y generar changelogs o versionado de forma automática a partir del historial.

## Decision

El proyecto adopta **GitFlow** como estrategia de branching: dos ramas de larga duración, `main` (código en producción) y `develop` (integración de desarrollo), y ramas de apoyo de corta duración `feature/*`, `release/*` y `hotfix/*` que se integran de vuelta según el flujo estándar de GitFlow. Todo mensaje de commit sigue la especificación **Conventional Commits** (`<tipo>[alcance opcional]: <descripción>`, con tipos como `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, entre otros).

## Consecuencias

### Positivas

- Separación clara entre código en desarrollo (`develop`) y código listo para producción (`main`).
- Proceso estructurado para releases y hotfixes, con ramas de apoyo dedicadas a cada propósito.
- Historial de commits parseable por herramientas, habilitando generación automática de changelogs y versionado semántico a partir del `tipo` de cada commit.
- Convención de contribución consistente entre todo el equipo.

### Negativas / trade-offs

- GitFlow añade más ramas y pasos de proceso que modelos más simples (p. ej. trunk-based development), lo que puede ralentizar equipos que buscan despliegue continuo muy frecuente.
- Conventional Commits requiere disciplina del equipo; sin una verificación automatizada (p. ej. un hook de `commit-msg`), su aplicación puede volverse inconsistente.

## Fitness function

Apto: Sí
Estado: Creada
Herramienta: Vitest (script de verificación de config y rama actual)
Ubicación: src/architecture/adr-010-branching-conventional-commits.test.ts
Comando: npx vitest run src/architecture/adr-010-branching-conventional-commits.test.ts

## Referencias

- [A successful Git branching model (GitFlow) — Vincent Driessen](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ADR-009: Adopción de un Quality Gate shift-left](ADR-009-quality-gate-shift-left.md)
