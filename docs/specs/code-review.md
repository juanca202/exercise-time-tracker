# Code Review — exercise-time-tracker · feature/implementacion → main

**Fecha:** 2026-08-04 09:55
**Repositorio:** exercise-time-tracker
**Rama:** feature/implementacion
**Commit:** a5fd5d8
**Working tree:** sucio (5 archivos modificados: `package.json`, `pnpm-lock.yaml`, `src/app/page.tsx`, `src/features/tasks/use-task-actions.ts`, `src/features/tasks/use-task-actions.test.ts` — correcciones aplicadas durante este review, pendientes de commit)
**Modo:** default
**Veredicto:** ❌ Rechazado

## Resumen

Se revisó el diff completo `origin/main..HEAD` (132 archivos, ~7000 líneas): implementación de las 4 historias de usuario del producto (layout, gestión de proyectos, gestión de tareas y registro de tiempo, reportes e historial) más el archivado de 5 changes de OpenSpec. La etapa automatizada y la revisión cualitativa quedaron ambas superadas tras corregir dos hallazgos bloqueantes autorizados por el usuario (pérdida de datos al eliminar una Tarea con temporizador activo, y validación asimétrica de Proyecto en `createTask`). El único punto pendiente es el check de **E2E**, que falla con "No tests found": existe `playwright.config.ts` (ADR-008) pero no hay ningún test bajo `e2e/` todavía; el usuario decidió explícitamente no corregirlo ahora. Por eso el veredicto es `❌ Rechazado` — es la única puerta que falta para `✅ Aprobado`.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                 | Categoría   | Estado | Detalle                                     | Duración |
| --- | ---------- | ----------------------- | ----------- | ------ | ------------------------------------------- | -------- |
| 1   | tipado     | `tsc --noEmit`          | Bloqueante  | ✅     | 0 errores                                   | ~2s      |
| 2   | linter     | `eslint .`              | Bloqueante  | ✅     | 0 errors, 0 warnings                        | ~2s      |
| 3   | unit tests | `vitest run`            | Bloqueante  | ✅     | 119 passed, 0 failed (29 archivos)          | 3.1s     |
| 4   | coverage   | `vitest run --coverage` | Bloqueante  | ✅     | 98.13% stmts / 89.43% branches (sin umbral) | 3.4s     |
| 5   | build      | `next build`            | Bloqueante  | ✅     | OK — 4 rutas generadas                      | ~2s      |
| 6   | e2e        | `playwright test`       | Condicional | ❌     | "Error: No tests found" (0 specs en `e2e/`) | —        |
| 7   | sonar      | —                       | Informativo | —      | N/A (sin `sonar-project.properties`)        | —        |

### Detalle de checks fallidos

- **e2e** — `playwright test` se ejecutó (config y navegador Chromium disponibles, `webServer` levanta `next build && next start` correctamente) pero terminó con `Error: No tests found`: el directorio `e2e/` (declarado como `testDir` en `playwright.config.ts`) no existe, no hay ningún archivo `*.spec.ts` bajo él. El usuario confirmó continuar sin escribir tests e2e en este momento.

**Nota sobre coverage:** inicialmente `SKIPPED` porque `@vitest/coverage-v8` no estaba instalado (ni `@vitest/coverage-istanbul`) y no había script de coverage configurado. El usuario autorizó instalar `@vitest/coverage-v8` como devDependency; tras instalarlo, el check pasa a `✅ PASS` (sin umbrales de cobertura configurados en `vitest.config.ts`, por lo que exit 0 basta).

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** el diff implementa completamente las 4 US del producto (`US-001` layout, `US-002` gestión de proyectos, `US-003` gestión de tareas y registro de tiempo, `US-004` reportes e historial), inferida de `docs/specs/user-stories/` y contrastada AC por AC contra el código.

### Análisis semántico

`✅` Los AC-XXX de las 4 US están cubiertos (ver detalle por US en el hallazgo de intención original). No se detectó scope creep relevante. El único gap de intención encontrado fue de arquitectura/negocio (ver abajo, ya resuelto).

### Arquitectura y diseño

Todos los hallazgos bloqueantes fueron **corregidos y verificados** durante este review (fix aplicado, checks re-ejecutados en verde, revisión cualitativa re-verificada por un segundo pase):

- ~~🔴 [ISO-25010: Fiabilidad] Eliminar una Tarea con un temporizador activo dejaba `useTimerStore.activeTimer` apuntando a un `taskId` inexistente (pérdida silenciosa de datos, reproducible con Iniciar temporizador → Eliminar esa Tarea).~~ **Corregido:** `deleteTask(id, activeTimerTaskId?)` en `src/features/tasks/use-task-actions.ts` bloquea la eliminación si `activeTimerTaskId === id`, devolviendo `{ deleted: false, blockedByActiveTimer: true }`. `page.tsx` pasa `activeTimer?.taskId` desde el composition layer (sin crear un import cruzado `features/tasks → features/timer`, preservando el aislamiento entre features del repo). Test nuevo cubre el caso; 119/119 tests en verde.
- ~~🟠 [ISO-25010: Mantenibilidad] `createTask` no validaba que el `projectId` existiera, a diferencia de `updateTask` (asimetría de la misma regla BR-01 dentro del mismo hook).~~ **Corregido:** `createTask` ahora aplica `projectExists(input.projectId)` con el mismo patrón que `updateTask`, devolviendo `CreateTaskResult { created; projectNotFound? }`. `page.tsx` verifica `result.created` antes de cerrar el formulario, simétrico al flujo de edición. Test nuevo cubre el caso.

### Feedback adicional

Lo que está bien hecho: arquitectura feature-based consistente y sin fugas entre features (ADR-005); separación store raíz (CRUD)/store de feature (ADR-012) respetada incluso al resolver el hallazgo crítico (se optó por pasar el dato como parámetro en vez de romper el aislamiento con un import cruzado); adaptador de `localStorage` único con guardas SSR (ADR-011); funciones de reportes puras y testeadas exhaustivamente, incluido un test de rendimiento explícito (AC-011); TSDoc consistente referenciando AC-XXX/BR-XXX en cada módulo de negocio.

Hallazgos no bloqueantes (no impiden `✅ Aprobado`, quedan como mejora futura):

- 🟡 [ISO-25010: Fiabilidad] `name` de Proyecto/Tarea puede quedar en blanco si el usuario ingresa solo espacios — el `required` de HTML5 no lo rechaza y el `.trim()` se aplica sin re-validar longitud. **Sugerencia:** validar `name.trim().length > 0` antes de invocar `onSubmit`.
- 🟡 [ISO-25010: Mantenibilidad] `onStorageChange` en `local-storage-adapter.ts` está exportado y testeado pero ningún store lo consume aún para resincronizar entre pestañas (lo promete ADR-011 pero no está cableado). **Sugerencia:** cablearlo a los stores o retirarlo hasta tener un consumidor real.
- 🟡 [ISO-25010: Adecuación funcional] Introducido por la corrección de este review: cuando `createTask`/`updateTask` devuelven `projectNotFound: true`, `handleFormSubmit` en `page.tsx` hace `return` sin mostrar ningún mensaje al usuario (a diferencia del flujo de borrado, que sí usa `blockedMessage`). Hoy es de bajo impacto porque el `<select>` de `TaskForm` no permite elegir un proyecto inexistente. **Sugerencia:** mostrar un mensaje de error también en este camino, por consistencia con el flujo de eliminación.
- 🟡 [ISO-25010: Mantenibilidad] `updateTask` no aplica el mismo guard de temporizador activo que `deleteTask` — hoy no causa pérdida de datos (la Tarea sigue existiendo, solo cambia de Proyecto), pero es una inconsistencia de regla de negocio a revisar en una iteración futura.
- 💡 [Usabilidad] Eliminar Proyecto/Tarea es una acción directa sin diálogo de confirmación, pese a que los flujos documentados (`timetracker.md`) mencionan un paso de confirmación explícito. Ningún AC lo exige.

## Próximas acciones

1. Escribir al menos un test e2e bajo `e2e/` (o remover/posponer formalmente el check de Playwright) para que el check **e2e** deje de fallar — es el único bloqueante restante para `✅ Aprobado`.
2. Commitear los 5 archivos modificados por las correcciones de este review (`package.json`, `pnpm-lock.yaml`, `src/app/page.tsx`, `src/features/tasks/use-task-actions.ts`, `src/features/tasks/use-task-actions.test.ts`).
3. (No bloqueante) Mostrar un mensaje de error en `handleFormSubmit` cuando `projectNotFound` es `true`.
4. (No bloqueante) Validar `name.trim().length > 0` en `ProjectForm`/`TaskForm`.
5. (No bloqueante) Decidir si cablear `onStorageChange` a los stores o retirarlo.
6. (No bloqueante) Evaluar aplicar el guard de temporizador activo también en `updateTask`.

## Justificaciones aceptadas

Ninguna — ambos hallazgos bloqueantes (🔴 delete+timer activo, 🟠 createTask sin validar Proyecto) fueron corregidos, no justificados. El FAIL de e2e no es un hallazgo cualitativo sino un check automatizado; el usuario decidió no corregirlo ahora, sin ofrecer una justificación formal para registrar — queda como acción pendiente (ver arriba).
