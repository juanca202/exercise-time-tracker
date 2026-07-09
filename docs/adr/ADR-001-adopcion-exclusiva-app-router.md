# ADR-001: Adopción exclusiva de App Router

Estado: Accepted
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06 (migración completada)
Decisores: Equipo de desarrollo
Etiquetas: nextjs, app-router, routing, architecture

## Contexto

El proyecto usa Next.js como framework. Next.js soporta dos paradigmas de enrutamiento y renderizado: **Pages Router** (basado en `pages/`, con `getServerSideProps`/`getStaticProps`) y **App Router** (basado en `app/`, con React Server Components, layouts anidados y las convenciones de fetching de datos más recientes del framework). Mantener ambos paradigmas simultáneamente en un mismo proyecto introduce inconsistencia arquitectónica: duplica convenciones de enrutamiento, complica el onboarding, y divide las decisiones de renderizado y data fetching entre dos modelos incompatibles entre sí.

## Decision

Todo el enrutamiento, layouts y páginas del proyecto se implementan exclusivamente bajo **App Router** (`app/`). Se descarta el uso de Pages Router (`pages/`) como convención vigente: no se crean nuevas rutas ni páginas bajo `pages/`, y cualquier código existente en ese directorio debe migrarse a `app/`.

## Consecuencias

### Positivas

- Un único modelo de enrutamiento y renderizado en todo el proyecto, reduciendo la carga cognitiva y la superficie de convenciones a mantener.
- Acceso a las capacidades más recientes del framework (Server Components, layouts anidados, streaming) sin necesidad de coexistir con el modelo anterior.

### Negativas / trade-offs

- Cualquier código nuevo que aparezca bajo `pages/` (por ejemplo, por copiar ejemplos o plantillas basadas en Pages Router) debe migrarse a `app/` antes de integrarse, para no reintroducir ambos paradigmas.

## Estado de migración

El directorio `src/pages/` (boilerplate inicial de Create Next App) fue migrado íntegramente a `src/app/` — layout raíz, página de inicio y el route handler de `api/hello` — y eliminado del repositorio. El proyecto opera exclusivamente bajo App Router.

## Referencias

- [Next.js App Router](https://nextjs.org/docs/app)
