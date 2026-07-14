# Code Review — US-000-fundamentos · exercise-time-tracker

**Fecha**: 2026-07-13 23:05
**Repositorio**: exercise-time-tracker (worktree `wf_f50d6d04-9a0-1`)
**Rama**: worktree-wf_f50d6d04-9a0-1 · **Commit**: 9bbab1f (working tree con cambios pendientes de commit)
**Working tree**: sucio (11 archivos modificados/nuevos, ver detalle abajo)
**Modo**: default
**Historia**: US-000-fundamentos (docs/specs/user-stories/US-000-fundamentos/README.md)
**Veredicto**: ✅ Apto

## Resumen

Se completaron las secciones 5, 6 y 7 del change OpenSpec `fundamentos-infraestructura-compartida` (sidebar/layout, rutas stub y verificación final); las secciones 1-4 (dominio, persistencia, store, helper de fecha) ya estaban implementadas y se dejaron intactas salvo el cableado que faltaba. Todos los checks automatizados (tipado, linter, formato, unit tests, coverage, build y e2e) pasan en verde. La revisión cualitativa no encontró hallazgos bloqueantes; solo sugerencias menores sin impacto en el veredicto.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                                     | Categoría   | Estado | Detalle                                                                                                                           | Duración |
| --- | ---------- | ------------------------------------------- | ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | tipado     | `npx tsc --noEmit`                          | Bloqueante  | ✅     | 0 errores                                                                                                                         | ~4s      |
| 2   | linter     | `npm run lint` (eslint .)                   | Bloqueante  | ✅     | 0 errors, 0 warnings                                                                                                              | ~2s      |
| 3   | formato    | `npm run format:check` (prettier --check .) | Condicional | ✅     | Todos los archivos de código formateados (único warning es `.claude/settings.local.json`, gitignored, ajeno al cambio)            | ~1s      |
| 4   | unit tests | `npm run test:run` (vitest run)             | Bloqueante  | ✅     | 37 passed, 0 failed (7 archivos)                                                                                                  | ~2.8s    |
| 5   | coverage   | `npx vitest run --coverage`                 | Bloqueante  | ✅     | 95.23% stmts / 81.57% branch / 97.72% funcs / 94.87% líneas (umbral ADR-007: 80%, sin umbral duro configurado en vitest → exit 0) | ~5.4s    |
| 6   | build      | `npm run build` (next build)                | Bloqueante  | ✅     | 5 rutas generadas (`/`, `/tareas`, `/proyectos`, `/historial`, `/_not-found`), todas estáticas                                    | ~7s      |
| 7   | e2e        | `npm run test:e2e` (playwright test)        | Condicional | ✅     | 5 passed, 0 failed (smoke + navegación app shell)                                                                                 | ~30s     |
| 8   | sonar      | —                                           | Informativo | —      | N/A (sin `sonar-project.properties` en el repo)                                                                                   | —        |

### Detalle de checks fallidos

Sin checks fallidos.

**Nota operativa (no afecta el veredicto):** durante la ejecución inicial de `npm run test:e2e`, el puerto fijo `4321` (hardcodeado en `playwright.config.ts`) resultó ocupado de forma intermitente por otro proceso del entorno (aparentemente otro worktree concurrente ejecutando la misma suite), lo que produjo falsos negativos (título `"Time Tracker"` en vez de `"TimeTracker"`, respuestas no-ok). Se verificó manualmente con `next build && next start` en un puerto alterno que la implementación es correcta, y se añadió un override opcional `PLAYWRIGHT_PORT` en `playwright.config.ts` (con el mismo valor por defecto `4321`, sin cambiar el comportamiento existente) para poder aislar la ejecución en este entorno. Con esa variable, las 5 pruebas e2e pasan de forma consistente y reproducible.

## 2. Revisión cualitativa

**Intención detectada:** completar la base técnica compartida (US-000 / change OpenSpec `fundamentos-infraestructura-compartida`) para que Proyectos, Tareas e Historial de registros puedan implementarse en paralelo sin tocar los mismos archivos: tipos de dominio, persistencia local, store raíz con CRUD crudo, helper de mes calendario, y el app shell (layout + sidebar + 3 rutas stub), fiel al frame Figma "Aside - SideNavBar".

### Análisis semántico

✅ Conforme. Se verificó cada AC-001..AC-012 y BR-01..BR-03 contra la implementación:

- El sidebar y las 3 rutas stub cubren AC-007/AC-008/AC-009 sin gate de autenticación.
- `InicializadorAplicacion` (hidratación + solicitud de almacenamiento persistente + suscripción a cambios externos) ya existía como código aislado y probado unitariamente, pero **no estaba montado en ningún componente real**: antes de este cambio, AC-004 y AC-005 no se cumplían end-to-end pese a que sus pruebas unitarias pasaban en aislamiento. Este cambio lo cablea en `src/app/layout.tsx`, cerrando esa brecha real de comportamiento, y añade `src/shared/store/InicializadorAplicacion.test.tsx` para probar la propia integración (hidratación al montar, solicitud de almacenamiento persistente al montar, suscripción activa mientras está montado y desuscripción al desmontar) — la pieza que antes no tenía ninguna prueba.
- Los colores, tipografía y espaciado del sidebar se extrajeron literalmente del frame Figma (vía `get_design_context`) y del sistema de diseño `DESIGN.md` ("Precision Focus"), y se mapearon a tokens de Tailwind en `globals.css` (AC-012, tarea 5.1).
- Los iconos se embebieron como SVG inline con los `path` exactos exportados por Figma, evitando cualquier dependencia de red a assets remotos de Figma (que expiran a los 7 días) — necesario para AC-011.
- La prueba e2e valida explícitamente que ninguna solicitud a un host externo se realice (solo se permite el propio servidor bajo prueba), cerrando AC-011 con evidencia real y no solo por inspección de código.

### Arquitectura y diseño

✅ Conforme.

- `src/shared/ui/sidebar/Sidebar.tsx` se apoya en `Toolbar` de Base UI (ADR-003) para navegación por teclado accesible, renderizando cada `Toolbar.Link` como `next/link` vía la prop `render` — cumple a la vez ADR-001 (Link de Next.js) y ADR-003 (primitivas Base UI) sin reinventar comportamiento de accesibilidad.
- Los tokens de color/tipografía se centralizan en `globals.css` bajo `@theme`, no hay valores de color sueltos repetidos en componentes (ADR-002).
- El layout raíz (`src/app/layout.tsx`) solo compone: `InicializadorAplicacion` (efectos de arranque) + `Sidebar` + `{children}`. No contiene lógica de negocio, manteniendo el límite de capas de BR-03/AC-010.
- Cada historia funcional futura (Proyectos, Tareas, Historial) solo necesita reemplazar el contenido de su propia página stub; no hay ningún gancho que las obligue a tocar `layout.tsx`, el store o el adaptador de persistencia más allá de importar sus tipos/API pública.
- Se corrigió `vitest.config.ts` (excluir `e2e/`) porque Vitest estaba recogiendo por error los specs de Playwright (`test.describe` de `@playwright/test` no es válido dentro de Vitest) — defecto preexistente de configuración, no introducido por este cambio, pero bloqueaba `npm run test:run` con la suite completa; se corrigió como parte de dejar la verificación final (tarea 7.1) realmente en verde.

### Feedback adicional

- 🟡 Menor — El estado `hover` de los enlaces del sidebar usa un valor arbitrario (`hover:bg-black/5`) no derivado de un token del sistema de diseño, porque el frame Figma referenciado no define un estado hover/activo explícito. **Sugerencia concreta:** cuando una historia futura (US-001/002/003) defina un token de "surface-container"/"hover" reutilizable, migrar este valor a ese token para mantener consistencia entre features.
- 💡 Sugerencia — Ningún enlace del sidebar marca la ruta activa (`aria-current="page"`) porque en la raíz (`/`) ninguna de las tres rutas está activa. Vale la pena añadirlo cuando las páginas reales reemplacen los stubs, para mejorar la señal de ubicación actual.
- 💡 Sugerencia — `src/app/page.tsx` (ruta `/`) sigue siendo un `<div></div>` vacío; no es parte de ningún AC de esta historia, pero como ahora queda envuelto por el sidebar, una futura historia podría redirigir `/` a una de las tres secciones para evitar una pantalla en blanco al abrir la app.
- Buen uso del patrón Object Mother y AAA ya establecido por el código previo, mantenido consistentemente en las pruebas nuevas (`Sidebar.test.tsx`, `e2e/app-shell-navegacion.spec.ts`).

## Próximas acciones

Sin acciones pendientes.

## Justificaciones aceptadas

Ninguna.
