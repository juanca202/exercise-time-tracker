# ADR-004: Estructura del proyecto con arquitectura por features

- Estado: Accepted
- Fecha de creación: 2026-05-28
- Última actualización: 2026-05-28
- Decisores: Tech lead
- Etiquetas: arquitectura, estructura, features, nextjs, organización

## Contexto

El proyecto crece en funcionalidades de dominio (gestión de tareas y capacidades futuras). Una organización plana por tipo técnico (`components/`, `hooks/`, `lib/` en la raíz) dispersa el código de una misma capacidad y dificulta el mantenimiento, las revisiones y la evolución independiente de cada área.

Se requiere una convención explícita de carpetas compatible con Next.js 16 App Router ([ADR-001](ADR-001-app-router-only.md)), que agrupe el código por **feature** (capacidad de negocio) y deje claro qué es compartido entre features.

## Decision

El proyecto adoptará una **arquitectura por features (feature-based)** con **`src/` como raíz de código de aplicación**.

### Layout objetivo

```text
src/
  app/                 # Rutas y layouts de Next.js (App Router)
  features/            # Módulos por capacidad de negocio
    <feature>/         # p. ej. auth/, todos/, reports/
  shared/              # Utilidades y piezas reutilizables entre features
  components/          # Componentes UI genéricos (sin lógica de dominio de una feature)
  lib/                 # Infraestructura transversal (helpers, clientes, config)
```

Ejemplo de referencia (otros dominios):

```text
src/features/auth/
src/features/dashboard/
src/features/expenses/
src/features/reports/
```

Para este producto, las features concretas se nombran según el dominio (p. ej. `todos/` en lugar de nombres de ejemplo genéricos).

### Reglas de ubicación

| Ubicación                 | Contenido                                                                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/app/`                | Solo enrutamiento Next.js: `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, route handlers de entrada. Las páginas **componen** UI importada desde `features/` o `components/`. |
| `src/features/<feature>/` | Todo lo específico del dominio: componentes de pantalla, hooks, stores (Zustand, [ADR-003](ADR-003-zustand-state-management.md)), tipos, validaciones y servicios de esa feature.    |
| `src/shared/`             | Código reutilizado por **varias** features sin pertenecer a una sola (formatters, constantes, tipos transversales).                                                                  |
| `src/components/`         | Componentes de presentación **agnósticos de dominio** (botones, inputs, layouts UI). Estilos según [ADR-002](ADR-002-tailwind-ui-styling.md).                                        |
| `src/lib/`                | Infraestructura compartida no ligada a una feature (p. ej. utilidades de fecha, wrappers de `localStorage` genéricos).                                                               |

### Imports

- Una feature **no debe importar** implementación interna de otra feature (solo APIs públicas exportadas desde el barrel `index.ts` de la feature, si existe).
- `src/app/` y las features pueden importar desde `shared/`, `components/` y `lib/`.
- El alias de rutas del proyecto (`@/*`) debe resolverse respecto a `src/` una vez completada la migración.

### Migración

El código legado en la raíz del repo (`app/`, `lib/`, `stores/`, `hooks/`, etc.) se considera **transitorio** hasta moverse bajo `src/` siguiendo esta convención. Las nuevas piezas se crean directamente en `src/`; los refactors de migración son tareas explícitas, no bloqueantes para registrar esta decisión.

## Consecuencias

### Positivas

- Cohesión por capacidad de negocio: cambios de una feature quedan acotados a su carpeta.
- Escalabilidad al añadir dominios sin inflar carpetas globales monolíticas.
- Alineación con App Router (`src/app/`) y con prácticas habituales en codebases Next.js medianos/grandes.
- Facilita ownership por equipo o por historia de usuario.

### Negativas / trade-offs

- Requiere migración del layout actual y actualización de `tsconfig` / herramientas que asumen rutas en la raíz.
- Riesgo de duplicación si no se disciplina el uso de `shared/` frente a copiar código entre features.
- Decisiones de “¿va en `shared/` o en la feature?” pueden generar debate sin criterios claros en revisiones.

## Referencias

- [ADR-001: Enrutamiento exclusivo con App Router](ADR-001-app-router-only.md)
- [ADR-002: Estrategia de estilos UI con Tailwind CSS](ADR-002-tailwind-ui-styling.md)
- [ADR-003: Manejo de estado cliente con Zustand](ADR-003-zustand-state-management.md)
- [Next.js — Project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Documenting Architecture Decisions — Cognitect](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
