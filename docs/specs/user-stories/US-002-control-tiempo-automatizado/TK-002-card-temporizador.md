# TK-002: Card de Temporizador en la vista Tareas

Estado: Ready
Historia: [US-002](./README.md)
Repositorio: exercise-time-tracker

## Descripción

Añadir a la vista `/tasks` el card de temporizador: cuando no hay temporizador activo, permite seleccionar una Tarea e iniciarlo; cuando hay uno activo, muestra el Proyecto/Tarea asociados, la hora de inicio y el tiempo transcurrido actualizado en tiempo real (HH:MM:SS), con acción para detenerlo.

## Dependencias

- `startTimer`, `stopTimer`, `activeTimer`, `tasks`, `projects` del store — TK-001 de esta historia y TK-001 de [US-001](../US-001-gestion-proyectos-tareas/README.md).
- `SelectField`, `Button` — TK-002 de [US-001](../US-001-gestion-proyectos-tareas/README.md).
- `app/tasks/page.tsx` (esqueleto) — TK-005 de [US-001](../US-001-gestion-proyectos-tareas/README.md).
- `formatDuration` (HH:MM:SS) — a crear en esta tarea si no existe aún.

## Referencias

- **Diseño:** [Wireframe — Panel de Tareas (temporizador activo)](assets/wireframe-panel-tareas-temporizador.png)
- **Historia base:** [US-001](../US-001-gestion-proyectos-tareas/README.md)

## Plan de implementación

### Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/time-tracking/
        ├── + lib/duration.ts               # formatDuration(seconds) → "HH:MM:SS"
        ├── + components/timer-card.tsx     # card con estado inactivo (selector + iniciar) / activo (breadcrumb, display, detener)
        └── ~ app/tasks/page.tsx             # incorpora <TimerCard /> en la zona de contenido (ruta compartida con US-001/US-003)
```

### Subtareas

- [x] Implementar `formatDuration(seconds)` devolviendo `HH:MM:SS` con ceros a la izquierda.
- [x] Implementar `TimerCard` (Client Component): si `activeTimer` es `null`, mostrar `SelectField` de Tarea (agrupado por Proyecto) y botón "Iniciar"; si hay `activeTimer`, mostrar el breadcrumb Proyecto — Tarea, "Iniciado a las {hora}", el tiempo transcurrido recalculado cada segundo (`setInterval` limpiado en `useEffect`) formateado con `formatDuration`, y el botón "Detener Sesión" que llama a `stopTimer`.
- [x] Deshabilitar el botón "Iniciar" si no hay ninguna Tarea seleccionada o no existen Tareas creadas (mostrar mensaje indicando que se debe crear una tarea primero).
- [x] Integrar `TimerCard` en `app/tasks/page.tsx`.
- [x] Documentar `TimerCard` y `formatDuration` con TSDoc en español.
- [x] Escribir tests: unitario de `formatDuration` (0s, <1min, >1h, valores con padding); de componente para `TimerCard` verificando que iniciar muestra el estado activo, que el tiempo transcurrido se actualiza, y que detener vuelve al estado inactivo.

## Observaciones

Sin pendientes documentados.
