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
  Estado: Pending
  Implementador: "juanca202"
  Archivos: []
  Notas: []
  Decisiones adicionales: []
