# Code Review — US-002-tareas (reconciliación de layout con Figma)

**Fecha**: 2026-07-14 18:30
**Repositorio**: exercise-time-tracker
**Rama**: loop/test-3 · **Commit**: 073e536 (base) + working tree sin commitear
**Working tree**: sucio (todos los cambios del rediseño de layout en working tree, listos para commit)
**Modo**: default
**Historia**: US-002-tareas (docs/specs/user-stories/US-002-tareas/README.md)
**Veredicto**: ✅ Apto

## Resumen

Se revisó el rediseño del LAYOUT/PRESENTACIÓN de la pantalla `/tareas` para reconciliarla con el frame Figma "Tareas" (AC-005/AC-016, previamente `Parcial` en el trace-report por falta de acceso a Figma), preservando la lógica de negocio y el store ya probados. El cambio introduce `TopAppBar` (compartido), `ResumenTareas` (título + % de meta + tarjetas de stat semanal/mensual), `SesionActivaCard`, rediseña `RegistroManualForm` (selector combinado Proyecto/Tarea, Duración en `HH:MM`) y `TareaListItem`/`TareasRecientesCard` (fila con ícono, duración acumulada en vivo y recencia), sin tocar Proyectos ni Historial. Todas las verificaciones automatizadas pasan; se detectó y corrigió en el propio ciclo de review una duplicación menor (fórmula de segundos transcurridos) extrayéndola a `calcularSegundosTranscurridos`.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                                                         | Categoría   | Estado | Detalle                                                                                                                                                                                                  | Duración |
| --- | ---------- | --------------------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | tipado     | `npx tsc --noEmit -p tsconfig.json`                             | Bloqueante  | ✅     | 0 errores                                                                                                                                                                                                | ~2s      |
| 2   | linter     | `npx eslint .`                                                  | Bloqueante  | ✅     | 0 errors, 0 warnings                                                                                                                                                                                     | ~2s      |
| 3   | unit tests | `npx vitest run`                                                | Bloqueante  | ✅     | 216 passed, 0 failed (43 archivos)                                                                                                                                                                       | 3.8s     |
| 4   | coverage   | `npx vitest run --coverage`                                     | Bloqueante  | ✅     | 96.26% stmts / 91.2% branch / 97.77% funcs / 96.03% lines (ADR-007 exige ≥80%, se cumple ampliamente; `src/features/tareas/components` en 96.87% stmts)                                                  | 4.7s     |
| 5   | build      | `npx next build`                                                | Bloqueante  | ✅     | Compiló y generó `/`, `/_not-found`, `/proyectos`, `/historial`, `/tareas`                                                                                                                               | ~2s      |
| 6   | e2e        | `npx playwright test` (suite completa, puerto 4321 por defecto) | Condicional | ✅     | 18 passed, 0 failed (smoke, app-shell-navegacion ×4, gestion-proyectos ×4, historial ×3, historial-design-tokens, historial-rendimiento ×2, tareas-regresion-visual ×2, tareas-temporizador-performance) | 9.4s     |
| 7   | sonar      | —                                                               | Informativo | —      | N/A (no existe `sonar-project.properties` ni `sonar-scanner` en PATH)                                                                                                                                    | —        |

### Detalle de checks fallidos

Sin checks fallidos. El snapshot visual `pantalla-tareas-chromium-darwin.png` se regeneró deliberadamente (`--update-snapshots`) tras confirmar visualmente el nuevo layout, según lo esperado por el propio alcance de la tarea (romper y renovar el guardrail visual); el modal "Nueva Tarea" no cambió y su snapshot pasó sin regenerar.

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** reconciliar el layout/presentación de `/tareas` con el frame Figma "Tareas" (fidelidad visual, AC-005/AC-016), preservando íntegramente la lógica de negocio y el store ya probados (temporizador, registro manual, meta semanal) sin tocar Proyectos/Historial.

### Análisis semántico

✅ conforme. El diff cubre los 6 puntos pedidos (TopAppBar separado, tarjetas de stat semanal/mensual con el % movido al subtítulo, tarjeta Sesión Activa con estado vacío, Entrada Manual en formato Figma, Tareas Recientes con ícono/duración/recencia, modal sin cambios de layout) sin tocar `src/features/proyectos` ni `src/features/historial` (confirmado por `git status`). Toda la lógica de negocio probada (`acciones-temporizador.ts`, `acciones-registro-manual.ts`, `acciones-tareas.ts`, `calcular-total-semanal.ts`, `calcular-porcentaje-meta.ts`, `validar-duracion.ts`, `validar-tarea-form.ts`) permanece sin cambios; el formato `HH:MM` del formulario manual se resuelve con un parser nuevo (`parsearDuracionHHMM`) que convierte a minutos _antes_ de llegar a `crearRegistroManual`/`validarDuracion`, sin alterar su contrato.

### Arquitectura y diseño

- 🟡 (ya corregido) **Duplicación de la fórmula de segundos transcurridos.** `TareaListItem.tsx` y `SesionActivaCard.tsx` repetían `Math.max(0, Math.floor((ahora - new Date(x).getTime()) / 1000))`. **Por qué:** aunque el _tick_ en sí ya estaba unificado en `useAhoraEnVivo` (tal como pedía el enunciado: "reutiliza el patrón... revisa si `TareaListItem` ya tiene un intervalo/tick"), la aritmética que consume ese tick quedaba copiada en dos sitios, con riesgo de divergencia futura si uno de los dos cambia el redondeo. **Impacto:** local a la feature Tareas, bajo riesgo pero exactamente el tipo de duplicación que el propio enunciado pedía evitar. **Corrección aplicada:** extraída a `src/features/tareas/lib/calcular-segundos-transcurridos.ts` (con test propio) y consumida por ambos componentes. Verificado con `npx vitest run` (216 passed) y `npx playwright test` (18 passed) tras el cambio.
- ✅ conforme en el resto: `TopAppBar` se ubicó en `src/shared/ui/` siguiendo el patrón de `Sidebar`, sin acoplarse a Tareas. `TareaListItem` se **adaptó** (no se reescribió desde cero) preservando sus `aria-label`s exactos (`Iniciar/Detener temporizador de {nombre}`, `Editar {nombre}`) y el texto `"En Ejecución"`, que son el contrato consumido por `e2e/tareas-temporizador-performance.spec.ts` y por `PanelTareas.test.tsx` — ningún selector de esas pruebas necesitó reescribirse por una ruptura de contrato, solo por el nuevo formato de duración/labels del formulario. `RegistroManualForm` sigue delegando en `crearRegistroManual`/`validarDuracion` sin duplicarlos. `calcularTotalMensual` reutiliza `obtenerMesCalendario` (`@/shared/date`), el mismo cálculo de mes calendario que ya usa Historial, en vez de reimplementarlo — y no importa nada de `src/features/historial` (ADR-005: aislamiento entre features), aceptando una pequeña duplicación deliberada de un formateador de duración específico de Tareas (`formatear-tiempo.ts`) en vez de acoplarse a `historial/utils/formatearDuracion.ts`.

### Feedback adicional

- Buen trabajo separando cada bento card en su propio componente (`SesionActivaCard`, `TareasRecientesCard`, `ResumenTareas`) en vez de dejar todo inline en `PanelTareas`: cada uno quedó testeable de forma aislada (`SesionActivaCard.test.tsx`, `TareasRecientesCard.test.tsx`, `ResumenTareas.test.tsx`) y `PanelTareas.tsx` quedó como puro orquestador de datos del store.
- 🟡 El botón "Editar" en `TareaListItem` no aparece en el frame Figma de referencia (Figma no cubre esa acción). Es una decisión de buen criterio documentada en el propio TSDoc del componente para no perder AC-004, pero vale la pena que quien haga la validación visual con el equipo de diseño confirme que ese pequeño desvío es aceptable a largo plazo.
- 💡 `calcularDuracionAcumuladaMinutos`/`obtenerUltimaActividad` recorren `registrosDeTiempo` completo por cada Tarea dentro de un `.map` (`O(tareas × registros)`). Para los volúmenes actuales de la app (demo, sin backend) es irrelevante; si el dataset creciera mucho valdría la pena indexar los registros por `tareaId` una sola vez con un `Map`, como ya hace `useHistorialRegistros` en Historial.

## Próximas acciones

Sin acciones pendientes.

## Justificaciones aceptadas

Ninguna.
