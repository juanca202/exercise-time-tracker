# Code Review — US-001-proyectos · exercise-time-tracker

**Fecha**: 2026-07-14 19:00
**Repositorio**: exercise-time-tracker
**Rama**: loop/test-3
**Commit**: e2b5338 (base; cambios de esta revisión aún sin commitear)
**Working tree**: sucio (7 archivos: 3 modificados, 4 nuevos, sin stagear)
**Modo**: default
**Historia**: US-001-proyectos (`docs/specs/user-stories/US-001-proyectos/README.md`)
**Veredicto**: ✅ Apto

## Resumen

Se revisó la reconciliación del layout de `/proyectos` con el prototipo Figma de referencia (AC-007/AC-009), preservando intacta la lógica de negocio ya probada (validación, store, persistencia). El diff toca `ProyectosListado.tsx` (rediseño de presentación + reutilización de `calcularTotalPorProyecto`), dos utilidades nuevas de presentación en `src/features/proyectos/lib/`, sus tests unitarios, la extensión de `ProyectosListado.test.tsx` y un ajuste mínimo de `e2e/gestion-proyectos.spec.ts` para desambiguar el nuevo botón "Crear Nuevo Proyecto". Los siete checks automatizados aplicables pasan sin errores ni omisiones. La revisión cualitativa no encontró hallazgos bloqueantes; se documentan dos observaciones menores no bloqueantes sobre duplicación acotada.

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                                 | Categoría   | Estado | Detalle                                                                                                        | Duración |
| --- | ---------- | --------------------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | tipado     | `npx tsc --noEmit -p tsconfig.json`     | Bloqueante  | ✅     | 0 errores                                                                                                      | ~1.0s    |
| 2   | linter     | `npm run lint` (eslint .)               | Bloqueante  | ✅     | 0 errors, 0 warnings en el diff (único warning reportado es de `coverage/`, artefacto generado, ajeno al diff) | ~2s      |
| 3   | unit tests | `npx vitest run`                        | Bloqueante  | ✅     | 230 passed, 0 failed (45 archivos)                                                                             | ~4.2s    |
| 4   | coverage   | `npx vitest run --coverage`             | Bloqueante  | ✅     | 96.37% stmts / 91.71% branch global; `ProyectosListado.tsx` 95.83% stmts (sin umbral configurado, exit 0)      | ~5.0s    |
| 5   | build      | `npm run build` (next build, Turbopack) | Bloqueante  | ✅     | Compilación y prerender OK (`/`, `/tareas`, `/proyectos`, `/historial` estáticos)                              | ~2.5s    |
| 6   | e2e        | `npx playwright test`                   | Condicional | ✅     | 18 passed (smoke, app-shell-navegación US-000, gestión de Proyectos US-001, Historial US-003, Tareas US-002)   | ~9.4s    |
| 7   | sonar      | —                                       | Informativo | —      | N/A (sin `sonar-project.properties`, sin `sonar-scanner` en PATH)                                              | —        |

### Detalle de checks fallidos

Sin checks fallidos.

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** reconciliar el LAYOUT/PRESENTACIÓN de `/proyectos` con el prototipo Figma referenciado por AC-009 (acento de color por tarjeta, "Tiempo Registrado" en fuente monoespaciada, tarjeta "ghost" de creación, `TopAppBar` compartido), reutilizando el patrón ya validado en la reconciliación de `/tareas` (mismo `TopAppBar`) y el selector de agregación ya probado de Historial (`calcularTotalPorProyecto`, AC-003 de US-003), sin modificar la lógica de negocio de US-001 (validación, store, persistencia, modal de creación/edición).

### Análisis semántico

✅ conforme. Las AC de US-001 relevantes al diff siguen cubiertas:

- **AC-004** (listado, incl. estado vacío): comportamiento sin cambios — `ProyectosListado` sigue leyendo `useAppStore` en modo de solo lectura y respetando el gate de hidratación (`haHidratado`). El estado vacío ahora combina el texto existente con la tarjeta ghost (decisión de buen criterio explícita del encargo, ninguna AC lo prohíbe). Cubierto por TC-007/TC-008 (sin cambios) más las nuevas pruebas de la tarjeta ghost en estado vacío.
- **AC-005/AC-006** (edición reutilizando el mismo modal, bloqueo de guardado con Nombre vacío): `ProyectoFormModal` no se tocó; el botón "Editar" por tarjeta conserva su nombre accesible exacto ("Editar", sin `aria-label` adicional) para no romper ni el test unitario ni el flujo E2E existentes.
- **AC-003** (persistencia, vía US-003 AC-003 para el cálculo de tiempo): el diff reutiliza `calcularTotalPorProyecto(registrosDeTiempo, tareas, proyectos)` de `src/features/historial/selectors/`, exactamente como el `README.md` de US-001 anticipa en su nota de alcance ("AC-004 de esta historia cubre únicamente el listado... sin duplicar la regla de cálculo"). No se reimplementó la agregación.
- **AC-007/AC-009** (adherencia a DESIGN.md y fidelidad visual a Figma): verificado visualmente con captura de pantalla contra datos de ejemplo — acento izquierdo de 6px, tarjeta blanca con borde `outline-variant`, "TIEMPO REGISTRADO" en `font-mono` con el valor en formato `HH:MM`, tarjeta ghost con borde punteado e ícono "+", `TopAppBar` reutilizado sin reimplementar el patrón. Los tokens de color usados (`primary`, `secondary`, `on-surface-variant`, `outline-variant`, `surface-container-lowest`, `surface-container-low`) son los ya mapeados en `globals.css`, sin introducir valores hex sueltos salvo el mismo `bg-[#2e3a59]` que ya usaba `color-acento-tarea.ts` (colores puntuales del prototipo sin token propio, precedente ya aceptado).

No se detecta scope creep: el diff no toca `ProyectoFormModal.tsx` ni `validar-proyecto.ts` (tal como pedía el encargo), ni introduce lógica de negocio nueva en el store.

### Arquitectura y diseño

✅ conforme, con dos observaciones menores no bloqueantes:

- [ISO-25010: Mantenibilidad] 🟡 Duplicación acotada del hash de color determinístico — **Qué:** `src/features/proyectos/lib/color-acento-proyecto.ts` reimplementa, línea por línea, el mismo algoritmo de hash (`hash = hash * 31 + charCodeAt(...)`) que `src/features/tareas/lib/color-acento-tarea.ts`, solo con el orden de la paleta cambiado. **Por qué:** es una duplicación real (misma razón de cambio: si el algoritmo de hash necesitara ajustarse — p. ej. para mejorar la distribución — habría que tocar ambos archivos). **Impacto:** bajo — 10 líneas, sin lógica de negocio, sin riesgo de divergencia funcional observable hoy; el propio encargo de esta tarea pedía explícitamente replicar el patrón local a la feature (ADR-005, features independientes) en vez de acoplar Proyectos y Tareas a una abstracción compartida por una única reutilización. **Sugerencia concreta:** si una tercera feature necesita el mismo patrón de "color determinístico por id" (regla de las tres repeticiones), extraer `obtenerColorAcentoPorId(id, paleta)` a `src/shared/lib/` entonces; hoy, con dos usos, la duplicación es aceptable y evita acoplar dos features por una utilidad de 10 líneas.
- [ISO-25010: Mantenibilidad] 🟡 Tercera función de formateo de duración con forma propia — **Qué:** `formatearTiempoRegistrado` (`src/features/proyectos/lib/formatear-tiempo-registrado.ts`, formato `HH:MM`) se suma a `formatearDuracion` (Historial, `Xh Ym`/`X min`) y a `formatearHorasYMinutos`/`formatearHMS` (Tareas, `Xh Ym` y `HH:MM:SS`), tres formatos de duración ligeramente distintos implementados de forma independiente en tres features. **Por qué:** aunque cada formato es legítimamente distinto (el prototipo Figma pide explícitamente `HH:MM` sin segundos para "Tiempo Registrado", distinto de los otros dos), la revisión de código de la reconciliación anterior de US-001 ya anticipaba este riesgo para el patrón de fábrica de entidades y ahora se repite para el formateo de tiempo. **Impacto:** bajo hoy (cada función tiene un único call site y una firma simple `minutos → string`), pero si aparece una cuarta variante el costo de descubrir cuál reutilizar (o si hace falta una nueva) empieza a subir. **Sugerencia concreta:** no bloquea este cambio — el formato `HH:MM` es requisito explícito de Figma y no existía antes; considerar, en una futura iteración transversal, un pequeño módulo `src/shared/lib/tiempo.ts` que centralice las variantes de formateo de duración ya estabilizadas (`Xh Ym`, `HH:MM:SS`, `HH:MM`) como funciones puras reexportadas, sin forzar aún una refactorización de las features existentes.

### Feedback adicional

- Buen uso del truco `display: contents` en el `<ul>` que envuelve los `<li>` de Proyecto (`ProyectosListado.tsx`): mantiene la tarjeta ghost dentro del mismo `flex flex-wrap` que las tarjetas de Proyecto (fidelidad visual a la cuadrícula de Figma) sin que cuente como `listitem` — decisión explícita y comentada en el código, verificada con una prueba unitaria dedicada (`"la tarjeta ghost no es un Proyecto: no debe contarse como listitem"`) y con el E2E de 20 Proyectos que sigue contando exactamente 20 `listitem` dentro de `main`.
- El ajuste mínimo de `e2e/gestion-proyectos.spec.ts` (`exact: true` en las 4 ocurrencias de `page.getByRole("button", { name: "Nuevo Proyecto" })` a nivel de página) está bien acotado: solo toca las llamadas que podían capturar por error el nuevo botón "Crear Nuevo Proyecto" por coincidencia de subcadena (comportamiento por defecto de Playwright, distinto del de Testing Library); las llamadas ya scopeadas a `dialogo` no se tocaron porque no tenían ambigüedad.
- El reposicionamiento de "Editar" junto al valor "Tiempo Registrado" (en vez de junto al título, como en un primer intento visual) evita truncar nombres de Proyecto largos y sigue el mismo patrón espacial que `TareaListItem` (tiempo + acción agrupados a la derecha) — buena decisión de consistencia entre features tras verificar visualmente el problema de espacio con Chrome DevTools.
- Cobertura de pruebas ampliada de forma proporcional al cambio: 5 pruebas unitarias nuevas en `ProyectosListado.test.tsx` (tiempo registrado con y sin registros, apertura de modal desde la tarjeta ghost, ghost visible con Proyectos existentes y en estado vacío) más pruebas dedicadas para las dos utilidades nuevas (`color-acento-proyecto.test.ts`, `formatear-tiempo-registrado.test.ts`, con casos borde de valores negativos/no numéricos).

## Próximas acciones

Sin acciones bloqueantes pendientes. Opcionalmente, en una iteración futura (no bloqueante para este cambio):

1. Si una tercera feature necesita "color determinístico por id", extraer la función de hash compartida en vez de duplicarla una vez más (🟡).
2. Si aparece una cuarta variante de formateo de duración, evaluar centralizar las variantes estabilizadas en `src/shared/lib/tiempo.ts` (🟡).

## Justificaciones aceptadas

Ninguna (no hubo hallazgos bloqueantes que requirieran justificación).
