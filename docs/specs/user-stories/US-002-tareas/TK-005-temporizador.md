# TK-005: Temporizador de Tarea

**Estado**: Ready
**Historia**: [US-002](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Implementar el control del temporizador de una Tarea: iniciar un temporizador para una Tarea específica desde el listado (ícono ▷), guardando localmente el estado "En Ejecución", la hora de inicio y el identificador de la Tarea; garantizar un único temporizador activo a la vez en toda la aplicación deteniendo automáticamente el anterior (calculando y persistiendo su Registro de Tiempo) antes de iniciar uno nuevo; permitir detener el temporizador activo calculando la Duración (Hora Fin − Hora Inicio), validando que sea mayor que cero, persistiendo el Registro de Tiempo de forma inmediata, mostrando en todo momento el estado del temporizador y la Tarea asociada, y completando el inicio y la detención en menos de 1 segundo.

## Dependencias

- `src/shared/domain/types.ts` — tipos `TemporizadorActivo`, `RegistroDeTiempo`, `Tarea`.
- `src/shared/store/app-store.ts` — `crearRegistroDeTiempo`, `useTareas()` (para resolver el nombre de la Tarea asociada al mostrar el estado).
- `src/shared/persistence/` — `AdaptadorPersistencia<T>`, `crearAdaptadorLocalStorage`, `useHasHydrated()`; reutilizados para construir el store dedicado de esta tarea (ver Plan, IT-01).

## Referencias

- **Arquitectura:** [ADR-004: Uso de Zustand para manejo de estado](../../../adr/ADR-004-uso-de-zustand.md) — justifica un store adicional de Zustand dedicado al Temporizador Activo.
- **Arquitectura:** [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) — el store del temporizador vive en `src/features/tareas/`, no en el store compartido de US-000 (ver IT-01, Decisión técnica).
- **Arquitectura:** [ADR-012: Separación entre el store raíz (CRUD crudo) y stores de feature (estado de negocio)](../../../adr/ADR-012-separacion-store-raiz-y-stores-de-feature.md) — formaliza la decisión de IT-01: la máquina de estados del Temporizador Activo es estado de negocio propio de esta feature y por eso vive en un store dedicado, no en el store raíz. Reforzado por la fitness function de ese ADR.
- **Diseño:** [Figma - Exercise · Time Tracker (estado del temporizador en el panel principal)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker)

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/
        └── tareas/
            ├── store/
            │   └── + temporizador-store.ts        # store Zustand dedicado y persistido para TemporizadorActivo (Decisión técnica, IT-01)
            ├── domain/
            │   ├── + validar-duracion.ts           # valida que una Duración (minutos) sea > 0 (BR-04); reutilizado por TK-006
            │   └── + calcular-duracion-minutos.ts   # calcula minutos enteros entre Hora Inicio y Hora Fin
            ├── hooks/
            │   └── + useTemporizador.ts             # expone temporizadorActivo, iniciar(tareaId), detener()
            └── components/
                └── + WidgetTemporizador.tsx          # UI: estado activo/inactivo y Tarea asociada (AC-011)
```

## Plan de implementación

- [ ] **IT-01** — Decisión técnica: persistencia del Temporizador Activo. Crear `temporizador-store.ts` como store Zustand dedicado a esta feature (no una extensión de `src/shared/store/app-store.ts`), persistido mediante un `AdaptadorPersistencia<TemporizadorActivo | null>` propio construido con `crearAdaptadorLocalStorage` (US-000), y gateado por `useHasHydrated()` antes de leerse.
      Se decide un store dedicado — en vez de ampliar el store compartido — porque BR-01 de US-000 exige que el store raíz exponga únicamente CRUD crudo sin lógica propia de cada historia funcional, y porque AC-010 de US-000 exige que ninguna historia funcional necesite modificar el store compartido para agregar su propia lógica; la máquina de estados de esta tarea (exclusividad, auto-stop) es lógica de negocio propia de US-002. Decisión formalizada en [ADR-012](../../../adr/ADR-012-separacion-store-raiz-y-stores-de-feature.md).
- [ ] **IT-02** — Definir en `useTemporizador.ts` (sobre `temporizador-store.ts`) los dos estados y sus transiciones:
      Estado `Inactivo` (`temporizadorActivo === null`) y estado `Activo(tareaId)` (`temporizadorActivo = { tareaId, inicio }`). `iniciar(tareaId)` desde `Inactivo` escribe `{ tareaId, inicio: new Date().toISOString() }` y pasa a `Activo(tareaId)` (AC-006, [TC-007](./test-cases/TC-007-iniciar-temporizador-happy.md)).
- [ ] **IT-03** — Implementar la transición de auto-stop: `iniciar(tareaId')` desde `Activo(tareaId)` con `tareaId' !== tareaId` ejecuta primero la transición de `detener()` (IT-04) sobre el temporizador anterior y, solo si se completa, inicia el nuevo con `tareaId'` (BR-03/AC-007, [TC-008](./test-cases/TC-008-auto-stop-temporizador-happy.md)).
      `iniciar(tareaId)` desde `Activo(tareaId)` con la misma Tarea no se contempla en este alcance: [TK-004](./TK-004-ui-pantalla-tareas.md) no expone la acción de iniciar sobre la Tarea que ya tiene el temporizador activo, sino la acción de detener.
- [ ] **IT-04** — Implementar la transición `detener()`: calcula `duracionMinutos` con `calcular-duracion-minutos.ts` (Hora Fin − Hora Inicio, redondeado a minutos enteros), valida con `validar-duracion.ts` que sea mayor que cero (AC-009/BR-04, [TC-010](./test-cases/TC-010-duracion-cero-al-detener-limite.md)).
      Si es válida: invoca `useAppStore().crearRegistroDeTiempo({ tareaId, fecha, duracionMinutos, origen: "temporizador" })` (persistencia inmediata, AC-008/AC-010, [TC-009](./test-cases/TC-009-detener-temporizador-happy.md), [TC-011](./test-cases/TC-011-persistencia-registro-temporizador-happy.md)) y limpia `temporizador-store.ts` a `null`. Si no es válida: no persiste el Registro de Tiempo y mantiene el estado `Activo` sin cambios.
- [ ] **IT-05** — Crear `WidgetTemporizador.tsx`: muestra de forma visible el estado (activo/inactivo) y la Tarea asociada (`useTareas()` para resolver el nombre), replicando la "Current Activity Card" del nodo `1:1374` (`1:1394`–`1:1412`): tarjeta blanca (`border #c6c6ce`, `rounded-sm` 2px, sombra, contenido centrado, padding 33px) que en estado Activo muestra: la fase/nombre del Proyecto en mayúsculas (JetBrains Mono Medium 12px tracking 0.6px `#006c4b`/DESIGN.md `secondary`), el nombre de la Tarea como título (Inter Semibold 32px `#182442`, DESIGN.md `headline-lg`), el texto "Iniciado a las {hora} {AM|PM}" (Inter Regular 16px `#45464e`) con ícono de reloj, el cronómetro en formato `HH:MM:SS` (JetBrains Mono Medium 64px, tracking -3.2px, `#182442`, leading 96px), y el botón "Detener Sesión" (`bg #ffdad6`/DESIGN.md `error-container`, texto `#93000a`/DESIGN.md `on-error-container` bold 16px, `rounded-sm` 2px, px32 py12, con ícono cuadrado).
      Cubre AC-011; ver [TC-012](./test-cases/TC-012-estado-temporizador-visible-happy.md).
- [ ] **IT-06** — Verificar que `iniciar()` y `detener()` son operaciones síncronas de escritura local (Zustand + `localStorage`, sin llamadas de red ni operaciones asíncronas en la ruta crítica), de modo que ambas se completen en menos de 1 segundo desde la acción del usuario (AC-012, [TC-013](./test-cases/TC-013-rendimiento-temporizador-happy.md)) por construcción.

## Observaciones

Sin pendientes documentados. La decisión de dónde y cómo persistir el Temporizador Activo (IT-01) queda resuelta y documentada en este TK.

- Acceso confirmado al prototipo Figma vía MCP (`fileKey: K6uQLWg82KsCSpHJVXSf6L`, nodo `1:1374`); las specs visuales de la "Current Activity Card" (IT-05) quedaron incorporadas en el Plan de implementación.
