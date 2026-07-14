# Code Review — US-003-historial-de-registros

**Fecha**: 2026-07-14 10:00
**Repositorio**: exercise-time-tracker
**Rama**: loop/test-3 · **Commit**: e6a985f (merge de `worktree-wf_f50d6d04-9a0-4` en curso, sin confirmar)
**Working tree**: sucio (merge en curso, cambios ya staged tras la reconciliación)
**Modo**: default
**Historia**: US-003-historial-de-registros
**Veredicto**: ✅ Apto

## Resumen

Se revisó la reconciliación de la feature "Historial de registros" (US-003) contra la infraestructura compartida canónica (`@/shared/domain`, `@/shared/persistence`, `@/shared/store`, `@/shared/ui`) ya validada por `fundamentos-infraestructura-compartida` y `gestion-proyectos`. La implementación original reimplementaba su propia copia paralela de dominio/store/persistencia; esa duplicación fue eliminada y la feature real (`src/features/historial/`) fue adaptada para consumir `useAppStore`/`@/shared/domain`/`@/shared/persistence`. Todas las verificaciones automatizadas pasan en verde y la revisión cualitativa no encontró hallazgos bloqueantes.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                     | Categoría   | Estado | Detalle                                                                                                                 | Duración |
| --- | ---------- | --------------------------- | ----------- | ------ | ----------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | tipado     | `npx tsc --noEmit`          | Bloqueante  | ✅     | 0 errores                                                                                                               | ~3s      |
| 2   | linter     | `npm run lint`              | Bloqueante  | ✅     | 0 errors, 1 warning (en `coverage/`, gitignored, no forma parte del diff)                                               | ~4s      |
| 3   | unit tests | `npx vitest run`            | Bloqueante  | ✅     | 88 passed, 0 failed (18 archivos)                                                                                       | 2.50s    |
| 4   | coverage   | `npx vitest run --coverage` | Bloqueante  | ✅     | 93.53% stmts / 85.9% branch (sin umbral configurado → exit 0 basta)                                                     | ~2s      |
| 5   | build      | `npm run build`             | Bloqueante  | ✅     | OK — 5 rutas estáticas generadas incl. `/historial`                                                                     | ~2s      |
| 6   | e2e        | `npx playwright test`       | Condicional | ✅     | 15 passed (smoke, app-shell-navegacion, gestion-proyectos, historial×3, historial-design-tokens, historial-rendimiento) | 9.4s     |
| 7   | sonar      | —                           | Informativo | —      | N/A (sin `sonar-project.properties`)                                                                                    | —        |

### Detalle de checks fallidos

Sin checks fallidos.

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** integrar `historial-de-registros` (US-003) en `loop/test-3` eliminando la infraestructura compartida duplicada que el agente original reimplementó (por haber partido de un estado previo al merge de `fundamentos-infraestructura-compartida`), y adaptar la feature real para que consuma la infraestructura canónica ya validada por dos specs anteriores, sin dejar dos stores/dominios/persistencias paralelos.

### Análisis semántico

✅ conforme. La reconciliación cubre los AC-001 a AC-007 de `historial-de-registros`:

- AC-001 (historial completo, datos corruptos, vacío): `useHistorialRegistros` + `EstadoVacioHistorial` cubren los tres escenarios; el caso de storage corrupto se degrada al mismo estado vacío controlado que el store raíz canónico ya garantiza (`adaptador.ts` captura el `JSON.parse` y devuelve `null`), documentado explícitamente en el JSDoc del hook para que quede trazable por qué ya no hay un mensaje de error distinto.
- AC-002/AC-003/AC-004 (totales por Tarea/Proyecto/mes): los tres selectores puros (`calcularTotalPorTarea`, `calcularTotalPorProyecto`, `calcularTotalPorMes`) quedaron adaptados al campo `duracionMinutos` y a `obtenerMesCalendario` de `@/shared/date`, reutilizando el helper compartido en vez de reimplementarlo (exactamente lo que pide AC-004: "sin reimplementar la lógica de atribución de mes").
- AC-005 (rendimiento ≤1000 registros): `e2e/historial-rendimiento.spec.ts` sigue vigente y en verde tras adaptar `generarDatosSinteticos` a la forma canónica del dominio.
- AC-006/AC-007 (diseño Precision Focus / Figma): `e2e/historial-design-tokens.spec.ts` (TC-015) sigue en verde; los tokens que faltaban en `globals.css` (`surface-container-low/high`, `radius-precision-*`, `--font-mono`) se agregaron de forma aditiva, sin tocar los ya consumidos por Proyectos.

Un efecto colateral bien manejado y no trivial: `formatearFecha` tenía un bug de zona horaria real (`new Date("YYYY-MM-DD")` se interpreta como medianoche UTC; formatear ese instante con la zona horaria local de un entorno con offset negativo respecto a UTC —como el de esta ejecución, `America/Guayaquil`— mostraba el día calendario anterior). Se corrigió fijando `timeZone: "UTC"` para fechas puras y se agregó un test de regresión (`formatearDuracion.test.ts`). Es un fix legítimo dentro del alcance de la reconciliación (surge directamente de adaptar `registro.horaInicio` → `registro.fecha`, que cambia el formato de entrada de datetime a día puro), no scope creep.

### Arquitectura y diseño

✅ conforme, con un hallazgo menor.

- [ISO-25010: Mantenibilidad] Se confirmó con `grep -rn` que ningún archivo fuera de la copia duplicada importaba `src/shared/domain/types.ts`, `src/shared/store/useTimeTrackerStore.ts`, `src/shared/testing/objectMother.ts`, `src/shared/date/obtenerClaveMes.ts` ni `src/shared/ui/Sidebar.tsx` antes de eliminarlos: la eliminación no dejó importadores huérfanos (verificado también por el `tsc --noEmit` en verde).
- [ISO-25010: Mantenibilidad] La extensión de `src/shared/persistence/adaptador.ts` (exportar `CLAVE_ALMACENAMIENTO`) y de `src/shared/persistence/index.ts` es mínima y bien justificada: evita que el fixture E2E (`e2e/fixtures/seedTimeTracker.ts`) hardcodee un literal que podría desincronizarse silenciosamente del adaptador real. Es el mismo criterio "aditivo, sin romper la interfaz estable" que ya se aplicó en el merge anterior de `gestion-proyectos` sobre `globals.css`.
- [ISO-25010: Mantenibilidad] Los selectores (`calcularTotalPorTarea/Proyecto/Mes`) y `validarRegistro` quedaron con la misma forma y garantías defensivas que tenían antes de la reconciliación (excluir sin lanzar, resolver a 0/vacío), solo con los campos renombrados — no se perdió cobertura de casos borde en el cambio de dominio.
- 🟡 [ISO-25010: Mantenibilidad] `TC-012` de `calcularTotalPorMes.test.ts` ya no puede probar literalmente "cruce de medianoche" porque el dominio canónico solo persiste `fecha` (un día calendario), no `horaInicio`/`horaFin`: la atribución al mes de inicio para un registro de temporizador que cruza la medianoche es responsabilidad de quien construye el `RegistroDeTiempo` (`gestion-tareas-temporizador`, en desarrollo en paralelo en otro worktree), no de este selector. El test fue reescrito para documentar esa responsabilidad compartida y seguir cubriendo que `calcularTotalPorMes` no reintroduce prorrateo. **Por qué:** es una cobertura correcta para el selector, pero dejaría un hueco real si `gestion-tareas-temporizador` no verificara, en su propia spec, que construye `fecha` con el día de inicio y no el de fin. **Impacto:** bajo y contenido a un caso borde de una feature que todavía no ha aterrizado en esta rama. **Sugerencia concreta:** cuando se integre `gestion-tareas-temporizador`, confirmar en su propio code review/trace-validate que existe un caso de prueba equivalente a nivel de creación del registro (no solo de agregación), y dejarlo anotado como observación de trazabilidad — no bloquea esta reconciliación.

### Feedback adicional

Lo que está especialmente bien resuelto en esta reconciliación:

- El hook `useHistorialRegistros` y `HistorialScreen` documentan explícitamente, en el propio JSDoc, la decisión consciente de simplificar `parseError` a un único estado vacío controlado — deja rastro de _por qué_ se tomó esa decisión en vez de solo borrar código, lo cual ayuda a quien lea el diff sin este contexto.
- El bug de zona horaria de `formatearFecha` es el tipo de regresión que fácilmente pasa desapercibida en una adaptación de campos (`horaInicio` datetime → `fecha` día puro) porque los tests originales usaban cadenas con componente horario; se detectó proactivamente, se corrigió y se cubrió con un test que reproduce la condición exacta (zona horaria con offset negativo).
- Los tres selectores puros y `esRegistroValido` mantienen exactamente las mismas garantías defensivas (excluir sin lanzar, O(n)) que tenían antes de renombrar los campos — no se introdujo ninguna regresión de robustez al adaptar el dominio.

## Próximas acciones

Sin acciones pendientes.

## Justificaciones aceptadas

Ninguna.
