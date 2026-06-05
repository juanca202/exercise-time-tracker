# UI Route Contract: Time Tracker

**Version**: 1.0  
**Base path**: `/` (App Router)

## Routes

| Path         | View      | Wireframe   | Server/Client composition            |
| ------------ | --------- | ----------- | ------------------------------------ |
| `/`          | Tareas    | LB-TT-img-1 | `page.tsx` → `TasksPage` (client)    |
| `/proyectos` | Proyectos | LB-TT-img-5 | `page.tsx` → `ProjectsPage` (client) |
| `/historial` | Historial | LB-TT-img-3 | `page.tsx` → `HistoryPage` (client)  |

## Shared Layout (`(tracker)/layout.tsx`)

- Sidebar 280px fixed (desktop); collapsible &lt;768px per DESIGN.md
- Nav items: **Tareas**, **Proyectos**, **Historial de Registros** (FR-021)
- Active route highlight
- Brand: **TimeTracker** + subtitle per wireframe
- Nav icons: `@heroicons/react` (outline/solid según wireframe; FR-030)

## Modals (overlay, not routes)

| Modal          | Trigger(s)                               | Wireframe   |
| -------------- | ---------------------------------------- | ----------- |
| Nuevo Proyecto | Botón "Nuevo Proyecto", tarjeta punteada | LB-TT-img-4 |
| Nueva Tarea    | Botón "Nueva Tarea"                      | LB-TT-img-2 |

## Navigation contracts

- `Ver Historial` (Tareas recientes) → `router.push('/historial')` (FR-016c)
- Sidebar links use `next/link` with pathname matching

## Metadata

| Route        | `title`                 | `lang` |
| ------------ | ----------------------- | ------ |
| layout       | TimeTracker             | `es`   |
| `/`          | Tareas — TimeTracker    | `es`   |
| `/proyectos` | Proyectos — TimeTracker | `es`   |
| `/historial` | Historial — TimeTracker | `es`   |
