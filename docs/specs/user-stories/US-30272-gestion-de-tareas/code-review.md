# Code Review — US-30272-gestion-de-tareas

Fecha: 2026-07-10 03:26
Repositorio: exercise-time-tracker
Rama: loop/open-spec · Commit: db0859a (working tree con cambios sin commitear)
Working tree: sucio (implementación de este change aún no commiteada)
Modo: default
Historia: US-30272-gestion-de-tareas (change OpenSpec `gestion-de-tareas`, capability `task-time-tracking`)
Veredicto: ✅ Apto

## Resumen

Se revisó la extensión de `task-time-tracking` (creación de Tareas, temporizador único con reemplazo automático, detención, y registro manual) más el nuevo `AppShell` de navegación por pestañas. Todas las verificaciones automatizadas pasan. La revisión cualitativa no encontró hallazgos bloqueantes; se documenta un acoplamiento bidireccional entre `project-management` y `task-time-tracking` como observación no bloqueante, relevante para la próxima capability (`historial-de-registros`, que también leerá ambos stores).

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                      | Categoría   | Estado | Detalle                                                                                                                                                                                                                                                                                            | Duración |
| --- | ---------- | ---------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | tipado     | `npx tsc --noEmit`           | Bloqueante  | ✅     | 0 errores                                                                                                                                                                                                                                                                                          | ~1.5s    |
| 2   | linter     | `npm run lint` (eslint)      | Bloqueante  | ✅     | 0 errors, 0 warnings                                                                                                                                                                                                                                                                               | ~1s      |
| 3   | unit tests | `npm run test:run` (vitest)  | Bloqueante  | ✅     | 57 passed, 0 failed (8 archivos)                                                                                                                                                                                                                                                                   | ~1.3s    |
| 4   | coverage   | `npm run test:coverage`      | Bloqueante  | ✅     | Stmts 100% · Branches 90.5% · Funcs 100% · Lines 100% (umbral 80% en las 4 métricas)                                                                                                                                                                                                               | ~2.2s    |
| 5   | build      | `npm run build` (next build) | Bloqueante  | ✅     | Compilado y prerenderizado OK (`/`)                                                                                                                                                                                                                                                                | ~1.3s    |
| 6   | e2e        | `npx playwright test`        | Condicional | —      | N/A: sigue sin haber specs en `e2e/`; fuera del alcance de tasks.md de este change (solo pide unit + component tests). Verificado manualmente el flujo completo en navegador real (crear Proyecto → crear Tarea → iniciar/detener temporizador → entrada manual → recarga) sin errores de consola. | —        |
| 7   | sonar      | —                            | Informativo | —      | N/A (sin `sonar-project.properties`)                                                                                                                                                                                                                                                               | —        |

### Detalle de checks fallidos

Sin checks fallidos.

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** implementar US-30272 (AC-001 a AC-013): creación de Tarea asociada a un Proyecto, modal "Nueva Tarea" con Cancelar/Crear Tarea, temporizador único de la aplicación con reemplazo automático (BR-02), detención con cálculo y persistencia inmediata de Duración, validación de Duración > 0 (BR-03) tanto para el temporizador como para el registro manual, y formulario "Entrada Manual" con Fecha/Proyecto-Tarea/Duración.

### Análisis semántico

✅ conforme. Los trece AC quedan cubiertos: el store expone `createTask`, `startTimer`, `stopTimer` y `addManualTimeEntry` con exactamente las validaciones y el comportamiento descritos en `design.md` (temporizador activo como estado derivado `{taskId, startedAt} | null`, reemplazo atómico en un único `set`, duración con precisión de segundos vía `calculateDurationSeconds`). El caso límite de BR-02+BR-03 combinado (reemplazo con duración calculada = 0) se resuelve exactamente como especifica la observación de TC-009: no persiste el `TimeEntry` del temporizador anterior, pero igual inicia el nuevo — verificado con test dedicado.

- 💡 AC-012/AC-013 (presupuesto de rendimiento) se validan con pruebas unitarias que miden `performance.now()` alrededor de la llamada síncrona al store (con `Date` simulado para fijar la duración de negocio sin depender de tiempo real de espera) — **Por qué:** los propios TC-021/TC-022 declaran "Automatización: Parcial" porque medir latencia real de UI en CI es flaky; esta métrica cubre el costo real de la lógica de negocio pero no la latencia de renderizado de React ni de Next.js. **Impacto:** ninguno negativo, es una cobertura parcial ya anticipada por el TC. **Sugerencia:** si en el futuro se quiere medir la latencia percibida end-to-end, usar un harness de Performance API sobre Playwright con tolerancia y repeticiones, tal como sugieren ambos TC.

### Arquitectura y diseño

- 🟡 [ISO-25010: Mantenibilidad] Acoplamiento bidireccional entre `project-management` y `task-time-tracking` — **Qué:** `task-time-tracking/ui/new-task-dialog.tsx` y `manual-entry-form.tsx` importan `useProjectStore` desde `@/features/project-management` (para listar Proyectos), mientras que `project-management/model/use-project-total-time.ts` importa `useTaskTimeTrackingStore` desde `@/features/task-time-tracking` (para sumar tiempos). Cada feature depende de la API pública de la otra, no de sus internos, pero la dirección de dependencia es circular a nivel de módulo. **Por qué:** contradice parcialmente el objetivo de ADR-005 de bajo acoplamiento entre features ("no depender directamente unas de otras"); dificulta razonar, testear o (hipotéticamente) extraer una de las dos features de forma aislada. **Impacto:** contenido hoy a estos dos puntos concretos; la próxima capability (`historial-de-registros`) también leerá ambos stores, lo que sumaría un tercer punto de acoplamiento cruzado. **Sugerencia concreta:** si al implementar `historial-de-registros` se repite el mismo patrón, considerar extraer un módulo de solo lectura en `src/shared/` (p. ej. un selector "agregados" que combine Proyectos + Tareas/Registros) del que las tres features lean, en vez de que se importen entre sí — aplicando el criterio "no abstraigas hasta el tercer caso" que ya usa este proyecto. No es bloqueante ahora: el propio `design.md` de `gestion-de-proyectos` ya sancionó explícitamente este tipo de composición a nivel de hook/UI para una app de este tamaño.
- 🟡 [ISO-25010: Mantenibilidad] Validador de "nombre obligatorio" duplicado — **Qué:** `validateName` en `new-project-dialog.tsx` y en `new-task-dialog.tsx` son funciones idénticas (`String(value ?? "").trim() ? null : "El nombre es obligatorio"`). **Por qué:** duplicación real (misma razón de cambio: si el mensaje o la regla de "obligatorio" cambia, hay que tocarlo en dos lugares y es fácil que diverjan). **Impacto:** bajo, dos ocurrencias, contenido a la capa de UI. **Sugerencia concreta:** extraer un `validateRequiredText(message: string)` en `src/shared/lib/` reutilizable por ambos modales (y por el futuro validador de Fecha/Tarea si aplica el mismo patrón).
- 💡 [ISO-25010: Fiabilidad] `TaskRow` no captura la excepción de `stopTimer()` — **Qué:** `onClick={() => stopTimer()}` no envuelve la llamada en `try/catch`; si la Duración calculada fuera ≤ 0 (escenario límite de TC-013, solo alcanzable si el usuario detiene en el mismo milisegundo del inicio), el `throw` se propagaría sin manejo a React. **Por qué:** en un caso real de clic de usuario es prácticamente irreproducible (de ahí que TC-013 se documente como "Automatizable (Unit)", no E2E), pero de ocurrir, el usuario vería un error no controlado en vez de un mensaje entendible. **Impacto:** bajo, dado lo improbable del escenario. **Sugerencia:** envolver la llamada en `try/catch` y mostrar el mensaje de error (p. ej. con el mismo patrón de `Field.Error` u otro feedback visual) si se quiere blindar ese borde exacto.
- ✅ conforme en el resto: `startTimer`/`stopTimer` implementan el reemplazo atómico y la detención exactamente como describe `design.md` (una única llamada a `set` por transición de estado, sin ventana intermedia); `partialize` del store persiste `tasks`, `timeEntries` y `activeTimer` (soporta RFB-001/RFB-002, recuperación tras cierre inesperado); `AppShell` es una composición mínima y clara (estado de pestaña local, sin lógica de negocio); TSDoc presente en la lógica no trivial (`calculateDurationSeconds`, acciones del store) y omitido en la trivial, conforme ADR-006.

### Feedback adicional

Buen manejo del caso borde de BR-02+BR-03 combinado (TC-009): la lógica de `startTimer` calcula la duración del temporizador anterior, y solo agrega el `TimeEntry` si es > 0, sin bloquear jamás el inicio del nuevo temporizador — esto evita que un caso límite de validación bloquee una operación automática que el usuario no inició directamente. La verificación manual en navegador (crear Proyecto → crear Tarea → iniciar/detener temporizador → entrada manual → recargar) no mostró ningún error ni advertencia de hidratación, confirmando que el patrón `skipHydration` + `useHydratePersistedStore` introducido en el change anterior sigue funcionando correctamente con el segundo store y con `AppShell` alternando pantallas.

## Próximas acciones

Sin acciones pendientes (los hallazgos 🟡/💡 quedan documentados para considerar si se repiten en `historial-de-registros`).

## Justificaciones aceptadas

Ninguna.
