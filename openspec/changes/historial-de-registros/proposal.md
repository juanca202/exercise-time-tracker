## Why

Registrar tiempo (US-30272) solo aporta valor si el usuario puede después entender en qué lo invirtió. US-30274 cubre exclusivamente la visualización del historial de Registros de Tiempo ya existentes y sus totales acumulados por Tarea, Proyecto y mes, para que el usuario tome decisiones sobre su productividad ([SRS-001](../../../docs/specs/requirements/SRS-001-timetracker-app/README.md)). Ya está en `Estado: Ready`, sin decisiones técnicas pendientes (ADR-011 resolvió el mecanismo de persistencia local).

## What Changes

- Lectura y presentación del historial de todos los Registros de Tiempo.
- Cálculo y visualización del total de tiempo acumulado por Tarea.
- Cálculo y visualización del total de tiempo acumulado por Proyecto dentro del periodo seleccionado.
- Cálculo y visualización del total de tiempo acumulado por mes, con navegación entre periodos (mes anterior / mes siguiente).
- Listado de cada Registro de Tiempo con Fecha, Proyecto, Tarea y Duración.
- Resumen del periodo seleccionado: total de registros, cantidad de proyectos involucrados y total de horas.
- Presupuesto de rendimiento: carga del historial en menos de 2 segundos para hasta 1000 Registros de Tiempo.

## Capabilities

### New Capabilities

- `time-history`: lectura, agregación (por Tarea, Proyecto y mes) y presentación del historial de Registros de Tiempo, incluyendo navegación entre periodos y el resumen del periodo seleccionado.

### Modified Capabilities

(ninguna — no hay capacidades existentes en `openspec/specs/` todavía)

## Impact

- Código nuevo en `src/features/` (feature de historial, según ADR-005 arquitectura feature-based); es de solo lectura, no introduce un store propio de escritura — lee los stores de Tareas/Registros (`task-time-tracking`, change `gestion-de-tareas`) y de Proyectos (`project-management`, change `gestion-de-proyectos`).
- Depende de que `task-time-tracking` genere Registros de Tiempo para poblar el historial con datos reales; sin ellos, la pantalla solo exhibe el estado vacío.
- No incluye creación ni edición de Registros de Tiempo (eso es exclusivo de `task-time-tracking`).
- UI conforme al prototipo de alta fidelidad en Figma (frame "Historial de registros") referenciado en US-30274.
