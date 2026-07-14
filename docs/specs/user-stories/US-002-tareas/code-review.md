# Code Review — US-002-tareas (openspec: gestion-tareas-temporizador)

**Fecha**: 2026-07-14 10:29 (re-ejecución completa sobre el estado ya reconciliado en `loop/test-3`)
**Repositorio**: exercise-time-tracker
**Rama**: loop/test-3 · **Commit**: d3190ff (base) + reconciliación en working tree, sin commitear aún
**Working tree**: sucio (todos los cambios de la reconciliación en stage, listos para commit)
**Modo**: default
**Historia**: US-002-tareas (docs/specs/user-stories/US-002-tareas/README.md)
**Veredicto**: ✅ Apto

## Resumen

Se revisó el resultado **ya reconciliado** de mergear `worktree-wf_f50d6d04-9a0-3` (change OpenSpec `gestion-tareas-temporizador`, US-002) sobre `loop/test-3`. La rama de origen había reimplementado su propia copia paralela de la infraestructura compartida (`useRaizStore`, `src/shared/domain/types.ts`, `local-storage-adapter.ts`) porque partió de un estado anterior al merge de `fundamentos-infraestructura-compartida`. La reconciliación eliminó esa infraestructura duplicada y adaptó toda `src/features/tareas/` para consumir `useAppStore`/`@/shared/domain`/`@/shared/persistence` canónicos, incluyendo la conversión de `duracionMs` → `duracionMinutos` y de `fecha` (ISO datetime) → día calendario puro `YYYY-MM-DD`. No se asumió el code-review previo de la rama de origen: se re-ejecutó todo desde cero sobre el estado final ya mergeado. Todas las verificaciones automatizadas pasan y no se detectaron hallazgos cualitativos bloqueantes.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                                                     | Categoría   | Estado | Detalle                                                                                                                                                                                               | Duración |
| --- | ---------- | ----------------------------------------------------------- | ----------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | tipado     | `npx tsc --noEmit -p tsconfig.json`                         | Bloqueante  | ✅     | 0 errores                                                                                                                                                                                             | ~2s      |
| 2   | linter     | `npm run lint` (eslint .)                                   | Bloqueante  | ✅     | 0 errors, 0 warnings (1 warning informativo en `coverage/` generado y gitignorado, no forma parte del código fuente)                                                                                  | ~2s      |
| 3   | unit tests | `npx vitest run`                                            | Bloqueante  | ✅     | 149 passed, 0 failed (32 archivos)                                                                                                                                                                    | 3.49s    |
| 4   | coverage   | `npx vitest run --coverage`                                 | Bloqueante  | ✅     | 94.22% stmts / 88.18% branch / 96.71% funcs / 93.82% lines (ADR-007 exige ≥80%, se cumple ampliamente)                                                                                                | 3.52s    |
| 5   | build      | `npx next build`                                            | Bloqueante  | ✅     | Compiló y generó `/`, `/_not-found`, `/proyectos`, `/historial`, `/tareas`                                                                                                                            | ~2s      |
| 6   | e2e        | `PLAYWRIGHT_PORT=4877 npx playwright test` (suite completa) | Condicional | ✅     | 18 passed, 0 failed (smoke, app-shell-navegacion, gestion-proyectos ×4, historial ×3, historial-design-tokens, historial-rendimiento ×2, tareas-regresion-visual ×2, tareas-temporizador-performance) | 9.7s     |
| 7   | sonar      | —                                                           | Informativo | —      | N/A (no existe `sonar-project.properties`)                                                                                                                                                            | —        |

### Detalle de checks fallidos

Sin checks fallidos. (Durante la reconciliación se detectó y corrigió un snapshot visual desactualizado — ver Feedback adicional — pero quedó resuelto antes de este informe.)

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** completar la reconciliación de la última de cuatro specs integradas secuencialmente en `loop/test-3`: eliminar la infraestructura compartida duplicada que la rama de origen había reimplementado por partir de una base desactualizada, y dejar la feature Tareas/Temporizador (US-002) consumiendo exclusivamente la infraestructura canónica ya validada por las tres integraciones anteriores, sin regresiones funcionales ni de diseño.

### Análisis semántico

`✅ conforme`. La reconciliación preserva exactamente el comportamiento funcional original (AC-001 a AC-019 de US-002: CRUD de Tareas, máquina de estados del temporizador con auto-detención al cambiar de Tarea, ingreso manual con validación de Duración > 0, Meta Semanal/Total Semanal/porcentaje) mientras traduce las formas de datos al contrato canónico:

- `duracionMs` (worktree) → `duracionMinutos` (canónico): conversión exacta (`duracionMs / 60_000`) sin redondeo, verificada con los mismos casos de prueba originales (25 min, etc.).
- `fecha` como ISO datetime completo → día calendario puro `YYYY-MM-DD`: se introdujo `fechaLocalACalendario`/`fechaCalendarioALocal` (`src/features/tareas/lib/fecha-calendario.ts`) para preservar, en ambos sentidos, el día calendario **local** (no UTC) tanto al persistir el Registro del temporizador como al comparar Registros contra el rango Lunes-Viernes en `calcularTotalSemanal` — evita el mismo corrimiento de día por offset UTC que la propia rama de origen ya prevenía con `fechaInputALocalIso` para el ingreso manual, y lo generaliza también al temporizador.
- El ingreso manual se simplificó: el valor de `<input type="date">` ya es `YYYY-MM-DD` por especificación HTML, así que ahora se pasa directo como `fecha` sin conversión intermedia (antes se convertía a ISO completo y se reconvertía) — menos codificación/decodificación redundante para el mismo dato.

Ambos caminos de creación de Registros (temporizador y manual) quedan conectados a las mismas acciones canónicas (`crearRegistroDeTiempo`, `establecerTemporizadorActivo`) del store único, con `id`/`creadoEn` generados igual que el resto de la app (`generarId()` de `@/shared/store`).

### Arquitectura y diseño

`✅ conforme`, con una observación menor no bloqueante.

- [ISO-25010: Mantenibilidad] 🟡 Barrel `src/features/tareas/lib/index.ts` sin consumidores.
  **Qué:** ningún archivo importa `../lib` (barrel); todos los módulos de la feature importan directo del archivo concreto (p. ej. `./validar-duracion`), y `src/app/tareas/page.tsx` importa `PanelTareas` por ruta directa, igual que hace `historial` (a diferencia de `proyectos`, que sí consume su barrel desde la página).
  **Por qué:** es código que no cumple ninguna función hoy; queda como superficie a mantener sincronizada manualmente si se agregan/renombran funciones en `lib/`.
  **Impacto:** local, cosmético — no afecta build, tipado ni runtime.
  **Sugerencia concreta:** si no hay un consumidor externo previsto para esta feature, eliminar `lib/index.ts`; si se prevé una API pública (como en `proyectos`), hacer que `src/app/tareas/page.tsx` la consuma para que dead code no se acumule. No es atribuible a la reconciliación: el barrel ya estaba sin consumir en la rama de origen; se documenta para que quede trazado, no bloquea el merge.

Puntos positivos a destacar:

- La eliminación de la infraestructura duplicada (`raiz-store.ts`, `local-storage-adapter.ts`, `domain/types.ts`, `testing/object-mother.ts`) fue completa y verificada por `grep` antes de borrar — no quedaron referencias huérfanas.
- El patrón de gate de hidratación en `PanelTareas.tsx` (encabezado siempre visible, contenido dependiente de datos gateado tras `haHidratado`) se alineó al patrón ya establecido por `HistorialScreen`/`ProyectosListado`, en vez de mantener el `return null` de cuerpo completo que tenía la rama de origen (que ocultaba innecesariamente el `<h1>` y el botón "Nueva Tarea" hasta hidratar).
- Los tests unitarios migrados sustituyen el Object Mother local (`src/features/tareas/testing/object-mother.ts`, eliminado) por el canónico `@/shared/domain/object-mother`, siguiendo el mismo patrón ya usado por `historial`.

### Feedback adicional

Durante la verificación e2e se detectó que el snapshot visual `pantalla-tareas-chromium-darwin.png` (regresión visual TC-006/TC-018) estaba desactualizado: el baseline se había capturado contra el layout propio de la rama de origen (sin `Sidebar`, `<div>{children}</div>` a secas), mientras que el layout canónico ya mergeado sí monta el `Sidebar` de 280px. Esto no es un defecto de la feature: es consecuencia directa de reconciliar el layout raíz (`src/app/layout.tsx`, resuelto con `--ours`) con el layout que `worktree-wf_f50d6d04-9a0-3` traía. Se regeneró el snapshot con `--update-snapshots` y se confirmó visualmente que el resultado (sidebar + panel de Tareas con Meta Semanal, listado y formulario) es correcto; el snapshot del modal "Nueva Tarea" no se vio afectado (overlay centrado, independiente del ancho del sidebar).

## Próximas acciones

Sin acciones pendientes bloqueantes. Opcional (no bloqueante, 🟡): decidir si `src/features/tareas/lib/index.ts` se elimina o se adopta como API pública de la feature.

## Justificaciones aceptadas

Ninguna.
