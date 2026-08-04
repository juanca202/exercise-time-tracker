# Code Review — exercise-time-tracker · feature/implementacion → main

**Fecha:** 2026-08-04 10:30
**Repositorio:** exercise-time-tracker
**Rama:** feature/implementacion
**Commit:** bf2bfd4
**Working tree:** sucio (`e2e/navigation.spec.ts` nuevo, `vitest.config.ts` modificado — pendientes de commit tras esta última corrección)
**Modo:** default
**Veredicto:** ✅ Aprobado

## Resumen

Se revisó el diff completo `origin/main..HEAD` (132 archivos, ~7000 líneas): implementación de las 4 historias de usuario del producto (layout, gestión de proyectos, gestión de tareas y registro de tiempo, reportes e historial) más el archivado de 5 changes de OpenSpec. La etapa automatizada y la revisión cualitativa quedaron ambas superadas tras corregir, con autorización del usuario, dos hallazgos bloqueantes (pérdida de datos al eliminar una Tarea con temporizador activo, y validación asimétrica de Proyecto en `createTask`) y el FAIL de **E2E** (`playwright.config.ts` existía sin ningún test bajo `e2e/`): se agregó un smoke test de navegación (`e2e/navigation.spec.ts`) y se corrigió `vitest.config.ts` para excluir `e2e/` de la suite de Vitest, evitando el conflicto de globs entre ambos runners. Todos los checks quedan en verde y no quedan hallazgos cualitativos bloqueantes sin resolver.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                 | Categoría   | Estado | Detalle                                     | Duración |
| --- | ---------- | ----------------------- | ----------- | ------ | ------------------------------------------- | -------- |
| 1   | tipado     | `tsc --noEmit`          | Bloqueante  | ✅     | 0 errores                                   | ~2s      |
| 2   | linter     | `eslint .`              | Bloqueante  | ✅     | 0 errors, 0 warnings                        | ~2s      |
| 3   | unit tests | `vitest run`            | Bloqueante  | ✅     | 119 passed, 0 failed (29 archivos)          | 4.4s     |
| 4   | coverage   | `vitest run --coverage` | Bloqueante  | ✅     | 98.13% stmts / 89.43% branches (sin umbral) | 4.7s     |
| 5   | build      | `next build`            | Bloqueante  | ✅     | OK — 4 rutas generadas                      | ~2s      |
| 6   | e2e        | `playwright test`       | Condicional | ✅     | 3 passed (smoke test de navegación)         | 7.6s     |
| 7   | sonar      | —                       | Informativo | —      | N/A (sin `sonar-project.properties`)        | —        |

### Detalle de checks fallidos

Sin checks fallidos.

**Historial de correcciones durante este review:**

- **coverage** — inicialmente `SKIPPED` porque `@vitest/coverage-v8` no estaba instalado (ni `@vitest/coverage-istanbul`) y no había script de coverage configurado. El usuario autorizó instalar `@vitest/coverage-v8` como devDependency; tras instalarlo, pasa a `✅ PASS` (sin umbrales configurados en `vitest.config.ts`, exit 0 basta).
- **e2e** — inicialmente `❌ FAIL` con `Error: No tests found`: existía `playwright.config.ts` (ADR-008) pero ningún archivo bajo `e2e/`. El usuario autorizó escribir un smoke test (`e2e/navigation.spec.ts`, 3 casos: carga de Tareas por defecto, navegación a Proyectos, navegación a Historial, verificando URL, `aria-current` y contenido visible). Al agregarlo, el patrón `include` de Vitest (`**/*.{test,spec}.{ts,tsx}`) lo capturó también, rompiendo la suite de unit tests (el archivo usa la API de `@playwright/test`, incompatible con el runtime de Vitest). Se corrigió agregando `"e2e"` a `exclude` en `vitest.config.ts`, alineado con el `testDir: "./e2e"` ya declarado en `playwright.config.ts`. Ambos checks re-ejecutados en verde tras el fix.

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

Sin acciones bloqueantes pendientes. No bloqueantes, para una iteración futura:

1. Mostrar un mensaje de error en `handleFormSubmit` cuando `projectNotFound` es `true`.
2. Validar `name.trim().length > 0` en `ProjectForm`/`TaskForm`.
3. Decidir si cablear `onStorageChange` a los stores o retirarlo.
4. Evaluar aplicar el guard de temporizador activo también en `updateTask`.
5. Ampliar la suite e2e más allá del smoke test de navegación (flujos de creación/eliminación de Tareas y Proyectos, timer, registro manual).

## Justificaciones aceptadas

Ninguna — los tres hallazgos bloqueantes (🔴 delete+timer activo, 🟠 createTask sin validar Proyecto, ❌ e2e sin tests) fueron corregidos, no justificados.
