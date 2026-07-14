# Code Review — US-001-proyectos · exercise-time-tracker

**Fecha**: 2026-07-14 07:56
**Repositorio**: exercise-time-tracker
**Rama**: loop/test-3 (merge en curso de `worktree-wf_f50d6d04-9a0-2`, reconciliado con la infraestructura canónica de `fundamentos-infraestructura-compartida`) · **Commit**: 4e8cfae (base pre-merge; commit de merge pendiente)
**Working tree**: sucio (merge resuelto y en stage, pendiente de `git commit`)
**Modo**: default
**Historia**: US-001-proyectos (`docs/specs/user-stories/US-001-proyectos/README.md`)
**Veredicto**: ✅ Apto

## Resumen

Se revisó el resultado de reconciliar el change OpenSpec `gestion-proyectos` (US-001) con la infraestructura compartida canónica ya mergeada en `loop/test-3` (`fundamentos-infraestructura-compartida`, US-000). El agente que implementó `gestion-proyectos` había reimplementado en paralelo su propia copia del store raíz, el adaptador de persistencia y el app shell (nombres distintos, misma responsabilidad); esta revisión cubre el diff final tras eliminar esa duplicación y migrar la feature Proyectos (`src/features/proyectos/`) a `useAppStore`. Los seis checks automatizados aplicables (tipado, linter, unit tests, coverage, build, e2e) pasan sin errores ni omisiones. La revisión cualitativa no encontró hallazgos bloqueantes; se documentan observaciones menores no bloqueantes.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                      | Categoría   | Estado | Detalle                                                                                                                  | Duración |
| --- | ---------- | ---------------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | tipado     | `npx tsc --noEmit`           | Bloqueante  | ✅     | 0 errores                                                                                                                | ~2s      |
| 2   | linter     | `npm run lint` (eslint .)    | Bloqueante  | ✅     | 0 errors, 0 warnings (el único warning reportado es de `coverage/`, artefacto generado e ignorado en git, ajeno al diff) | ~2s      |
| 3   | unit tests | `npm run test:run` (vitest)  | Bloqueante  | ✅     | 56 passed, 0 failed (10 archivos)                                                                                        | ~2s      |
| 4   | coverage   | `npx vitest run --coverage`  | Bloqueante  | ✅     | 94.52% stmts / 83.78% branch (sin umbral configurado, exit 0)                                                            | ~2s      |
| 5   | build      | `npm run build` (next build) | Bloqueante  | ✅     | Compilación y prerender OK (`/proyectos`, `/tareas`, `/historial` estáticos)                                             | ~3s      |
| 6   | e2e        | `npx playwright test`        | Condicional | ✅     | 9 passed (smoke, app-shell-navegación US-000, gestión de Proyectos US-001)                                               | ~8s      |
| 7   | sonar      | —                            | Informativo | —      | N/A (sin `sonar-project.properties`)                                                                                     | —        |

### Detalle de checks fallidos

Sin checks fallidos. (Durante la reconciliación se detectó y corrigió que `e2e/app-shell-navegacion.spec.ts`, ya mergeado por US-000, esperaba el stub "Próximamente" en `/proyectos`; se actualizó para reflejar la pantalla final de Proyectos, dejando intacta la expectativa de stub para `/tareas` y `/historial`.)

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** completar el merge de `gestion-proyectos` (US-001) a `loop/test-3` eliminando la infraestructura duplicada que el agente de esa feature reimplementó en paralelo (`store-raiz.ts`/`useStoreRaiz`, `adaptador-persistencia-local.ts`, `AppShell.tsx`, `domain/index.test.ts`) y adaptando la feature Proyectos para consumir la infraestructura canónica ya validada por `fundamentos-infraestructura-compartida` (`useAppStore`, `src/shared/persistence/adaptador.ts`, `InicializadorAplicacion`, `Sidebar`), sin perder ninguna de las 9 AC de US-001 ni la cobertura de pruebas ya escrita.

### Análisis semántico

✅ conforme. Las 9 AC de US-001 siguen cubiertas tras la reconciliación:

- AC-001/AC-002 (creación con Nombre obligatorio/Descripción opcional): `ProyectoFormModal` + `validarProyecto`, sin cambios de comportamiento — solo el store consumido cambió de `useStoreRaiz` a `useAppStore`. Cubierto por TC-001–TC-004 (unit) y el flujo E2E de creación.
- AC-003 (persistencia local): delegada íntegramente al store/adaptador canónicos (`src/shared/persistence/adaptador.ts`); cubierto por E2E de recarga (TC-005/TC-006, incl. 20 Proyectos).
- AC-004 (listado, incl. vacío): `ProyectosListado`, TC-007/TC-008. Se añadió el gate de hidratación (`haHidratado`) exigido por el contrato documentado en `app-store.ts` ("todo componente que lea datos persistidos DEBE comprobar este indicador"), que la implementación original no tenía porque su store paralelo no imponía esa regla del mismo modo.
- AC-005/AC-006 (edición reutilizando el mismo modal, bloqueo de guardado): sin cambios de comportamiento. TC-009–TC-012.
- AC-007/AC-009 (adherencia a DESIGN.md / fidelidad a Figma): la store canónica trajo un `globals.css` deliberadamente acotado al app shell (comentario explícito: "el resto de la paleta se incorpora cuando una historia funcional la necesite"). Se extendió aditivamente con los tokens de color y la escala tipográfica/elevación que Proyectos consume (`on-surface`, `secondary*`, `surface-container*`, `error`, `inverse-surface`, `text-headline-*`, `text-body-*`, `shadow-elevation-*`), preservando el soporte de modo oscuro ya validado y sin reintroducir tokens no usados (p. ej. `tertiary*`, `font-jetbrains-mono`) que la implementación paralela sí traía sin consumidor.
- AC-008 (navegación lateral con ítem activo, TC-014): la implementación paralela de Proyectos traía su propio `Sidebar` (con `usePathname`/`aria-current`) que reemplazaba al `Sidebar` canónico (basado en `Toolbar` de Base UI, sin marcado de activo). Se optó por conservar el `Sidebar` canónico — ya probado y con la superficie de API estable declarada en su TSDoc — y extenderlo mínimamente con `usePathname` + `aria-current="page"`, en vez de sustituirlo. Verificado con TC-014 (E2E) y una prueba unitaria nueva equivalente a la de la implementación paralela.

No se detecta scope creep: el diff no toca lógica de Tareas/Historial ni reintroduce responsabilidades de negocio en el store compartido.

### Arquitectura y diseño

✅ conforme, con una observación menor no bloqueante:

- [ISO-25010: Mantenibilidad] 🟡 Duplicación de infraestructura eliminada correctamente — **Qué:** se eliminaron `src/shared/store/store-raiz.ts` (+ test), `src/shared/persistence/adaptador-persistencia-local.ts` (+ test), `src/shared/domain/index.test.ts` y `src/shared/ui/app-shell/AppShell.tsx`, todos funcionalmente redundantes con la infraestructura ya mergeada por `fundamentos-infraestructura-compartida` (confirmado por lectura comparada de ambos pares antes de borrar, y por `grep` de que ningún archivo restante los importaba). **Por qué se marca igualmente como observación:** el store canónico (`useAppStore`) expone únicamente CRUD crudo — `crearProyecto(proyecto: Proyecto)` recibe la entidad completa, a diferencia del store paralelo eliminado (`crearProyecto(input: EntradaProyecto): Proyecto`) que generaba `id`/timestamps internamente. Esto trasladó la construcción de la entidad (`generarId()` + `new Date().toISOString()`) a `ProyectoFormModal.tsx`, un componente de UI. **Impacto:** bajo y local — un único call site, sin lógica de negocio real involucrada (solo construcción de entidad), pero es el primer punto donde una feature necesita ensamblar una entidad completa antes de pasarla al store crudo; si Tareas y Registros de Tiempo repiten este patrón inline en sus propios componentes, se dispersará la misma responsabilidad en varios lugares. **Sugerencia concreta:** si al implementar la siguiente feature (Tareas) aparece el mismo patrón, considerar extraer un pequeño factory (`crearProyectoNuevo(input): Proyecto` en `src/features/proyectos/lib/` o similar) que combine `generarId()` + timestamp, dejando el componente solo con la orquestación de UI. No amerita bloquear este merge.

### Feedback adicional

- La resolución de conflictos priorizó correctamente distinguir "duplicación redundante" (nombres distintos, misma lógica: dominio, persistencia, store barrel, date/mes-calendario, vitest.config, e2e/smoke) de "funcionalidad real en riesgo de perderse" (el marcado de ítem activo en el Sidebar exigido por AC-008/TC-014, y los tokens de diseño exigidos por AC-009): en ambos casos se extendió la versión canónica en vez de descartarla o de aceptar ciegamente la versión paralela, evitando tanto duplicación como regresión funcional.
- El ajuste de `e2e/app-shell-navegacion.spec.ts` (propiedad de US-000, ya mergeado) fue el mínimo necesario: solo la aserción sobre `/proyectos` cambió de "Próximamente" a la pantalla real; `/tareas` y `/historial` conservan su expectativa de stub intacta.
- `generarId()` (`src/shared/store/id.ts`) se conservó como utilidad compartida — no era redundante frente a nada canónico existente — y se re-exportó desde el barrel `src/shared/store/index.ts` para que esté disponible a futuras features (Tareas, Registros de Tiempo) que necesiten el mismo patrón de generación de id.
- La cobertura de pruebas se mantiene sólida y trazable a TC-XXX tras la migración: 56 unit tests (Vitest + Testing Library, 10 archivos) más 4 specs E2E de Proyectos y 3 de app-shell/smoke (Playwright), sin pérdida de casos respecto a la implementación original.

## Próximas acciones

Sin acciones bloqueantes pendientes. Opcionalmente, en una iteración futura (no bloqueante para este merge):

1. Si Tareas o Registros de Tiempo repiten el patrón de construir la entidad completa (`id` + timestamps) dentro de un componente de UI, extraer un factory compartido en lugar de duplicar el patrón inline (🟡).
2. Unificar el campo "Descripción" de `ProyectoFormModal` bajo `Field.Root`/`Field.Control` de Base UI para consistencia con "Nombre" (observación heredada de la revisión original de `gestion-proyectos`, no bloqueante).

## Justificaciones aceptadas

Ninguna (no hubo hallazgos bloqueantes que requirieran justificación).
