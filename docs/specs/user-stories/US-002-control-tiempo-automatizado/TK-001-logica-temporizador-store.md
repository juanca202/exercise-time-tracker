# TK-001: Lógica de temporizador en el store

Estado: Ready
Historia: [US-002](./README.md)
Repositorio: exercise-time-tracker

## Descripción

Extender el store de dominio con el estado `activeTimer` y las acciones `startTimer(taskId)` / `stopTimer()`, implementando la regla de un único temporizador activo (auto-detención del anterior al iniciar uno nuevo) y la validación de duración positiva antes de persistir cualquier `TimeEntry` generado por el temporizador.

## Dependencias

- Tipos `ActiveTimer`, `TimeEntry` y store base (`projects`, `tasks`, persistencia) — TK-001 de [US-001](../US-001-gestion-proyectos-tareas/README.md).

## Referencias

- **Arquitectura:** [ADR-003: Manejo de estado cliente con Zustand](../../../adr/ADR-003-zustand-state-management.md)
- **Historia base:** [US-001](../US-001-gestion-proyectos-tareas/README.md)

## Plan de implementación

### Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/time-tracking/
        ├── ~ store/time-tracking-store.ts     # + activeTimer, startTimer(taskId), stopTimer()
        └── ~ testing/object-mothers.ts         # + anActiveTimer(overrides) si se requiere en tests
```

### Subtareas

- [ ] Añadir `activeTimer: ActiveTimer` al estado del store, inicializado desde la persistencia (`loadState`).
- [ ] Implementar `startTimer(taskId)`: si ya hay un `activeTimer` para una Tarea distinta, primero ejecutar internamente la lógica de `stopTimer()` para esa tarea (calcular duración, validar > 0, persistir `TimeEntry` con `source: 'timer'`) y luego fijar el nuevo `activeTimer = { taskId, startedAt: now }`.
- [ ] Implementar `stopTimer()`: si no hay `activeTimer`, no-op; si lo hay, calcular `durationSeconds = now - startedAt`; si `durationSeconds > 0`, crear y persistir el `TimeEntry` (`source: 'timer'`, `startTime`, `endTime`); en cualquier caso, limpiar `activeTimer` a `null`.
- [ ] Si `durationSeconds <= 0` al detener, no persistir el `TimeEntry` (descartar silenciosamente la sesión inválida) conforme a BR-06 de la historia.
- [ ] Persistir el estado (`activeTimer` incluido) en `localStorage` tras cada mutación, reutilizando `saveState` de TK-001 de US-001.
- [ ] Documentar con TSDoc en español `startTimer` y `stopTimer`, incluyendo la regla de auto-detención.
- [ ] Escribir tests unitarios (Vitest con `vi.useFakeTimers()` o inyección de tiempo controlada) cubriendo: iniciar sin temporizador previo; iniciar con uno activo en otra tarea (auto-stop + persistencia del anterior); detener y persistir con duración válida; detener cuando la duración calculada es `<= 0` (no persiste).

## Observaciones

Sin pendientes documentados.
