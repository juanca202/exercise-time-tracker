# Code Review — US-002-tareas (openspec: gestion-tareas-temporizador)

**Fecha**: 2026-07-14 09:50 (re-ejecución completa sobre el estado final)
**Repositorio**: exercise-time-tracker
**Rama**: worktree-wf_f50d6d04-9a0-3 · **Commit**: 9bbab1f (working tree con cambios sin commitear)
**Working tree**: sucio (cambios de la feature `tareas` pendientes de commit — ver detalle abajo)
**Modo**: default
**Historia**: US-002-tareas (docs/specs/user-stories/US-002-tareas/README.md)
**Veredicto**: ✅ Apto

## Resumen

Se revisó la implementación completa del change OpenSpec `gestion-tareas-temporizador` (US-002): gestión de Tareas, temporizador único global, ingreso manual de tiempo y widget de Meta Semanal, incluyendo la pantalla `/tareas`, el modal `TareaFormModal`, tests unitarios (Vitest + Testing Library) y E2E (Playwright, incluyendo medición de rendimiento con la Performance API y regresión visual). Esta es una **re-ejecución completa** del review desde cero (no se asumió el resultado de una corrida anterior): todas las verificaciones automatizadas pasan y, de los hallazgos cualitativos menores detectados, los tres accionables (integridad referencial en `crearTarea`/`crearRegistroManual`, `aria-label` del botón "Editar", rango ARIA del `progressbar` de Meta Semanal) **se corrigieron y se re-verificaron** antes de este informe final. No quedan hallazgos bloqueantes.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                                                                                                                 | Categoría   | Estado | Detalle                                                                                                                                | Duración |
| --- | ---------- | ----------------------------------------------------------------------------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | tipado     | `npx tsc --noEmit -p tsconfig.json`                                                                                     | Bloqueante  | ✅     | 0 errores                                                                                                                              | ~3s      |
| 2   | linter     | `npm run lint` (eslint .)                                                                                               | Bloqueante  | ✅     | 0 errors, 0 warnings                                                                                                                   | ~2s      |
| 3   | unit tests | `npx vitest run`                                                                                                        | Bloqueante  | ✅     | 70 passed, 0 failed (16 archivos) — incluye 2 tests de "persistencia tras recarga simulada" agregados tras el trace-validate posterior | 2.78s    |
| 4   | coverage   | `npx vitest run --coverage`                                                                                             | Bloqueante  | ✅     | 93.3% stmts / 85.59% branch / 95.18% funcs / 93% lines (ADR-007 exige ≥80%, se cumple ampliamente)                                     | 2.66s    |
| 5   | build      | `npm run build` (next build)                                                                                            | Bloqueante  | ✅     | Compiló y generó `/`, `/_not-found`, `/tareas`                                                                                         | ~2s      |
| 6   | e2e        | `npx playwright test e2e/smoke.spec.ts e2e/tareas-regresion-visual.spec.ts e2e/tareas-temporizador-performance.spec.ts` | Condicional | ✅     | 4 passed, 0 failed (smoke, performance, 2 visual)                                                                                      | 5.9s     |
| 7   | sonar      | —                                                                                                                       | Informativo | —      | N/A (no existe `sonar-project.properties`)                                                                                             | —        |

### Detalle de checks fallidos

Sin checks fallidos.

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** implementar el núcleo funcional de Time Tracker (US-002): CRUD de Tarea asociada a Proyecto, temporizador único global con auto-detención, ingreso manual de tiempo y Meta/Total Semanal, según `openspec/changes/gestion-tareas-temporizador/{proposal,design}.md` y las specs `gestion-de-tareas`, `temporizador`, `registro-manual-de-tiempo`, `meta-semanal`.

### Análisis semántico

✅ conforme. El diff cubre exactamente los objetivos declarados, sin lógica fuera de alcance. Las funciones de negocio están anotadas con TSDoc que referencia explícitamente el `AC-XXX`/`BR-XXX` que implementan.

- ~~🟡 `crearTarea`/`crearRegistroManual` no validaban que `proyectoId`/`tareaId` referenciaran una entidad existente en el store (solo que fueran no vacíos).~~ **Corregido:** ambas acciones ahora verifican la existencia de la entidad referenciada en el store antes de persistir (`src/features/tareas/lib/acciones-tareas.ts`, `src/features/tareas/lib/acciones-registro-manual.ts`), con tests unitarios nuevos (`rechaza la creación cuando el Proyecto seleccionado no existe en el store`, `rechaza el registro cuando la Tarea seleccionada no existe en el store`). Verificado con `vitest run` (68/68 passed).

### Arquitectura y diseño

✅ conforme. Puntos observados:

- **Separación de capas (ADR-005):** `src/shared/store/raiz-store.ts` expone únicamente operaciones CRUD "en crudo" sin reglas de negocio; toda la validación y las reglas de negocio (BR-01 a BR-05) viven en `src/features/tareas/lib/*`, con tests co-localizados (ADR-007).
- **Reutilización sin duplicación:** los tipos de dominio se definen una sola vez en `src/shared/domain/types.ts`.
- **Defensa en profundidad consistente:** `validarDuracion` se comparte entre el flujo del temporizador y el manual; tras la corrección de este review, la integridad referencial (Proyecto/Tarea existente) sigue el mismo patrón.
- **Componentes React:** `TareaFormModal` usa `key` para forzar remount en vez de `useEffect` + `setState`, evitando cascading renders (decisión documentada inline).
- **Tokens de diseño:** `globals.css`/`layout.tsx` migran a las variables `--color-*` del tema Precision Focus vía `@theme inline` (Tailwind 4, ADR-002); los componentes de la feature consumen exclusivamente esos tokens.
- ~~🟡 `TareaListItem.tsx`: el botón "Editar" no llevaba `aria-label` distintivo.~~ **Corregido:** se agregó `aria-label={`Editar ${tarea.nombre}`}`, consistente con los controles de temporizador; test actualizado para verificar por ese nombre accesible. Verificado con `vitest run`.
- 🟡 `[ISO-25010: Compatibilidad]` Esta implementación definió los tokens de diseño de `DESIGN.md` en `src/app/globals.css` (bloque `@theme`) y las fuentes Inter/JetBrains Mono en `src/app/layout.tsx`, adelantando trabajo que en principio correspondía a `fundamentos-infraestructura-compartida`. **Por qué:** sin esos tokens, las clases Tailwind usadas en los componentes de `tareas` no generarían ninguna regla CSS real. **Impacto:** si `fundamentos-infraestructura-compartida` se implementa/mergea por separado, su propio trabajo sobre `globals.css`/`layout.tsx` podría solaparse con lo ya definido aquí. **Sugerencia concreta:** al integrar (`work-integrate`), verificar que no exista una versión más nueva de `globals.css`/`layout.tsx` proveniente de `fundamentos-infraestructura-compartida` que deba prevalecer o fusionarse con esta; no bloquea el merge de esta US en sí misma.
- 🟡 `[ISO-25010: Mantenibilidad]` `MetaSemanalWidget.tsx`: el `progressbar` fijaba `aria-valuemax={100}` mientras `aria-valuenow` puede superar 100 (AC-019 exige no aplicar techo). **Corregido:** `aria-valuemax={Math.max(100, porcentaje)}`, manteniendo el rango ARIA siempre consistente con el valor reportado. Verificado con `vitest run` y la suite e2e de regresión visual (sin cambios de snapshot, ya que el atributo no afecta el render visual).

### Feedback adicional

- Buen manejo de la máquina de estados del temporizador: `iniciarTemporizador` ejecuta de forma síncrona detener→calcular→persistir→iniciar en una sola acción de store (BR-02/BR-03), con el caso límite de Duración = 0 (TC-010) cubierto a nivel de store.
- Uso correcto de `fechaInputALocalIso` en `RegistroManualForm` para evitar el desplazamiento de día por interpretación UTC de `<input type="date">`.
- Buena trazabilidad TSDoc → AC/BR/TC en cada archivo de `lib/`, y uso consistente del patrón Object Mother en los tests (`src/features/tareas/testing/object-mother.ts`).
- Cobertura de pruebas sólida: unitarias (creación/edición/validación de Tarea, máquina de estados del temporizador, ingreso manual, integridad referencial, cálculo de semana/porcentaje, accesibilidad del modal) y E2E (rendimiento con Performance API, regresión visual). Coverage final 93.3%/85.6%/95.2%/93% supera holgadamente el umbral del 80% de ADR-007.

## Próximas acciones

Sin acciones bloqueantes pendientes.

1. Al ejecutar `work-integrate` de esta US, confirmar que `globals.css`/`layout.tsx` no colisionan con un trabajo paralelo de `fundamentos-infraestructura-compartida` sobre los mismos archivos (no bloqueante para esta US en aislamiento).

## Justificaciones aceptadas

Ninguna.
