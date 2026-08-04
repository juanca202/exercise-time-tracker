## Context

Depende de los Registros de Tiempo generados por `timer-tracking`/`manual-time-entry` y de las Tareas/Proyectos de `task-management`/`project-management` (todas de las changes previas). Cálculo de totales ya documentado en [technical-docs/timetracker.md#fl-04](../../../docs/specs/technical-docs/timetracker.md#fl-04-cálculo-de-totales-de-tiempo-tarea-proyecto-mes). Requisito de rendimiento explícito (RP-003) sobre un volumen de hasta 1000 Registros de Tiempo, todos leídos desde `localStorage` (ADR-011) sin backend.

## Goals / Non-Goals

**Goals:**

- Agregaciones de tiempo por Tarea, Proyecto y mes, y su presentación en pantallas Historial/Tareas/Proyectos.
- Indicador de meta semanal fija (40 h) con porcentaje capado en 100%.
- Cumplir el presupuesto de rendimiento de 2 segundos para 1000 Registros de Tiempo.

**Non-Goals:**

- No permite configurar la meta semanal (es una constante).
- No exporta reportes a otros formatos (fuera del alcance del SRS-001).
- No modifica los Registros de Tiempo; es una capability de solo lectura/agregación.
- No incluye las tarjetas de "proyectos destacados del mes" que sí aparecen en el diseño de Figma (nodo 1:1762) — no hay ningún `AC-XXX` de US-004 que las respalde (top-N proyectos con iconos y colores propios); se documenta como decisión de alcance, no como omisión accidental.

## Decisiones

- **Cálculo en memoria vs. incremental:** dado el límite de 1000 registros (RP-003) y que todo vive en `localStorage`, se calculan los totales en memoria a partir de la colección completa de Registros de Tiempo en cada carga/cambio de periodo, en vez de mantener contadores incrementales persistidos — más simple y suficiente para el volumen esperado.
- **Meta semanal como constante de aplicación:** `WEEKLY_GOAL_HOURS = 40`, definida una sola vez (no en `localStorage`, no editable), consumida por el cálculo del porcentaje.
- **Porcentaje capado:** `Math.min(100, (totalSemanalHoras / 40) * 100)`, decisión de producto confirmada tras [RS-001](../../../docs/specs/user-stories/US-004-reportes-e-historial-de-tiempo/research/RS-001-meta-semanal-no-especificada/README.md) (que originalmente recomendaba no capar).
- **"Total semanal" reutilizado para el porcentaje:** el numerador del porcentaje es el mismo valor ya calculado para el indicador "Total semanal" del panel de Tareas, evitando un segundo cálculo divergente.

## Riesgos / Trade-offs

- [Riesgo] Calcular agregaciones en memoria sobre toda la colección en cada render podría degradar el rendimiento cerca del límite de 1000 registros → **Revisado durante la implementación**: una prueba de rendimiento con 1000 Registros de Tiempo simulados mostró que las cuatro agregaciones (Tarea/Proyecto/mes/semana) tardan ~1ms en total, muy por debajo del presupuesto de 2s (RP-003); no se memorizó nada porque el riesgo no se materializó a esta escala de datos.
- [Riesgo] La meta semanal fija (40 h) puede no ajustarse a todos los usuarios → Mitigación: aceptado como decisión de producto explícita; queda fuera de alcance hacerla configurable en esta change.
