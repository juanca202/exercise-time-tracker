# TK-006: Rutas placeholder y verificación offline

**Estado**: Ready
**Historia**: [US-000](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Resolver las rutas `/tareas`, `/proyectos` y `/historial` con una página funcional para cada una (aunque sea un placeholder mínimo de "Próximamente"), de modo que la navegación no produzca errores, y garantizar que el layout, el sidebar y las 3 rutas sean completamente utilizables con la red deshabilitada.

## Dependencias

- [TK-005: Layout y sidebar de navegación](TK-005-layout-sidebar-navegacion.md) — las 3 rutas se renderizan dentro del layout raíz que ya incluye el sidebar (layouts anidados de App Router); no requieren wiring adicional.
- Next.js App Router (convención de archivo `page.tsx` por carpeta de ruta).

## Referencias

- **Arquitectura:** [ADR-001: Adopción exclusiva de App Router](../../../adr/ADR-001-adopcion-exclusiva-app-router.md), [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) (componente placeholder reutilizable en módulo compartido), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md), [ADR-008: Uso de Playwright para las pruebas E2E](../../../adr/ADR-008-uso-de-playwright-para-e2e.md) (verificación offline).

## Archivos afectados

```text
exercise-time-tracker/
├── e2e/
│   └── + us-000-offline.spec.ts   # navega /, /tareas, /proyectos, /historial con la red deshabilitada (AC-011)
└── src/
    ├── app/
    │   ├── tareas/
    │   │   └── + page.tsx          # ruta /tareas — placeholder "Próximamente"
    │   ├── proyectos/
    │   │   └── + page.tsx          # ruta /proyectos — placeholder "Próximamente"
    │   └── historial/
    │       └── + page.tsx          # ruta /historial — placeholder "Próximamente"
    └── shared/
        └── ui/
            ├── + coming-soon.tsx      # componente "Próximamente" reutilizado por las 3 rutas
            └── + coming-soon.test.tsx
```

## Plan de implementación

- [ ] **IT-01** — Implementar `ComingSoon` (`coming-soon.tsx`) en `src/shared/ui/`: componente reutilizable que recibe `titulo: string` y renderiza el mensaje "Próximamente" (AC-008), evitando duplicar el marcado entre las 3 rutas.
- [ ] **IT-02** — Crear `src/app/tareas/page.tsx` renderizando `<ComingSoon titulo="Tareas" />`.
- [ ] **IT-03** — Crear `src/app/proyectos/page.tsx` renderizando `<ComingSoon titulo="Proyectos" />`.
- [ ] **IT-04** — Crear `src/app/historial/page.tsx` renderizando `<ComingSoon titulo="Historial de registros" />`.
- [ ] **IT-05** — Verificar que ninguna de las 3 rutas ni el layout raíz (TK-005) requieren autenticación ni gate de acceso alguno (AC-009): navegación directa a cada URL sin redirecciones.
- [ ] **IT-06** — Cubrir con pruebas Vitest + Testing Library (ADR-007) `coming-soon.test.tsx`: renderiza el `titulo` recibido y el mensaje "Próximamente".
- [ ] **IT-07** — Escribir la prueba E2E `e2e/us-000-offline.spec.ts` (Playwright, ADR-008): tras la carga inicial, deshabilitar la red del contexto de navegador y navegar a `/`, `/tareas`, `/proyectos` y `/historial`, verificando que el layout, el sidebar y el contenido de cada ruta se renderizan sin error (AC-011).
