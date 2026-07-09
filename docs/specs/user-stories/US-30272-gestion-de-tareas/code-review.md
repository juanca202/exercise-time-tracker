# Code Review — US-30272-gestion-de-tareas

Fecha: 2026-07-09 01:02
Repositorio: exercise-time-tracker
Rama: feature/open-spec · Commit: b1bdb31
Working tree: limpio
Modo: default
Historia: US-30272-gestion-de-tareas (revisión conjunta con US-30273 y US-30274, implementadas en el mismo diff)
Veredicto: ✅ Apto

## Resumen

Se revisó el diff `origin/main...HEAD` (147 archivos, +7240/-22): implementación completa de las tres historias de gestión de tiempo (Proyectos, Tareas, Historial), sus specs de OpenSpec, ADR-011 y sus pruebas. Tras el reintento con el gate de cobertura resuelto (commit `b1bdb31`), las siete verificaciones automatizadas aplicables quedan en verde. No hay hallazgos cualitativos bloqueantes; se registran dos hallazgos menores no bloqueantes.

## 1. Verificaciones automatizadas

| #   | Check      | Comando                             | Categoría   | Estado | Detalle                                                                    | Duración     |
| --- | ---------- | ----------------------------------- | ----------- | ------ | -------------------------------------------------------------------------- | ------------ |
| 1   | tipado     | `tsc --noEmit`                      | Bloqueante  | ✅     | 0 errores                                                                  | ~3s          |
| 2   | linter     | `npm run lint` (eslint)             | Bloqueante  | ✅     | 0 errors, 1 warning (en `coverage/`, gitignorado, no forma parte del diff) | ~4s          |
| 3   | unit tests | `npm run test:coverage` (vitest)    | Bloqueante  | ✅     | 104 passed, 0 failed (30 archivos)                                         | 4.3s         |
| 4   | coverage   | `npm run test:coverage` (v8)        | Bloqueante  | ✅     | 97.91% stmts / 88.46% branch / 98.67% funcs / 97.72% lines (umbral 80%)    | incl. arriba |
| 5   | build      | `npm run build` (Next.js/Turbopack) | Bloqueante  | ✅     | Compiló y prerenderizó 7 rutas sin errores                                 | ~3s          |
| 6   | e2e        | `npx playwright test`               | Condicional | ✅     | 9 passed, 0 failed                                                         | 8.6s         |
| 7   | sonar      | —                                   | Informativo | —      | N/A (sin `sonar-project.properties`)                                       | —            |

### Detalle de checks fallidos

Sin checks fallidos.

## 2. Revisión cualitativa

**Intención detectada:** implementar de punta a punta las tres historias de gestión de tiempo — Proyectos (US-30273), Tareas con temporizador y entrada manual (US-30272) e Historial de registros (US-30274) — sobre Next.js App Router + Zustand + localStorage (ADR-011), siguiendo el prototipo Figma referenciado en cada historia.

### Análisis semántico

✅ conforme. Cada AC revisado tiene su TC documentado y su test correspondiente (creación/validación de Proyectos y Tareas, inicio/detención de temporizador con auto-stop BR-02, entrada manual con validación BR-03, agregación y navegación mensual del historial). La sesión incluyó múltiples rondas de verificación de fidelidad a Figma (AppShell, iconos, nombre de proyecto en el timer, agrupación por tarea en el historial) que corrigieron desajustes antes de este punto, y la meta semanal fue corregida a pedido del usuario (8h × días hábiles) manteniendo la spec coherente.

### Arquitectura y diseño

✅ mayormente conforme, con dos observaciones menores (no bloqueantes):

- 🟡 Rama muerta en `AppShell.tsx:108-122` (Mantenibilidad) — el tipo `NavItem.href: string | null` y el `if (item.href) {…} else {…}` que renderiza un `<div>` en vez de un `Link` datan de cuando "Historial" aún no tenía ruteo real; hoy los tres `NAV_ITEMS` siempre traen `href` string, así que la rama `else` es inalcanzable (coincide con ser la única línea sin cubrir del archivo). **Por qué:** código muerto que un lector futuro puede interpretar como un caso real a mantener. **Impacto:** bajo, solo legibilidad. **Sugerencia concreta:** simplificar `href` a `string` (sin `| null`) y renderizar siempre `<Link>`, eliminando el `if`/rama `div`.
- 💡 Guardas defensivas sin ejercitar (`selectTaskRowsForMonth`, `taskLabel` en `ManualEntryForm`, limpieza de error al retipear en `NewProjectModal`/`NewTaskModal`/`ManualEntryForm`) — cubren escenarios de datos huérfanos (p. ej. una Tarea referenciando un `projectId` inexistente) que hoy no son alcanzables porque no existe una operación de borrado; es consistente con la decisión ya documentada en `design.md` de `track-task-time` de resolver `projects → tasks` en una sola dirección sin validación referencial. No requiere acción ahora; si en el futuro se agrega borrado de Proyectos/Tareas, vale la pena agregar un test que ejercite estas ramas.

Confirmado además: sin colores hex hardcodeados fuera de `colorFromString` (ADR-002), sin dependencia circular entre `projectsStore`↔`tasksStore` (solo `projects → tasks`, documentado), y el agregado de `@vitest/coverage-v8` + umbrales en `vitest.config.ts` sigue la config existente sin gamificar el número (solo excluye archivos de test y wrappers de ruta ya cubiertos por Playwright, per ADR-008).

### Feedback adicional

Buen uso de Base UI (`Dialog.createHandle()` compartido entre triggers desconectados) y de `renderHook`/fake timers donde correspondía (temporizador activo, navegación de periodo) para mantener los tests deterministas. Las pruebas nuevas de esta ronda están mapeadas explícitamente a los TC-XXX de cada historia, en vez de ser tests genéricos de relleno.

## Próximas acciones

Sin acciones pendientes para este veredicto. Opcionales (no bloqueantes):

1. Simplificar la rama muerta de `AppShell.tsx` (quitar `href: string | null` y el `if`/`div` fallback).
2. Si en el futuro se agrega borrado de Proyectos/Tareas, cubrir con test las guardas defensivas hoy inalcanzables.

## Justificaciones aceptadas

Ninguna.
