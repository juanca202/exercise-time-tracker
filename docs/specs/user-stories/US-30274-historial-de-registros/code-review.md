# Code Review — US-30274-historial-de-registros

Fecha: 2026-07-09 01:26
Repositorio: exercise-time-tracker
Rama: feature/open-spec · Commit: c2f49d9
Working tree: limpio
Modo: default
Historia: US-30274-historial-de-registros (revisión conjunta con US-30272 y US-30273, implementadas en el mismo diff)
Veredicto: ✅ Apto

## Resumen

Se revisó el diff `origin/main...HEAD`: implementación completa de las tres historias de gestión de tiempo (Proyectos, Tareas, Historial), sus specs de OpenSpec, ADR-011 y sus pruebas. Las siete verificaciones automatizadas aplicables quedan en verde. Los dos hallazgos menores de la revisión anterior (commit `b1bdb31`) fueron corregidos en el commit `c2f49d9`; no quedan hallazgos cualitativos pendientes.

## 1. Verificaciones automatizadas

| #   | Check      | Comando                             | Categoría   | Estado | Detalle                                                                    | Duración |
| --- | ---------- | ----------------------------------- | ----------- | ------ | -------------------------------------------------------------------------- | -------- |
| 1   | tipado     | `tsc --noEmit`                      | Bloqueante  | ✅     | 0 errores                                                                  | ~3s      |
| 2   | linter     | `npm run lint` (eslint)             | Bloqueante  | ✅     | 0 errors, 1 warning (en `coverage/`, gitignorado, no forma parte del diff) | ~4s      |
| 3   | unit tests | `npm run test:coverage` (vitest)    | Bloqueante  | ✅     | 108 passed, 0 failed (30 archivos)                                         | 4.7s     |
| 4   | coverage   | `npm run test:coverage` (v8)        | Bloqueante  | ✅     | 99.47% stmts / 93.65% branch / 98.66% funcs / 99.42% lines (umbral 80%)    | incl.    |
| 5   | build      | `npm run build` (Next.js/Turbopack) | Bloqueante  | ✅     | Compiló y prerenderizó 7 rutas sin errores                                 | ~3s      |
| 6   | e2e        | `npx playwright test`               | Condicional | ✅     | 9 passed, 0 failed                                                         | 9.3s     |
| 7   | sonar      | —                                   | Informativo | —      | N/A (sin `sonar-project.properties`)                                       | —        |

### Detalle de checks fallidos

Sin checks fallidos.

## 2. Revisión cualitativa

**Intención detectada:** implementar de punta a punta las tres historias de gestión de tiempo — Proyectos (US-30273), Tareas con temporizador y entrada manual (US-30272) e Historial de registros (US-30274) — sobre Next.js App Router + Zustand + localStorage (ADR-011), siguiendo el prototipo Figma referenciado en cada historia.

### Análisis semántico

✅ conforme. Cada AC revisado tiene su TC documentado y su test correspondiente (creación/validación de Proyectos y Tareas, inicio/detención de temporizador con auto-stop BR-02, entrada manual con validación BR-03, agregación y navegación mensual del historial). La sesión incluyó múltiples rondas de verificación de fidelidad a Figma (AppShell, iconos, nombre de proyecto en el timer, agrupación por tarea en el historial) que corrigieron desajustes antes de este punto, y la meta semanal fue corregida a pedido del usuario (8h × días hábiles) manteniendo la spec coherente.

### Arquitectura y diseño

✅ conforme. Los dos hallazgos menores de la revisión anterior fueron corregidos (commit `c2f49d9`):

- 🟡 ~~Rama muerta en `AppShell.tsx:108-122`~~ **Corregido** — `NavItem.href` pasa a `string` (sin `| null`) y el componente siempre renderiza `<Link>`; se eliminó el `if`/rama `<div>` inalcanzable. Verificado: `tsc --noEmit` sin errores y `AppShell.test.tsx` en verde.
- 💡 ~~Guardas defensivas sin ejercitar~~ **Corregido** — `taskLabel` en `ManualEntryForm` ahora recibe la `Task` directamente (eliminando el guard `!task` que nunca podía dispararse por construcción); se agregaron tests para las guardas reales: entrada huérfana en `selectTaskRowsForMonth`, Tarea sin Proyecto en `ManualEntryForm`, y limpieza de error al retipear en `NewProjectModal`/`NewTaskModal`. Cobertura subió de 97.91%/88.46%/98.67%/97.72% a 99.47%/93.65%/98.66%/99.42%.

Confirmado además: sin colores hex hardcodeados fuera de `colorFromString` (ADR-002), sin dependencia circular entre `projectsStore`↔`tasksStore` (solo `projects → tasks`, documentado).

### Feedback adicional

Buen uso de Base UI (`Dialog.createHandle()` compartido entre triggers desconectados) y de `renderHook`/fake timers donde correspondía (temporizador activo, navegación de periodo) para mantener los tests deterministas. Las pruebas están mapeadas explícitamente a los TC-XXX de cada historia, en vez de ser tests genéricos de relleno.

## Próximas acciones

Sin acciones pendientes.

## Justificaciones aceptadas

Ninguna.
