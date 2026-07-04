# ADR-005: Estrategia de pruebas unitarias y E2E

- Estado: Accepted
- Fecha de creación: 2026-05-28
- Última actualización: 2026-07-04
- Decisores: Tech lead
- Etiquetas: testing, vitest, playwright, e2e, cobertura, calidad, arquitectura

## Contexto

El proyecto usa Next.js 16, React 19 y Vitest con Testing Library y `jsdom` (`package.json`, `vitest.config.ts`). Sin convenciones explícitas, el equipo podría dispersar tests en carpetas globales (`tests/`, `__tests__/` en la raíz), duplicar datos de prueba ad hoc, o medir cobertura de forma inconsistente, lo que dificulta el mantenimiento y las revisiones.

La arquitectura por features ([ADR-004](ADR-004-feature-based-architecture.md)) exige que el código de dominio viva junto a su feature; las pruebas deben seguir la misma cohesión. El estado cliente con Zustand ([ADR-003](ADR-003-zustand-state-management.md)) y los Client Components ([ADR-001](ADR-001-app-router-only.md)) requieren tests aislados y deterministas para stores, hooks y UI sin acoplar ejecuciones entre archivos.

## Decision

El proyecto adoptará la siguiente **estrategia estándar de pruebas unitarias** (y de componentes/hooks con Vitest + Testing Library cuando aplique):

### Ubicación: tests co-located

- Los archivos de prueba residen **junto al código bajo prueba**, en la misma carpeta del módulo o feature.
- Convención de nombre: `*.test.ts` o `*.test.tsx` (también válido `*.spec.ts(x)` si el equipo lo unifica en un solo sufijo; por defecto preferir `.test`).
- Ejemplos válidos:
  - `src/features/todos/components/todo-list.test.tsx` junto a `todo-list.tsx`
  - `src/features/todos/lib/validation.test.ts` junto a `validation.ts`
- Queda **desaconsejado** un árbol paralelo solo por tipo (`tests/unit/...` espejando `src/...`) salvo utilidades de test compartidas (ver Object Mother).
- Los tests de código legado en la raíz del repo, hasta completar la migración a `src/` ([ADR-004](ADR-004-feature-based-architecture.md)), siguen la misma regla co-located respecto al archivo que prueban.

### Estructura: patrón AAA

- Cada caso de prueba (`it` / `test`) se organiza en tres fases explícitas:
  1. **Arrange** — preparación de datos, mocks y estado inicial.
  2. **Act** — ejecución de la unidad bajo prueba (una acción principal por caso cuando sea posible).
  3. **Assert** — comprobaciones de resultado, efectos secundarios o interacciones.
- Se permiten comentarios `// Arrange`, `// Act`, `// Assert` o bloques vacíos entre secciones cuando mejoren la legibilidad; no se exige librería adicional.

### Datos de prueba: Object Mother Pattern

- Los objetos de dominio y DTOs repetidos en varios tests se construyen mediante **Object Mothers** (funciones o módulos dedicados que devuelven instancias válidas con valores por defecto y overrides opcionales).
- Ubicación recomendada:
  - Mothers específicos de una feature: `src/features/<feature>/testing/` o `__test-utils__/` dentro de la feature.
  - Mothers transversales: `src/shared/testing/` (o equivalente bajo `src/`).
- Nomenclatura sugerida: `aTodo()`, `aTodoInput()`, `buildTodo(overrides)`, etc.
- Evitar objetos literales grandes duplicados en cada archivo de test; los literals puntuales solo para casos mínimos o edge cases únicos.

### Cobertura

- **Objetivo:** ≥ **80 % de cobertura de ramas** (`branches`) en el conjunto medido por la herramienta de cobertura del proyecto (Vitest con proveedor `@vitest/coverage-v8` o equivalente).
- **Enfoque:** priorizar **rutas críticas** — lógica de dominio, validaciones, ordenación, persistencia, stores Zustand, hooks y componentes con comportamiento de negocio — frente a código trivial o generado.
- La cobertura es **umbral orientativo en CI/revisiones**, no sustituto de aserciones significativas; no se exige 100 % en UI puramente presentacional sin lógica.
- Umbrales concretos en `vitest.config` o pipeline CI se configuran en tareas de implementación; este ADR fija el objetivo numérico y el tipo de métrica (ramas).

### Aislamiento y determinismo

- Cada test debe ser **independiente**: sin depender del orden de ejecución ni de estado compartido mutable entre archivos o casos.
- Uso de `beforeEach` / `afterEach` (o `setup`/`teardown` de Vitest) para resetear stores, mocks de `localStorage`, timers y DOM.
- **Determinísticos:** sin aleatoriedad no fijada; fechas e IDs controlados (mocks de `Date`, inyección de `id` en factories, `vi.useFakeTimers()` cuando corresponda).
- Mocks de red, reloj y almacenamiento local explícitos; no depender de datos reales del entorno del desarrollador.
- Para Zustand: instanciar o resetear el store en cada test; no reutilizar estado sucio entre casos ([ADR-003](ADR-003-zustand-state-management.md)).

### Stack y alcance

- **Runner y aserciones (unitario/componente):** Vitest.
- **UI / hooks React:** `@testing-library/react` y `@testing-library/user-event`; entorno `jsdom` según configuración actual.
- **Alcance de este ADR:** convenciones de pruebas unitarias y de componente en el cliente, y la estrategia E2E (ver sección siguiente). No define contract tests (decisión futura si se requiere).

Queda **fuera de alcance** como estrategia principal: carpetas globales `tests/` solo por conveniencia histórica, snapshots masivos sin aserción de comportamiento, y cobertura medida solo por líneas sin considerar ramas en código con lógica condicional.

### Estrategia E2E: Playwright

- **Herramienta:** [Playwright](https://playwright.dev/) (`@playwright/test`), ejecutado contra la app Next.js construida/servida (`next build && next start`, o `next dev` en modo local) — no contra código fuente aislado, por lo que **no aplica** la convención co-located de la sección anterior.
- **Ubicación:** carpeta dedicada `e2e/` en la raíz del repo (paralela a `src/`), no junto a cada feature. Justificación: un spec E2E ejercita flujos de usuario que cruzan varias features y rutas del App Router ([ADR-001](ADR-001-app-router-only.md)); anclarlo a una sola carpeta de `src/features/**` ([ADR-004](ADR-004-feature-based-architecture.md)) sería arbitrario y dificultaría ubicar specs que abarcan múltiples pantallas.
  - Subcarpetas opcionales por flujo/feature dentro de `e2e/` (p. ej. `e2e/todos/`, `e2e/auth/`) cuando el número de specs lo justifique.
  - Convención de nombre: `*.spec.ts` (convención por defecto de Playwright Test), para distinguir visualmente de los `*.test.ts(x)` unitarios/componente co-located.
- **Configuración:** `playwright.config.ts` en la raíz del repo, con `webServer` apuntando al comando de arranque de la app (`npm run build && npm run start` o `npm run dev` según entorno) para que la suite levante el servidor automáticamente antes de correr.
- **Navegadores objetivo:** **Chromium únicamente** por defecto (`projects: [{ name: 'chromium' }]`). Prioriza velocidad en CI y cobertura del motor más usado; ampliar a Firefox/WebKit es una decisión posterior si surge necesidad de cobertura cross-browser.
- **Alcance de las pruebas:** flujos críticos de usuario end-to-end (camino feliz + variantes de negocio relevantes), no sustituye la cobertura de casos límite que ya dan los tests unitarios/de componente de la sección anterior.
- **Aislamiento y determinismo:** mismos principios que la sección de aislamiento anterior — specs independientes entre sí, sin depender de estado dejado por otro spec; usar fixtures/`test.beforeEach` de Playwright para preparar estado (ej. `localStorage`, rutas) en vez de depender de ejecución previa.

## Alternativas consideradas

- **Carpeta global `tests/` o `__tests__/` en raíz:** facilita un solo comando de descubrimiento, pero aleja las pruebas del código bajo [ADR-004](ADR-004-feature-based-architecture.md); se descarta como convención principal.
- **Fixtures estáticos JSON en lugar de Object Mothers:** útil para snapshots o integración; menos flexible para variaciones y overrides en unit tests; se reserva para casos puntuales, no como patrón dominante.
- **Cobertura ≥ 90 % o solo líneas:** umbral más alto sin retorno claro en fases tempranas; métrica solo de líneas ignora ramas en validaciones y stores; se adopta **80 % ramas** con foco en rutas críticas.

## Consecuencias

### Positivas

- Localización predecible de tests al navegar una feature; revisiones de PR acotadas al mismo directorio.
- AAA y Object Mothers mejoran legibilidad y reducen duplicación de datos de prueba.
- Umbral de ramas alinea calidad con lógica condicional real (validaciones, estados, errores).
- Tests aislados y deterministas facilitan CI estable y depuración local.
- Playwright cubre flujos completos de usuario que los tests unitarios/componente no pueden validar (integración real entre rutas, estado persistido, navegación).
- Un único navegador (Chromium) en CI mantiene la suite E2E rápida y evita flakiness cross-browser en una etapa temprana del proyecto.

### Negativas / trade-offs

- Requiere configurar cobertura en Vitest/CI y disciplina para no inflar tests triviales solo por métrica.
- Object Mothers añaden archivos auxiliares; mal usados pueden ocultar datos relevantes del caso si los defaults no son explícitos.
- Co-located aumenta archivos por carpeta; algunos equipos prefieren un único árbol `tests/` por hábito.
- Migración del código legado: tests existentes deben moverse al lado del módulo al refactorizar hacia `src/`.
- La carpeta `e2e/` es una excepción deliberada a la convención co-located; requiere que el equipo recuerde que solo aplica a specs E2E, no a unit/componente.
- Cobertura mono-navegador (Chromium) no detecta regresiones específicas de Firefox/WebKit; riesgo aceptado hasta que se justifique ampliar.

## Referencias

- [ADR-001: Enrutamiento exclusivo con App Router](ADR-001-app-router-only.md)
- [ADR-003: Manejo de estado cliente con Zustand](ADR-003-zustand-state-management.md)
- [ADR-004: Estructura del proyecto con arquitectura por features](ADR-004-feature-based-architecture.md)
- [Vitest — Coverage](https://vitest.dev/guide/coverage.html)
- [Testing Library — Guiding Principles](https://testing-library.com/docs/guiding-principles/)
- [Object Mother — Martin Fowler (wiki)](https://wiki.cunningham.app/display/docs/Object+Mother)
- [Playwright — Test configuration](https://playwright.dev/docs/test-configuration)
- [Playwright — Best practices](https://playwright.dev/docs/best-practices)
- [Documenting Architecture Decisions — Cognitect](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
