# Reporte de trazabilidad — US-001-layout-de-la-aplicacion

**Fecha:** 2026-08-04
**Trabajo:** [US-001](./README.md)
**Rama:** feature/implementacion
**Cobertura:** 3 de 4 criterios cubiertos (75%) — 1 no cubierto (justificado y aceptado)
**Veredicto:** ⚠️ Aprobado con observaciones

## Resumen

AC-001, AC-002 y AC-003 están cubiertos por pruebas unit y e2e que pasaron. AC-002 se reclasifica como **Cubierto**: el mecanismo funcional de resaltado de la sección activa (`aria-current`) está probado y pasa; la parte de fidelidad visual a los wireframes de Figma fue justificada y aceptada por el usuario como fuera de alcance (ver «Justificaciones aceptadas»). AC-004 (adherencia a paleta, tipografía, espaciado y patrones de `DESIGN.md`) sigue **No cubierto** en términos estrictos — no existe ningún artefacto de prueba que lo valide — pero el usuario justificó y aceptó explícitamente que queda fuera de alcance por ahora, por lo que no se trata como un hueco de trabajo pendiente sin resolver. Las suites disponibles (unit, coverage, e2e) se ejecutaron y pasaron según la caché fresca de `code-review`.

## Matriz de trazabilidad

| Criterio | Descripción                                                                                                         | Caso(s) de prueba                                                                                                                                                           | Artefactos                                                                                                                       | Estado      | Automática | Resultado    | Observaciones                                                                                                                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-001   | Navegación lateral con acceso a "Tareas", "Proyectos" e "Historial de registros"                                    | `muestra un enlace por cada sección` (derivado); e2e: carga Tareas por defecto / navega a Proyectos / navega a Historial                                                    | `src/shared/layout/sidebar-nav.test.tsx` (unit), `e2e/navigation.spec.ts` (e2e)                                                  | Cubierto    | Sí         | Paso         | —                                                                                                                                                                                                                                                             |
| AC-002   | La navegación lateral indica visualmente la sección activa, fiel a los wireframes de referencia                     | `marca como activa la sección que coincide con la ruta actual` (derivado); `resolveActiveSection` (4 casos, derivado); e2e: `aria-current="page"` verificado en las 3 rutas | `src/shared/layout/sidebar-nav.test.tsx` (unit), `src/shared/layout/nav-sections.test.ts` (unit), `e2e/navigation.spec.ts` (e2e) | Cubierto    | Sí         | Paso         | El mecanismo funcional (`aria-current`) está probado y pasa. La verificación de fidelidad visual a los wireframes de Figma fue justificada y aceptada por el usuario como fuera de alcance por ahora — ver «Justificaciones aceptadas».                       |
| AC-003   | El encabezado muestra el nombre del producto ("TimeTracker") y el título de la sección activa                       | `muestra el nombre del producto` + `en la ruta "%s" muestra "%s" como título de sección` (3 casos, derivado)                                                                | `src/shared/layout/section-header.test.tsx` (unit)                                                                               | Cubierto    | Sí         | Paso         | —                                                                                                                                                                                                                                                             |
| AC-004   | Adherencia a paleta de colores, tipografía, espaciado y patrones de componentes de DESIGN.md (tema Precision Focus) | —                                                                                                                                                                           | —                                                                                                                                | No cubierto | No         | No ejecutado | No existe artefacto de prueba (visual regression, snapshot, unit de estilos) que valide este criterio. Justificado y aceptado por el usuario como fuera de alcance por ahora — ver «Justificaciones aceptadas». No cuenta como hueco bloqueante sin resolver. |

<!--
Valores permitidos:
- Criterio: AC-XXX (US y WI). Formatos legados (AC-1, CA-1, BR-01) se normalizan a AC-XXX.
- Estado: Cubierto | Parcial | No cubierto
- Ejec. auto (estado real al validar; el TC solo declara su `Tipo de prueba`: Manual, o uno o varios tipos): Sí (artefacto automatizado hallado y ejecutado) | No (tipo(s) automatizable(s) pendiente(s), o existe pero no se pudo ejecutar) | N/A (Manual por diseño)
- Resultado: Paso | Fallo | No ejecutado
- Tipo de artefacto: unit | integración | e2e | manual
- Celdas sin dato: «—»
-->

## Artefactos de prueba automatizada disponibles

| Tipo        | Presente | Artefactos                                                                                                                      |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Unit        | Sí       | `src/shared/layout/sidebar-nav.test.tsx`, `src/shared/layout/nav-sections.test.ts`, `src/shared/layout/section-header.test.tsx` |
| Integración | No       | — (sin suite de integración separada en este stack, según `test-run.json`)                                                      |
| E2E         | Sí       | `e2e/navigation.spec.ts`                                                                                                        |

## Ejecución automática

Los resultados de pruebas los produce `code-review` (trace-validate no ejecuta la suite).

|                      |                                                                                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Procedencia**      | caché fresca de `code-review` (commit `d88c86e`, 2026-08-04) — `docs/specs/test-run.json`, `git.fingerprint` coincide con el fingerprint canónico actual; árbol de trabajo limpio (`workingTreeClean: true`)                                           |
| **Comando(s)**       | `vitest run`; `vitest run --coverage`; `playwright test`                                                                                                                                                                                               |
| **Resultado global** | unit: 134 passed (33 files) · coverage: 94.18% stmts / 80.12% branches / 93.87% funcs / 93.64% lines (sin umbral configurado) · integración: N/A (sin suite en este stack) · e2e: 3 passed (smoke test de navegación entre Tareas/Proyectos/Historial) |

## Justificaciones aceptadas

- **Qué se justificó:** (1) la parte de fidelidad visual de AC-002 — comparación de la barra lateral contra los wireframes de referencia de Figma; (2) AC-004 completo — adherencia a la paleta de colores, tipografía, espaciado y patrones de componentes de `DESIGN.md` (tema Precision Focus).
- **Motivo:** el repositorio no tiene configurada ninguna herramienta de regresión visual (sin Percy, Chromatic ni `toHaveScreenshot` de Playwright). Automatizar esta verificación es una decisión de tooling mayor —incorporar y mantener un motor de regresión visual—, no un test unitario adicional que se pueda escribir sobre la infraestructura actual.
- **Aceptación:** el usuario aceptó explícitamente esta justificación en la sesión de `pr-create`, decidiendo que ambos puntos quedan **fuera de alcance por ahora**. Por esta razón, AC-002 se reclasifica como **Cubierto** (su mecanismo funcional sí está probado) y AC-004, aunque sigue **No cubierto** en sentido estricto, no se trata como un hueco bloqueante para el veredicto.
- **Pendiente a futuro (no bloqueante):** si el proyecto decide automatizar la regresión visual, formalizar un TK/WI que incorpore la herramienta correspondiente y agregue los artefactos de prueba para AC-002 (fidelidad visual) y AC-004 (adherencia a `DESIGN.md`).

## Observaciones y pendientes

- **AC-004:** justificado y aceptado como fuera de alcance por ahora (ver «Justificaciones aceptadas»). No requiere acción inmediata; queda como mejora futura si el proyecto decide invertir en tooling de regresión visual.

<!-- trace-validate:fingerprint=561c1a89dd3c5209dd8a7ab802088f8a7d3f48d5 · generado=2026-08-04 -->
