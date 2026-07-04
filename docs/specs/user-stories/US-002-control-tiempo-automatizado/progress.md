# Progreso

## Trabajo: US-002-control-tiempo-automatizado

- Tipo: historia de usuario
- Última actualización: 2026-07-03

### Unidades

- TK-001 Lógica de temporizador en el store
  Estado: Done
  Implementador: "juanca202"
  Archivos:
  - src/features/time-tracking/store/time-tracking-store.ts
  - src/features/time-tracking/store/timer.test.ts
    Notas:
  - 14 tests en verde en `store/` (createProject/createTask + startTimer/stopTimer) usando `vi.useFakeTimers()`/`vi.setSystemTime()` para controlar el tiempo.
    Decisiones adicionales:
  - Se decidió que iniciar el temporizador para la misma Tarea que ya está activa es un no-op (no reinicia `startedAt` ni genera un registro): evita perder tiempo acumulado por un doble clic accidental en "Iniciar". No estaba explícito en la historia; se documenta aquí como comportamiento defensivo razonable.

- TK-002 Card de Temporizador en la vista Tareas
  Estado: Done
  Implementador: "juanca202"
  Archivos:
  - src/features/time-tracking/lib/duration.ts
  - src/features/time-tracking/lib/duration.test.ts
  - src/features/time-tracking/components/timer-card.tsx
  - src/features/time-tracking/components/timer-card.test.tsx
  - src/app/tasks/page.tsx
    Notas:
  - Suite completa: 47 tests en verde, 89% cobertura de ramas. `npm run build` en verde.
  - US-002 (Control de Tiempo Automatizado) queda completamente implementada: TK-001 y TK-002 en Done.
    Decisiones adicionales:
  - Los tests de componente de `TimerCard` evitan `vi.useFakeTimers()` combinado con interacciones de `userEvent` sobre el `Select` de Base UI (portal + posicionamiento vía rAF), ya que esa combinación produce timeouts. En su lugar, el tiempo transcurrido se verifica fijando `activeTimer.startedAt` en el pasado con `Date` real antes de renderizar.
  - El contador en vivo se implementó con un estado `tick` que solo fuerza el re-render cada segundo; `elapsed` se recalcula en cada render a partir de `Date.now()` (no se llama `setState` de forma síncrona dentro del efecto, por la regla `react-hooks/set-state-in-effect`).
