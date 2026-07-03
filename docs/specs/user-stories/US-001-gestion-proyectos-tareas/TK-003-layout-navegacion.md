# TK-003: Layout de aplicación y navegación lateral

Estado: Ready
Historia: [US-001](./README.md)
Repositorio: exercise-time-tracker

## Descripción

Dejar disponible el layout raíz de la aplicación con navegación lateral persistente (Tareas, Proyectos, Historial de Registros) y hacer que la ruta `/` redirija a `/tasks` como pantalla de inicio.

## Dependencias

- `Button` (`src/components/button.tsx`) — TK-002, para el estado activo/hover de los enlaces de navegación si aplica.

## Referencias

- **Arquitectura:** [ADR-001: Enrutamiento exclusivo con App Router](../../../adr/ADR-001-app-router-only.md), [ADR-004: Estructura del proyecto con arquitectura por features](../../../adr/ADR-004-feature-based-architecture.md)
- **Diseño:** [Wireframe — Panel de Tareas (referencia de navegación)](assets/wireframe-panel-tareas-referencia.png)

## Plan de implementación

### Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── ~ app/layout.tsx                          # envuelve children con el Sidebar; body en layout flex (sidebar + main)
    ├── ~ app/page.tsx                             # redirect('/tasks') con next/navigation
    └── features/time-tracking/components/
        └── + sidebar.tsx                         # nav lateral: título app, enlaces Tareas/Proyectos/Historial, resaltado de ruta activa (usePathname)
```

### Subtareas

- [ ] Implementar `Sidebar` (Client Component) con `next/link` a `/tasks`, `/projects`, `/history`, resaltando el enlace activo con `usePathname` de `next/navigation`.
- [ ] Integrar `Sidebar` en `app/layout.tsx` dentro de un contenedor flex (sidebar fijo 280px + área de contenido), conforme a `DESIGN.md`.
- [ ] Cambiar `app/page.tsx` para redirigir a `/tasks` con `redirect()` de `next/navigation` (Server Component).
- [ ] Documentar `Sidebar` con TSDoc en español.
- [ ] Escribir test de componente para `Sidebar` verificando que el enlace correspondiente a la ruta actual queda marcado como activo (accesible vía rol/aria-current).

## Observaciones

Sin pendientes documentados.
