# Code Review — US-001-proyectos · exercise-time-tracker

**Fecha**: 2026-07-13 22:57
**Repositorio**: exercise-time-tracker
**Rama**: worktree-wf_f50d6d04-9a0-2 (worktree aislado creado desde `loop/test-3`) · **Commit**: 9bbab1f (pendiente de commit de los cambios revisados)
**Working tree**: sucio (10 rutas modificadas/añadidas, ver detalle en el resumen)
**Modo**: default
**Historia**: US-001-proyectos (`docs/specs/user-stories/US-001-proyectos/README.md`)
**Veredicto**: ✅ Apto

## Resumen

Se revisó la implementación del change OpenSpec `gestion-proyectos` (feature `src/features/proyectos/`, ruta `src/app/proyectos/`, y consumo de la infraestructura compartida `src/shared/{domain,persistence,store,ui}`), que materializa los 9 criterios de aceptación de US-001. Los cinco checks automatizados aplicables (tipado, linter, unit tests, coverage, build) y el condicional de E2E pasan sin errores ni omisiones. La revisión cualitativa no encontró hallazgos bloqueantes; se documentan dos observaciones menores no bloqueantes y una limitación de verificación (sin acceso al archivo de Figma real desde este entorno).

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                      | Categoría   | Estado | Detalle                                                      | Duración |
| --- | ---------- | ---------------------------- | ----------- | ------ | ------------------------------------------------------------ | -------- |
| 1   | tipado     | `npx tsc --noEmit`           | Bloqueante  | ✅     | 0 errores                                                    | ~3s      |
| 2   | linter     | `npm run lint` (eslint .)    | Bloqueante  | ✅     | 0 errors, 0 warnings                                         | ~2s      |
| 3   | unit tests | `npm run test:run` (vitest)  | Bloqueante  | ✅     | 40 passed, 0 failed (8 archivos)                             | ~4s      |
| 4   | coverage   | `npx vitest run --coverage`  | Bloqueante  | ✅     | 80.55% stmts / 82.6% branch (sin umbral configurado, exit 0) | ~4s      |
| 5   | build      | `npm run build` (next build) | Bloqueante  | ✅     | Compilación y prerender OK (`/proyectos` estático)           | ~5s      |
| 6   | e2e        | `npx playwright test`        | Condicional | ✅     | 5 passed (smoke + 4 specs de gestión de Proyectos)           | ~33s     |
| 7   | sonar      | —                            | Informativo | —      | N/A (sin `sonar-project.properties`)                         | —        |

### Detalle de checks fallidos

Sin checks fallidos. (Durante la iteración se detectó y corrigió un error de linter — `react-hooks/set-state-in-effect` en `ProyectoFormModal.tsx` — y una desviación de radios de borde respecto a DESIGN.md; ambos se resolvieron antes de esta ejecución final, que ya pasa limpia.)

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** implementar el change OpenSpec `gestion-proyectos` (US-001): CRUD de creación/edición/listado de Proyecto con Nombre obligatorio y Descripción opcional, modal único reutilizado entre ambos modos, persistencia vía el store raíz compartido, adherencia a DESIGN.md (Precision Focus) y navegación lateral — sin rediseñar la infraestructura compartida (store, persistencia, sidebar) ya provista por el change hermano `fundamentos-infraestructura-compartida`.

### Análisis semántico

✅ conforme. Los 9 AC de US-001 están cubiertos:

- AC-001/AC-002 (creación con Nombre obligatorio/Descripción opcional): `ProyectoFormModal` + `validarProyecto`, cubierto por TC-001–TC-004 (unit) y el flujo E2E de creación.
- AC-003 (persistencia local): delegada íntegramente al store/adaptador compartidos; cubierto por E2E de recarga (TC-005/TC-006, incluyendo el caso de 20 Proyectos).
- AC-004 (listado, incl. vacío): `ProyectosListado`, TC-007/TC-008.
- AC-005/AC-006 (edición reutilizando el mismo modal, bloqueo de guardado): mismo componente parametrizado por `proyecto?: Proyecto`, TC-009–TC-012.
- AC-007/AC-009 (adherencia a DESIGN.md / fidelidad a Figma): tokens Tailwind exclusivos (colores `surface*`/`primary`/`secondary`, tipografía, radios, elevación `shadow-elevation-*`), sin valores hardcodeados. **Limitación de verificación:** no se pudo contrastar contra el archivo real de Figma referenciado en US-001 (`YYHDIH7CBsZrZ4VKXvbzkR`) porque este entorno no tiene acceso de edición/lectura a ese archivo (`mcp__figma__get_metadata` devolvió error de permisos). La verificación de AC-009 se hizo por comparación manual contra los tokens de DESIGN.md únicamente, no contra las capturas reales del prototipo.
- AC-008 (navegación lateral): el ítem "Proyectos" del sidebar compartido ya apuntaba a la ruta; se verificó y cubrió con E2E (TC-014).

No se detecta scope creep: el diff no toca lógica de Tareas/Historial ni redefine el store o el adaptador de persistencia compartidos, respetando los Non-Goals de `design.md`.

### Arquitectura y diseño

✅ conforme, con dos observaciones menores no bloqueantes:

- [ISO-25010: Mantenibilidad] 🟡 Uso asimétrico de Base UI entre campos del formulario — **Qué:** en `ProyectoFormModal.tsx`, el campo "Nombre" usa `Field.Root`/`Field.Control`/`Field.Label`/`Field.Error` (Base UI), mientras que "Descripción" usa un `<label>` nativo envolviendo un `<textarea>` plano. **Por qué:** introduce una inconsistencia menor en el uso del sistema de componentes (ADR-003); si en el futuro se necesita validar Descripción, habrá que migrar ese campo a `Field.*` mientras Nombre ya lo tiene. **Impacto:** solo legibilidad/consistencia local del componente, sin efecto funcional. **Sugerencia concreta:** envolver el `<textarea>` en `Field.Root`/`Field.Control` (Base UI permite pasar `render={<textarea />}` o usar `Field.Control` con `render` prop) para unificar el patrón, aunque no tenga validación asociada hoy.
- [ISO-25010: Fiabilidad] 💡 `adaptadorPersistenciaLocal.escribir()` no captura una eventual `QuotaExceededError` de `localStorage.setItem` — **Qué:** si el dispositivo agota la cuota de almacenamiento local, la escritura lanzaría una excepción no capturada dentro de `persistirEstadoActual` (invocada síncronamente tras cada creación/edición de Proyecto). **Por qué:** en una app offline-first de uso prolongado (Proyectos + Tareas + Registros de Tiempo acumulados) es un escenario plausible a mediano plazo. **Impacto:** este archivo pertenece a la infraestructura compartida (`fundamentos-infraestructura-compartida`), fuera del alcance declarado de `gestion-proyectos` (que explícitamente no rediseña el adaptador de persistencia); se deja como observación para ese change, no bloquea esta revisión. **Sugerencia concreta:** envolver `localStorage.setItem` en `try/catch` y exponer un estado de error o degradar con una notificación no bloqueante.

### Feedback adicional

- El respeto a las decisiones de `design.md` es ejemplar: modal único parametrizado por modo (no duplicado), validación pura y reutilizada en `src/features/proyectos/lib/validar-proyecto.ts` (sin acoplar el store raíz a reglas de Proyecto), y listado como proyección de solo lectura sin estado duplicado — exactamente como se decidió en las secciones 1–3 de `design.md`.
- La cobertura de pruebas es sólida y trazable a TC-XXX: 40 unit tests (Vitest + Testing Library) más 4 specs E2E (Playwright) que cubren creación, edición, bloqueo de guardado, persistencia tras recarga (incl. volumen de 20 Proyectos) y navegación lateral con estado activo.
- Buen detalle: el patrón de "ajustar estado durante el render" en `ProyectoFormModal` (en vez de `useEffect` + `setState`) sigue la guía oficial de React para este caso de uso y evita el error de lint `react-hooks/set-state-in-effect`, documentado con un comentario que explica el porqué.
- TSDoc consistente en todo el módulo (ADR-006), nombres en español coherentes con el resto del repo, y ningún acoplamiento nuevo hacia `src/shared/` (solo consumo de las APIs ya expuestas).

## Próximas acciones

Sin acciones bloqueantes pendientes. Opcionalmente, en una iteración futura (no bloqueante para este merge):

1. Unificar el campo "Descripción" bajo `Field.Root`/`Field.Control` de Base UI para consistencia con "Nombre" (🟡).
2. Añadir manejo de `QuotaExceededError` en `adaptadorPersistenciaLocal.escribir()` — a coordinar con el change `fundamentos-infraestructura-compartida` (💡).
3. Si se dispone de acceso al archivo Figma referenciado en US-001, ejecutar una comparación visual real (TC-015) como verificación complementaria a la ya realizada contra DESIGN.md.

## Justificaciones aceptadas

Ninguna (no hubo hallazgos bloqueantes que requirieran justificación).
