# ADR-001: Enrutamiento exclusivo con App Router

- Estado: Accepted
- Fecha de creación: 2026-05-28
- Última actualización: 2026-05-28
- Decisores: Tech lead
- Etiquetas: nextjs, app-router, routing, arquitectura

## Contexto

El proyecto usa Next.js 16 con React 19 y ya expone rutas bajo el directorio `app/`. Next.js permite convivir App Router (`app/`) y Pages Router (`pages/`), lo que introduce dos modelos de enrutamiento, convenciones de datos y patrones de renderizado distintos en el mismo repositorio.

Para mantener coherencia arquitectónica, reducir deuda cognitiva en el equipo y alinear el código con las prácticas actuales del framework (RSC, layouts anidados, `loading`/`error`, route handlers en `app/api`), se debe fijar un único modelo de enrutamiento desde el inicio del producto.

## Decision

El proyecto adoptará **exclusivamente App Router**: toda ruta, layout, página, manejo de errores/carga y API HTTP viven bajo `app/` siguiendo las convenciones de Next.js App Router.

Queda **fuera de alcance** el directorio `pages/` y cualquier patrón híbrido Pages + App (incluido `getServerSideProps`, `getStaticProps` y `_app`/`_document` del Pages Router).

## Consecuencias

### Positivas

- Un solo modelo mental de enrutamiento, layouts y obtención de datos en el equipo.
- Alineación con la dirección actual de Next.js y con el skill interno `/next-best-practices`.
- Uso consistente de Server Components, streaming y convenciones de archivos (`layout.tsx`, `page.tsx`, `route.ts`, etc.).
- Menor riesgo de duplicar rutas o APIs entre `pages/` y `app/`.

### Negativas / trade-offs

- No se pueden reutilizar guías o snippets centrados en Pages Router sin adaptación.
- Migraciones desde código legacy basado en `pages/` requieren reescritura explícita, no copia directa.
- Algunos ejemplos de la documentación antigua de Next.js no aplican tal cual; hay que validar contra `node_modules/next/dist/docs/` o el skill del proyecto.

## Referencias

- [Next.js — App Router](https://nextjs.org/docs/app)
- [Documenting Architecture Decisions — Cognitect](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- `AGENTS.md` — regla de consultar `/next-best-practices` para convenciones de Next.js
