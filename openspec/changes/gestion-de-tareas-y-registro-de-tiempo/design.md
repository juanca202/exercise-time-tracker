## Context

Depende de `project-management` (change `gestion-de-proyectos`) para validar la existencia del Proyecto al crear/reasignar una Tarea, y del shell de `layout-de-la-aplicacion`. Persistencia exclusiva en `localStorage` (ADR-011), separación store raíz / store de feature (ADR-012), estado con Zustand (ADR-004). Modelo de datos y flujos ya documentados en [technical-docs/timetracker.md](../../../docs/specs/technical-docs/timetracker.md) (`MD-02`, `MD-03`, `FL-01`, `FL-02`, `FL-03`, `FL-07`, `FL-08`, `DG-01`), con hallazgos adicionales en [RS-001](../../../docs/specs/user-stories/US-003-gestion-de-tareas-y-registro-de-tiempo/research/RS-001-decisiones-tecnicas-pendientes/README.md).

Esta change agrupa tres capabilities (`task-management`, `timer-tracking`, `manual-time-entry`) porque comparten el mismo panel de UI y el mismo modelo de Registro de Tiempo, pero se documentan como specs separadas para que cada una pueda evolucionar de forma independiente en el futuro.

## Goals / Non-Goals

**Goals:**

- CRUD completo de Tarea (crear, editar con reasignación de Proyecto, eliminar con regla de bloqueo, listar).
- Temporizador con restricción de unicidad global y detención automática del anterior.
- Registro manual de tiempo con validación de duración positiva.
- Corregir el modelo de Registro de Tiempo para almacenar `durationSeconds` (entero) en vez de `durationMinutes` (decimal), por precisión frente al wireframe `HH:MM:SS`.

**Non-Goals:**

- No implementa "pausar" el temporizador (sin RF que lo respalde; ver US-003, Fuera de alcance).
- No permite editar ni eliminar Registros de Tiempo individuales una vez creados.
- No implementa reasignación ni eliminación en cascada de Registros de Tiempo al eliminar una Tarea.
- No calcula totales ni reportes (cubierto por `reportes-e-historial-de-tiempo`).

## Decisiones

- **Unidad de Duración — `durationSeconds` (entero) en vez de `durationMinutes` (decimal):** corrige la imprecisión detectada en RS-001 frente al wireframe `HH:MM:SS`; se deriva minutos/horas solo en la capa de presentación.
- **Fecha de un Registro de Tiempo generado por temporizador:** se asigna la fecha de `startTime` (fecha de inicio), consistente con el estándar de la industria (Timery, Jobber, Clockify) documentado en RS-001, incluso si el temporizador cruza la medianoche.
- **Reinicio del temporizador para la misma Tarea ya activa:** se resuelve a nivel de UI — mientras una Tarea tiene el temporizador activo, su control se muestra como "Detener" (no como "Iniciar"), de modo que el escenario no es alcanzable desde la interfaz normal; si se alcanza por otra vía, se trata como no-op.
- **Duración ≤ 0 al auto-detener el temporizador anterior (desfase de reloj):** se descarta el Registro de Tiempo inválido (sin persistirlo) y se continúa iniciando el nuevo temporizador solicitado, priorizando la acción explícita del usuario sobre la anomalía del reloj del sistema.
- **Store raíz vs. store de feature (ADR-012):** el store raíz (`useTaskStore`, `useTimeEntryStore`) mantiene el CRUD crudo. **Revisión durante la implementación:** solo el Temporizador necesita un store de Zustand propio (`useTimerStore`, con estado transitorio genuino — el temporizador activo — exactamente el caso que ADR-012 usa como ejemplo); Tareas y Registro Manual se resuelven con hooks simples (`useTaskActions`, `useManualTimeEntryActions`) que componen los stores raíz, sin estado de negocio propio que justifique un store adicional (mismo criterio aplicado en `gestion-de-proyectos/design.md`).
- **Longitud/unicidad del Nombre de Tarea:** máximo 100 caracteres, sin unicidad forzada (ni siquiera dentro del mismo Proyecto), igual que Proyecto (ver RS-001).
- **Restricción de Fecha en el registro manual:** no se permiten fechas futuras (no tiene sentido registrar tiempo trabajado en una fecha que aún no ocurrió); sin restricción sobre cuán atrás puede ir la fecha.
- **Manejo de fallo de `localStorage`:** mismo patrón que `project-management` — `try/catch`, detectar `QuotaExceededError`, notificar sin bloquear la UI.

## Riesgos / Trade-offs

- [Riesgo] Cambiar `durationMinutes` por `durationSeconds` es una corrección al modelo ya documentado en technical-docs, no solo a esta change → Mitigación: actualizar `MD-03` en `timetracker.md` antes o durante la implementación de esta change para que quede como fuente única de verdad.
- [Riesgo] La regla "un único temporizador activo" involucra un estado global compartido entre Tareas de distintos Proyectos → Mitigación: modelarlo como un único store de feature de Temporizador (no por Tarea ni por Proyecto), consistente con `DG-01`.
- [Riesgo] Descartar silenciosamente un Registro de Tiempo con duración ≤ 0 podría ocultar un problema real de reloj del sistema al usuario → Mitigación: registrar la anomalía en consola/log para diagnóstico, sin bloquear al usuario.
