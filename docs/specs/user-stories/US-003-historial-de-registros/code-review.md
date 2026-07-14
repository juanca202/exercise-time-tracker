# Code Review — US-003-historial-de-registros · exercise-time-tracker

**Fecha**: 2026-07-13 23:50
**Repositorio**: exercise-time-tracker (worktree `wf_f50d6d04-9a0-4`)
**Rama**: worktree-wf_f50d6d04-9a0-4 (creada desde `loop/test-3`) · **Commit**: 9bbab1f (working tree con cambios sin commitear)
**Working tree**: sucio (46 archivos: el módulo `historial-de-registros` completo más el andamiaje compartido de `fundamentos-infraestructura-compartida` — store raíz, tipos de dominio, testing helpers — que aún no tiene commit propio en este worktree)
**Modo**: default
**Historia**: US-003-historial-de-registros (`docs/specs/user-stories/US-003-historial-de-registros/`)
**Veredicto**: ✅ Apto

## Resumen

Re-ejecución independiente de la etapa automatizada y de la revisión cualitativa sobre el change OpenSpec `historial-de-registros` (pantalla de solo lectura del historial de Registros de Tiempo + totales por Tarea/Proyecto/mes). Los siete checks aplicables pasan sin FAIL ni SKIPPED. La revisión cualitativa no encontró hallazgos bloqueantes: el diseño respeta la arquitectura feature-based (ADR-005), reutiliza sin duplicar la regla de negocio de totales, y el manejo de datos corruptos/huérfanos está resuelto en las capas correctas con tests dedicados.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                 | Categoría   | Estado | Detalle                                                                                                            | Duración |
| --- | ---------- | ----------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | tipado     | `tsc --noEmit`          | Bloqueante  | ✅     | 0 errores                                                                                                          | ~4s      |
| 2   | linter     | `eslint .`              | Bloqueante  | ✅     | 0 errors, 1 warning preexistente/ajeno al diff (`coverage/block-navigation.js`, artefacto generado, no versionado) | ~3s      |
| 3   | unit tests | `vitest run`            | Bloqueante  | ✅     | 36 passed, 0 failed (10 archivos)                                                                                  | ~3s      |
| 4   | coverage   | `vitest run --coverage` | Bloqueante  | ✅     | 82.58% stmts / 86.74% branch / 86.36% funcs / 82.09% lines (sin umbral configurado, exit 0)                        | ~3s      |
| 5   | build      | `next build`            | Bloqueante  | ✅     | OK — rutas `/`, `/_not-found`, `/historial` prerenderizadas                                                        | ~3s      |
| 6   | e2e        | `playwright test`       | Condicional | ✅     | 7 passed, 0 failed                                                                                                 | ~9s      |
| 7   | sonar      | `sonar-scanner`         | Informativo | —      | N/A (no existe `sonar-project.properties`)                                                                         | —        |

### Detalle de checks fallidos

Sin checks fallidos.

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** implementar la pantalla "Historial de registros" (US-003 / change OpenSpec `historial-de-registros`): listado de solo lectura de todos los Registros de Tiempo persistidos, y los totales de tiempo acumulado por Tarea (AC-002), por Proyecto (AC-003) y por mes con la regla de atribución al mes de inicio (AC-004, RS-001), con manejo defensivo de datos corruptos/huérfanos (AC-001), presupuesto de rendimiento <2s hasta 1000 registros (AC-005) y adherencia visual a DESIGN.md/Figma (AC-006/AC-007).

### Análisis semántico

✅ conforme. Los siete requisitos de `specs/historial-de-registros/spec.md` están cubiertos por implementación + tests: historial completo con manejo de datos corruptos y estado vacío (AC-001), total por Tarea con normalización de duraciones inválidas (AC-002), total por Proyecto excluyendo Tareas huérfanas y reutilizando el mismo cálculo (AC-003), total por mes reutilizando `obtenerClaveMes` compartido con el caso de cruce de medianoche verificado explícitamente (AC-004/RS-001), rendimiento <2000 ms medido por E2E con 500 y 1000 registros sintéticos (AC-005), y adherencia a tokens de DESIGN.md auditada por E2E (AC-006). La fidelidad pixel-perfect a Figma (AC-007) no se pudo verificar programáticamente porque el MCP de Figma configurado en este entorno no tiene acceso de lectura al archivo referenciado en US-003; queda documentado en `tasks.md` y en el reporte de trazabilidad como pendiente de revisión manual — correctamente señalado, no oculto ni bloqueante (criterio puramente visual, prioridad Baja en su TC).

No hay desajuste entre lo declarado (proposal.md/design.md) y lo implementado; el alcance se mantuvo dentro de lo definido ("fuera de alcance": crear/editar/eliminar Registros, redefinir el store raíz o el helper de mes).

### Arquitectura y diseño

✅ conforme. Arquitectura feature-based respetada (ADR-005): `src/features/historial/` solo consume el store/tipos compartidos de `src/shared/`, sin redefinir estado transversal. Los tres selectores de agregación (`calcularTotalPorTarea`, `calcularTotalPorProyecto`, `calcularTotalPorMes`) son funciones puras que se memoizan con `useMemo` sobre la identidad de los arreglos del store en `useHistorialRegistros` (AC-005); `calcularTotalPorProyecto` compone `calcularTotalPorTarea` en vez de reimplementar la agregación, evitando duplicar la regla de negocio. `TablaHistorial` documenta explícitamente su precondición (`filas` no vacío) y deja a `HistorialScreen` como única fuente de verdad para el estado vacío/error/carga, evitando dos lugares decidiendo la misma condición. `useHasHydrated` usa `useSyncExternalStore` (no `useEffect`+`setState`) para sincronizar con la hidratación de `localStorage`/Zustand `persist`, el patrón idiomático para una fuente de verdad externa a React, y evita hydration-mismatch en el App Router. El uso de `<table>` semántico plano en `TablaHistorial` en lugar de un primitivo de Base UI está justificado y documentado en el propio archivo (Base UI no ofrece componente de tabla y el listado no tiene ordenamiento/selección interactivos — ADR-003 cubre componentes interactivos), mientras que `Progress`/`Separator` de Base UI sí se usan donde corresponde (estado de carga, divisores). El manejo de datos inválidos está en las capas correctas: el store degrada JSON corrupto a estado vacío (`onRehydrateStorage`), y la feature filtra puntualmente Registros con forma inválida (`esRegistroValido`) sin abortar el resto del render.

### Feedback adicional

- Bien hecho: los tests de rendimiento (`e2e/historial-rendimiento.spec.ts`) incluyen una navegación de precalentamiento documentada explícitamente para no medir el costo fijo de arrancar el navegador/compilar el bundle raíz, evitando falsos negativos por ruido del entorno sin inflar el umbral real de la AC.
- Bien hecho: `calcularTotalPorMes` cumple la regla de cruce de medianoche (RS-001) como consecuencia directa de agrupar siempre por `horaInicio`, sin un branch especial — reduce superficie de bugs frente a una implementación que tratara el cruce como caso aparte.
- 💡 Sugerencia (no bloqueante, ya señalada en la iteración anterior de este review): fijar umbrales de `coverage` en `vitest.config.ts` (p. ej. 80% líneas) ahora que la herramienta ya está instalada, para que una caída de cobertura futura falle el gate en vez de solo informar.
- 💡 Sugerencia (no bloqueante): `TC-016` (fidelidad visual a Figma) queda como acción manual pendiente por falta de acceso al archivo Figma desde este entorno; vale la pena que alguien con acceso lo ejecute antes de dar la pantalla por definitivamente cerrada a nivel visual.

## Próximas acciones

Sin acciones bloqueantes pendientes.

1. (Opcional, no bloqueante) Fijar umbrales de cobertura en `vitest.config.ts`.
2. (Opcional, no bloqueante) Ejecutar TC-016 (comparación visual contra el prototipo Figma de US-003) manualmente con una cuenta que tenga acceso de lectura al archivo `YYHDIH7CBsZrZ4VKXvbzkR`.

## Justificaciones aceptadas

Ninguna.
