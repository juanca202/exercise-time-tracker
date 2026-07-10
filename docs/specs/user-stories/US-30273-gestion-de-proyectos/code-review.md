# Code Review — US-30273-gestion-de-proyectos

Fecha: 2026-07-10 03:10
Repositorio: exercise-time-tracker
Rama: loop/open-spec · Commit: db0859a (working tree con cambios sin commitear)
Working tree: sucio (implementación de este change aún no commiteada)
Modo: default
Historia: US-30273-gestion-de-proyectos (change OpenSpec `gestion-de-proyectos`, capability `project-management`)
Veredicto: ✅ Apto

## Resumen

Se revisó la implementación completa de `project-management` (creación y listado de Proyectos, tiempo total registrado) más la base mínima de datos de `task-time-tracking` necesaria para el selector de tiempo total. Todas las verificaciones automatizadas pasan (tipado, linter, unit tests, coverage, build). Durante la revisión cualitativa se detectó un defecto real de fiabilidad (hydration mismatch de React por la rehidratación síncrona de `zustand/persist` en SSR) y se corrigió en el mismo ciclo, verificando el arreglo con un smoke test en navegador real (Playwright) antes de cerrar el review.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                      | Categoría   | Estado | Detalle                                                                                                                                                                                                                                  | Duración |
| --- | ---------- | ---------------------------- | ----------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | tipado     | `npx tsc --noEmit`           | Bloqueante  | ✅     | 0 errores                                                                                                                                                                                                                                | ~1.5s    |
| 2   | linter     | `npm run lint` (eslint)      | Bloqueante  | ✅     | 0 errors, 0 warnings                                                                                                                                                                                                                     | ~1s      |
| 3   | unit tests | `npm run test:run` (vitest)  | Bloqueante  | ✅     | 16 passed, 0 failed (4 archivos)                                                                                                                                                                                                         | ~1.1s    |
| 4   | coverage   | `npm run test:coverage`      | Bloqueante  | ✅     | Stmts 100% · Branches 87.5% · Funcs 100% · Lines 100% (umbral 80% en las 4 métricas)                                                                                                                                                     | ~1.2s    |
| 5   | build      | `npm run build` (next build) | Bloqueante  | ✅     | Compilado y prerenderizado OK (`/`)                                                                                                                                                                                                      | ~2.6s    |
| 6   | e2e        | `npx playwright test`        | Condicional | —      | N/A: el repo no tiene aún ninguna spec de e2e (`e2e/` vacío); no forma parte del alcance de tareas de este change (tasks.md solo pide unit + component tests). Verificado manualmente el flujo en navegador (ver sección de fiabilidad). | —        |
| 7   | sonar      | —                            | Informativo | —      | N/A (sin `sonar-project.properties` en este entorno)                                                                                                                                                                                     | —        |

Nota de infraestructura (no específica de este change): no existía script/tooling de coverage en el repo pese a que [ADR-007](../../../../docs/adr/ADR-007-estrategia-pruebas-unitarias.md) exige un mínimo del 80%. Se agregó `@vitest/coverage-v8`, el script `test:coverage` y los thresholds en `vitest.config.ts` (más `coverage/**` a los ignores de ESLint) para que el check de coverage deje de ser `SKIPPED` en este y en los próximos changes.

### Detalle de checks fallidos

Sin checks fallidos.

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** implementar US-30273 (AC-001 a AC-005): creación de Proyecto (Nombre obligatorio, Descripción opcional), persistencia en `localStorage`, listado en tarjetas con estado vacío, acción visible "Nuevo Proyecto", y cálculo del tiempo total registrado por Proyecto como suma de los tiempos de sus Tareas — sin acoplar el store de Proyectos al de Tareas/Registros (design.md).

### Análisis semántico

✅ conforme. Los cinco AC quedan cubiertos exactamente, sin lógica de más: validación de Nombre vacío en el store (defensa en profundidad) y en el campo del formulario, Descripción realmente opcional (`trim() || undefined`), selector de tiempo total que maneja los casos "sin Tareas" y "sin Registros" devolviendo 0 sin errores.

- 💡 `task-time-tracking` se creó con el store de datos (`Task`, `TimeEntry`, `useTaskTimeTrackingStore`) pero sin ninguna acción todavía (ni `createTask`, ni temporizador) — **Por qué:** es intencional y está acotado por el propio `design.md` de `gestion-de-proyectos` (el selector 3.3 exige combinar ambos stores) y por el `design.md`/`tasks.md` de `gestion-de-tareas` (mismo tipo `TimeEntry`, misma clave `time-tracker:tasks`), así que no es trabajo fuera de alcance sino la base compartida entre ambos changes. **Impacto:** ninguno negativo; el siguiente change extiende este mismo store en vez de crear uno nuevo. **Sugerencia:** ninguna acción requerida; se deja como nota para quien revise el siguiente change y note que 1.1/1.2 de `gestion-de-tareas` ya vienen resueltos.

### Arquitectura y diseño

- 🟠→**corregido** [ISO-25010: Fiabilidad] Hydration mismatch por rehidratación síncrona de `zustand/persist` en SSR — **Qué:** `useProjectStore` y `useTaskTimeTrackingStore` usaban `persist(...)` sin `skipHydration`. El middleware rehidrata **de forma síncrona** desde `localStorage` en cuanto el módulo del store se evalúa en el cliente (antes de que React hidrate), mientras que el HTML prerenderizado en build/SSR se generó con el estado inicial vacío (`window`/`localStorage` no existen en Node, así que `createJSONStorage` devuelve `undefined` y el store SSR nunca hidrata). Resultado: en cuanto existe al menos un Proyecto persistido, el primer render del cliente ya refleja los datos reales mientras el HTML del servidor muestra el estado vacío → mismatch de hidratación de React en cada carga de página. **Por qué:** rompe exactamente el escenario que ADR-011/TC-004 quieren garantizar ("disponible tras recargar la aplicación"): el dato sigue estando disponible, pero React reporta un error de hidratación en consola y puede re-renderizar el árbol completo del cliente, degradando la fiabilidad percibida en producción. **Impacto:** toda página que renderice un store persistido junto con contenido derivado de él (hoy `ProjectsPage`; mañana también las pantallas de Tareas e Historial). **Corrección aplicada:** `skipHydration: true` en ambos stores + hook compartido `useHydratePersistedStore` (`src/shared/lib/use-hydrate-persisted-store.ts`) que llama a `store.persist.rehydrate()` en un `useEffect` (solo cliente, después de la hidratación), usado en `ProjectsPage`. **Verificación:** se corrió `next build && next start` y un smoke test con Playwright (crear Proyecto → recargar) sin ningún mensaje de consola ni `pageerror`, y el Proyecto persistido siguió visible tras la recarga. Suite completa (tipado, lint, tests+coverage, build) vuelta a ejecutar en verde tras el cambio.
- ✅ conforme en el resto de la dimensión: el store de Proyectos permanece independiente del de Tareas/Registros (el acoplamiento vive únicamente en el hook selector `use-project-total-time.ts`, tal como exige el `design.md`); estructura feature-based respetada (`src/features/project-management`, `src/features/task-time-tracking`, `src/shared/lib`); sin duplicación relevante (formateo de duración extraído a `shared/lib/format-duration.ts` para ser reutilizado por Historial); TSDoc presente en la lógica no trivial (stores, selector, hook de hidratación) y omitido correctamente en la trivial (tipos, componentes de presentación), conforme ADR-006.

### Feedback adicional

Buen uso de Base UI (`Dialog` + `Field` + `Form`) delegando la validación nativa del campo Nombre en `Field.validate`, lo que evita que `handleFormSubmit` se dispare con datos inválidos y mantiene el `throw` del store como defensa en profundidad para quien llame al store directamente (cubierto por test). El manejo del caso "solo Nombre, sin Descripción" (TC-002) y el estado vacío (TC-006) quedaron cubiertos tanto a nivel de store como de componente, coincidiendo con el aumento de branch coverage detectado en la etapa automatizada.

## Próximas acciones

Sin acciones pendientes.

## Justificaciones aceptadas

Ninguna.
