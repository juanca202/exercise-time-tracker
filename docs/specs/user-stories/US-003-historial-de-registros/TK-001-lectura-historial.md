# TK-001: Lectura del historial de registros

**Estado**: Ready
**Historia**: [US-003](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Leer los Registros de Tiempo persistidos junto con su Tarea y Proyecto asociados, y mostrarlos en una tabla del historial completo (fecha, Tarea, Proyecto y duración), degradando a un estado vacío legible tanto cuando no existen Registros como cuando el dato persistido no es válido (JSON corrupto o campos con tipo inválido), sin interrumpir el render de la aplicación ni producir excepciones no controladas.

## Dependencias

- [TK-002: Totales por Tarea, Proyecto y mes](TK-002-totales-tarea-proyecto-mes.md) — reutiliza `indexarPorId`, `esRegistroDeTiempoValido`, `calcularTotalPorTarea` y `calcularTotalPorMes` de `calcular-totales.ts` para unir cada fila con su Tarea/Proyecto, filtrar Registros inválidos y anotar el total acumulado de Tarea/mes que se muestra dentro de la propia tabla (ver Observaciones de US-003 sobre la ausencia de un resumen visual distinto para AC-002).
- [US-000 TK-001: Tipos de dominio compartidos](../US-000-fundamentos/TK-001-tipos-dominio-compartidos.md) — tipos `Proyecto`, `Tarea`, `RegistroDeTiempo`.
- [US-000 TK-002: Adaptador de persistencia local](../US-000-fundamentos/TK-002-adaptador-persistencia-local.md) — `useHasHydrated()` como gate de hidratación antes de leer los selectores del store; su adaptador (`read()` devuelve `null` ante datos no parseables) es la primera línea de defensa frente al caso de JSON corrupto de TC-002.
- [US-000 TK-003: Store raíz (CRUD crudo)](../US-000-fundamentos/TK-003-store-raiz-crud-crudo.md) — selectores `useProyectos()`, `useTareas()`, `useRegistrosDeTiempo()`.
- [US-000 TK-006: Rutas placeholder y verificación offline](../US-000-fundamentos/TK-006-rutas-placeholder-offline.md) — esta tarea provee los componentes que [TK-004](TK-004-ui-diseno-historial.md) usa para reemplazar el placeholder `src/app/historial/page.tsx`.

## Referencias

- **Arquitectura:** [ADR-004: Uso de Zustand para manejo de estado](../../../adr/ADR-004-uso-de-zustand.md) (naturaleza de los selectores consumidos), [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) (ubicación en `src/features/historial/`), [ADR-006: Documentación de código con TSDoc](../../../adr/ADR-006-documentacion-con-tsdoc.md), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md), [ADR-008: Uso de Playwright para las pruebas E2E](../../../adr/ADR-008-uso-de-playwright-para-e2e.md) (TC-001/TC-002/TC-003 son E2E).
- **Investigación:** [RS-002: Viabilidad técnica de localStorage vs. IndexedDB](./research/RS-002-persistencia-local-localstorage-vs-indexeddb.md) — confirma que la hidratación es síncrona (`useHasHydrated` basta, sin manejo de storage asíncrono) y que el costo de lectura para hasta 1000 Registros es del orden de milisegundos.

## Archivos afectados

```text
exercise-time-tracker/
├── e2e/
│   └── + us-003-historial-lectura.spec.ts       # TC-001 (happy), TC-002 (datos corruptos), TC-003 (vacío)
└── src/
    └── features/
        └── historial/
            ├── domain/
            │   ├── + construir-filas-historial.ts       # construirFilasHistorial(): une Registro+Tarea+Proyecto, filtra inválidos
            │   └── + construir-filas-historial.test.ts
            ├── hooks/
            │   ├── + use-historial.ts                   # useHistorial(): gate de hidratación + selectores crudos + filas
            │   └── + use-historial.test.ts
            └── components/
                ├── + historial-tabla.tsx                # tabla de Registros (fecha, Tarea, Proyecto, duración), agrupada por mes
                ├── + historial-tabla.test.tsx
                ├── + historial-vacio.tsx                # estado vacío / degradado (con aviso opcional)
                └── + historial-vacio.test.tsx
```

## Plan de implementación

- [ ] **IT-01** — Definir en `construir-filas-historial.ts` el tipo `FilaHistorial` (`RegistroDeTiempo` + `tarea: Tarea | undefined` + `proyecto: Proyecto | undefined`) y la función `construirFilasHistorial(registros: RegistroDeTiempo[], tareas: Tarea[], proyectos: Proyecto[]): { filas: FilaHistorial[]; registrosDescartados: number }`, que: (a) descarta los registros que no cumplan `esRegistroDeTiempoValido` (TK-002), contabilizándolos en `registrosDescartados`; (b) resuelve `tarea` con `indexarPorId(tareas)` (TK-002) por `registro.tareaId`, dejando `undefined` sin lanzar excepción si el Registro quedó huérfano; (c) resuelve `proyecto` con `indexarPorId(proyectos)` por `tarea?.proyectoId`, dejando `undefined` si la Tarea no tiene Proyecto válido (aplicación a nivel de fila del caso cubierto por TC-008).
- [ ] **IT-02** — Ordenar `filas` por `fecha` ascendente y anotar cada fila con el total acumulado de su Tarea (`calcularTotalPorTarea`, TK-002) y el total acumulado de su mes (`calcularTotalPorMes`, TK-002), de modo que `historial-tabla.tsx` (IT-04) pueda mostrar ambos valores sin recalcularlos por su cuenta. AC-002 y AC-004 quedan calculados aquí; su presentación visual final la ajusta [TK-004](TK-004-ui-diseno-historial.md).
- [ ] **IT-03** — Implementar `useHistorial()` en `use-historial.ts`: gatea con `useHasHydrated()` (US-000 TK-002) devolviendo `estado: "cargando"` mientras no hidrató; luego lee `useProyectos()`, `useTareas()`, `useRegistrosDeTiempo()` (US-000 TK-003) e invoca `construirFilasHistorial`; devuelve `estado: "vacio"` si `filas.length === 0` (incluye el caso de datos corruptos que el adaptador de US-000 TK-002 no pudo parsear, dado que su `read()` devuelve `null`) o `estado: "con-datos"` en caso contrario, junto con `filas` y `registrosDescartados`.
- [ ] **IT-04** — Implementar `HistorialTabla` (`historial-tabla.tsx`): tabla HTML semántica (`<table>`) con columnas Fecha, Tarea (+ total acumulado de la Tarea), Proyecto (o "Sin proyecto" si `undefined`) y Duración; agrupa visualmente las filas por mes calendario (clave ya calculada en cada fila desde IT-02), mostrando una fila de subtítulo con el total de ese mes.
- [ ] **IT-05** — Implementar `HistorialVacio` (`historial-vacio.tsx`): recibe `mensaje?: string` (default `"Aún no registraste tiempo"`) y lo muestra sin filas fantasma ni valores `NaN`/`undefined` (TC-003); `use-historial.ts` (IT-03) le pasa un mensaje de aviso distinto cuando `registrosDescartados > 0` mientras `filas.length === 0`, cubriendo la degradación controlada exigida por TC-002.
- [ ] **IT-06** — Cubrir con pruebas Vitest + Testing Library (ADR-007): `construir-filas-historial.test.ts` (join correcto, exclusión de inválidos, Tarea/Proyecto huérfanos sin excepción), `use-historial.test.ts` (estados `cargando`/`vacio`/`con-datos` mockeando `useHasHydrated` y los selectores del store), `historial-tabla.test.tsx` (renderiza filas con Tarea/Proyecto/duración correctos) y `historial-vacio.test.tsx` (mensaje por defecto y mensaje de aviso).
- [ ] **IT-07** — Escribir `e2e/us-003-historial-lectura.spec.ts` (Playwright, ADR-008) cubriendo TC-001 (siembra 3 Registros en localStorage y verifica que los 3 aparecen sin omisiones ni duplicados), TC-002 (siembra un valor no parseable bajo la clave de Registros de Tiempo y verifica que la pantalla no crashea y no hay excepción no controlada en consola) y TC-003 (localStorage vacío y verifica el estado vacío sin `NaN`/`undefined`).
