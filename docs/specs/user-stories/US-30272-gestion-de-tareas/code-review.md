# Code Review — US-30272-gestion-de-tareas

Fecha: 2026-07-09 20:04
Repositorio: exercise-time-tracker
Rama: feature/open-spec · Commit: 58583b2
Working tree: sucio (1 archivo sin trackear, ajeno a esta historia: `US-30273-gestion-de-proyectos/trace-report.md`)
Modo: default
Historia: US-30272-gestion-de-tareas
Veredicto: ✅ Apto

## Resumen

Se revisó el diff de esta historia desde la última revisión conjunta (commit `c2f49d9`, ✅ Apto, sin hallazgos pendientes): las unidades TK-30303 (persistencia real tras recarga, AC-002/AC-010) y TK-30304 (harness de rendimiento del temporizador, AC-012/AC-013). Ambas son puramente de pruebas — no tocan código de producción — y cierran las brechas de cobertura que `trace-report.md` había marcado como parciales. Las siete verificaciones automatizadas (compartidas por todo el repo Next.js) quedan en verde.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                             | Categoría   | Estado | Detalle                                                                    | Duración |
| --- | ---------- | ----------------------------------- | ----------- | ------ | -------------------------------------------------------------------------- | -------- |
| 1   | tipado     | `tsc --noEmit`                      | Bloqueante  | ✅     | 0 errores                                                                  | ~1.3s    |
| 2   | linter     | `npm run lint` (eslint)             | Bloqueante  | ✅     | 0 errors, 1 warning (en `coverage/`, gitignorado, no forma parte del diff) | ~1.8s    |
| 3   | unit tests | `npm run test:coverage` (vitest)    | Bloqueante  | ✅     | 110 passed, 0 failed (31 archivos)                                         | 4.1s     |
| 4   | coverage   | `npm run test:coverage` (v8)        | Bloqueante  | ✅     | 99.47% stmts / 93.65% branch / 98.66% funcs / 99.42% lines (umbral 80%)    | incl.    |
| 5   | build      | `npm run build` (Next.js/Turbopack) | Bloqueante  | ✅     | Compiló y prerenderizó 5 rutas sin errores                                 | ~5.3s    |
| 6   | e2e        | `npx playwright test`               | Condicional | ✅     | 12 passed, 0 failed                                                        | 4.3s     |
| 7   | sonar      | —                                   | Informativo | —      | N/A (sin `sonar-project.properties`)                                       | —        |

### Detalle de checks fallidos

Sin checks fallidos.

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** cerrar dos brechas de cobertura identificadas en `trace-report.md` sin alterar comportamiento: (1) TK-30303 demuestra con una recarga real (reimport de módulo en el test unitario + `page.reload()` en e2e) que Tareas y Registros de Tiempo manuales sobreviven a un refresh, verificando AC-002/AC-010; (2) TK-30304 mide con Playwright, sobre la mediana de 3 muestras, que iniciar/detener el temporizador se refleja en la UI dentro del umbral de AC-012/AC-013.

### Análisis semántico

✅ conforme. Ambas unidades están acotadas exactamente a los AC que declaran cubrir, no agregan lógica de producto y las notas en `progress.md` documentan explícitamente que la brecha era de pruebas, no de implementación — evita el antipatrón de "arreglar" código que ya funcionaba.

### Arquitectura y diseño

Sin hallazgos bloqueantes. Una observación no bloqueante:

- [ISO-25010: Adecuación funcional] 💡 El guard de rendimiento admite hasta 1.25s, no el 1s literal del AC — `e2e/tasks-performance.spec.ts:8-10,42-44,69-71`. **Por qué:** `THRESHOLD_MS + TOLERANCE_MS` (1000 + 250) es el valor realmente verificado; si la latencia real se degradara a, por ejemplo, 1.1s, el test seguiría en verde aunque AC-012/AC-013 ya no se cumplirían en sentido estricto. **Impacto:** bajo — es una decisión consciente y documentada en `progress.md` para absorber variabilidad de CI, no un descuido. **Sugerencia concreta:** dejar explícito en el nombre del test o en un comentario adicional que el umbral verificado es "≤ 1s + margen de tolerancia de CI", para que quien lea el reporte de CI no interprete el PASS como cumplimiento estricto del AC.

### Feedback adicional

Buen trabajo en ambas unidades: la elección de `vi.resetModules()` + reimport (en vez de `setState`) para simular una recarga real sin el efecto colateral de que el wrapper de `persist` reescriba `localStorage` está bien razonada y documentada in situ. El uso de la mediana de 3 muestras con `performance.now()` del navegador (no del proceso Node) mide la latencia percibida real y reduce falsos negativos por ruido puntual. El e2e de persistencia (`page.reload()` real) complementa bien al test unitario de store, cubriendo la ruta completa en vez de solo la capa de estado.

## Próximas acciones

Sin acciones pendientes bloqueantes.

1. (No bloqueante) Aclarar en `tasks-performance.spec.ts` que el umbral verificado incluye el margen de tolerancia de 250ms.

## Justificaciones aceptadas

Ninguna.
