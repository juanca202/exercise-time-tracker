# TK-004: Listado de Proyectos

**Estado**: Ready
**Historia**: [US-001](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Mostrar el listado de todos los Proyectos creados en la pantalla de Proyectos, con una tarjeta por Proyecto (Nombre y Descripción) y un estado vacío sin errores cuando no existe ninguno, leyendo el estado persistido solo después de hidratar el cliente.

## Dependencias

- [TK-001: Tipos de dominio compartidos (US-000)](../US-000-fundamentos/TK-001-tipos-dominio-compartidos.md) — tipo `Proyecto`.
- [TK-002: Adaptador de persistencia local (US-000)](../US-000-fundamentos/TK-002-adaptador-persistencia-local.md) — `useHasHydrated()`, gate obligatorio antes de leer `useProyectos()` para evitar hydration-mismatch.
- [TK-003: Store raíz compartido — CRUD crudo (US-000)](../US-000-fundamentos/TK-003-store-raiz-crud-crudo.md) — selector `useProyectos(): Proyecto[]`.
- [TK-001: Crear Proyecto](TK-001-crear-proyecto.md) — el listado se integra en `src/app/proyectos/page.tsx` debajo del encabezado y el disparador "Nuevo Proyecto" ya establecidos por esa tarea.

## Referencias

- **Arquitectura:** [ADR-002: Uso de Tailwind CSS](../../../adr/ADR-002-uso-de-tailwind-css.md), [ADR-005: Arquitectura feature-based](../../../adr/ADR-005-arquitectura-feature-based.md), [ADR-006: Documentación con TSDoc](../../../adr/ADR-006-documentacion-con-tsdoc.md), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md).
- **Diseño:** [Figma - Exercise · Time Tracker (pantalla Proyectos)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker) — sin acceso de edición al archivo desde el MCP de Figma en este entorno; el grid, la tarjeta y el estado vacío se resuelven aquí a nivel funcional, y su fidelidad visual (colores, tipografía, espaciado) se ajusta en [TK-005](TK-005-ui-diseno-proyectos.md).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── app/
    │   └── proyectos/
    │       └── ~ page.tsx                         # agrega <ProyectosListado /> debajo del encabezado y el disparador "Nuevo Proyecto" (TK-001)
    └── features/
        └── proyectos/
            └── components/
                ├── + proyectos-listado.tsx        # grid de ProyectoCard + estado vacío; gatea useProyectos() detrás de useHasHydrated()
                ├── + proyectos-listado.test.tsx
                ├── + proyecto-card.tsx            # tarjeta: Nombre y Descripción del Proyecto (sin acción de edición todavía)
                └── + proyecto-card.test.tsx
```

## Plan de implementación

- [ ] **IT-01** — Implementar `ProyectoCard` (`proyecto-card.tsx`): recibe un `Proyecto` y muestra su Nombre y, si existe, su Descripción.
- [ ] **IT-02** — Implementar `ProyectosListado` (`proyectos-listado.tsx`): mientras `useHasHydrated()` es `false`, no leer `useProyectos()` (evita hydration-mismatch, AC-004 de US-000); una vez hidratado, con Proyectos existentes renderizar un grid de `ProyectoCard` (TC-007); sin Proyectos, renderizar un estado vacío sin filas ni tarjetas y sin producir error (TC-008).
- [ ] **IT-03** — Integrar `<ProyectosListado />` en `src/app/proyectos/page.tsx`, debajo del encabezado y el disparador "Nuevo Proyecto" (TK-001).
- [ ] **IT-04** — Cubrir con pruebas Vitest + Testing Library (ADR-007): `proyecto-card.test.tsx` (renderiza el Nombre y la Descripción recibidos) y `proyectos-listado.test.tsx` (con Proyectos renderiza una tarjeta por cada uno; sin Proyectos renderiza el estado vacío sin error; antes de hidratar no renderiza el listado).

## Observaciones

Sin pendientes documentados.
