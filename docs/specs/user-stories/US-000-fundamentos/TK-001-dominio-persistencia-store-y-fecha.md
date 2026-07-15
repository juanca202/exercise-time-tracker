# TK-001: Dominio, persistencia local, store raíz y helper de fecha compartidos

**Estado**: Ready
**Historia**: [US-000](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Definir en módulos compartidos: (1) los tipos de dominio de `Project`, `Task`, `TimeEntry` y `ActiveTimer` con todos sus campos derivados de los requisitos funcionales (SRS-001 RF-001 a RF-013), sin campos placeholder ni marcados como "por definir"; (2) un adaptador de persistencia local genérico (lectura, escritura y suscripción, más campo de versión de esquema), un indicador de hidratación que gatee toda lectura de estado persistido, y una función que solicite almacenamiento persistente al navegador (best-effort) al cargar la aplicación; (3) un store raíz compartido que exponga operaciones CRUD crudas (crear, actualizar, listar) por entidad sobre ese adaptador, sin validación ni reglas de negocio propias de cada historia funcional; (4) el cálculo del mes calendario de un Registro de Tiempo en un único módulo compartido; y (5) los contratos y funciones puras de cálculo de totales de tiempo (`TaskTotal`, `ProjectTotal`, `MonthTotal` e `indexById`/`isValidTimeEntry`/`calculateTotalByTask`/`calculateTotalByProject`/`calculateTotalByMonth`) — de modo que Proyectos, Tareas e Historial de registros consuman estos módulos de forma idéntica desde su primer commit, sin que ninguna de esas historias dependa directamente del código de otra (ADR-005) para mostrar totales de tiempo.

## Dependencias

- TypeScript 5 (modo `strict`) — los tipos se definen sin `any` ni aserciones, aprovechando el chequeo estricto del compilador.
- Web Storage API (`window.localStorage`) — mecanismo de almacenamiento local concreto del adaptador; no requiere librerías externas.
- Storage API del navegador (`navigator.storage.persist()`) — solicitud de almacenamiento persistente best-effort.
- React (`useState`, `useEffect`) — implementación del hook de hidratación.
- Zustand (`zustand`, `zustand/middleware`) — creación del store y persistencia.

## Referencias

- **Arquitectura:** [ADR-004: Uso de Zustand para manejo de estado](../../../adr/ADR-004-uso-de-zustand.md), [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) (ubicación en módulo compartido; los contratos y funciones de totales viven aquí — y no en `features/historial/` — precisamente porque ADR-005 exige promover a un módulo compartido explícito todo código usado por más de una feature, como es el caso de `calculateTotalByProject`/`calculateTotalByMonth`, consumidos también por Proyectos y Tareas), [ADR-006: Documentación de código con TSDoc](../../../adr/ADR-006-documentacion-con-tsdoc.md) (documentación de los tipos y funciones públicas), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md), [ADR-011: Persistencia local con Web Storage API (localStorage)](../../../adr/ADR-011-persistencia-local-con-web-storage-api.md) (formaliza la elección de `window.localStorage`; ninguna otra pieza del código puede acceder a `localStorage` fuera de este módulo, reforzado por la fitness function de ese ADR), [ADR-013: Convenciones de código según la Google TypeScript Style Guide](../../../adr/ADR-013-convenciones-de-codigo-google-style-guide.md) (`TaskTotal`/`ProjectTotal`/`MonthTotal` como interfaces, no alias de tipo).
- **Documentación técnica:** [SRS-001: Especificación de Requisitos - Time Tracker](../../requirements/SRS-001-timetracker-app/README.md) (RF-001 a RF-013, restricción 2.4) — fuente de los campos de cada tipo.
- **Investigación:** [RS-001 de US-003: Regla de asignación de mes para un Registro que cruza la medianoche de fin de mes](../US-003-historial-de-registros/research/RS-001-regla-cruce-de-mes.md) — resuelve el criterio que implementa `calculateTotalByMonth` (asignación por fecha/Hora de Inicio, sin prorrateo).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── shared/
        ├── domain/
        │   └── + types.ts   # Project, Task, TimeEntry, ActiveTimer
        ├── persistence/
        │   ├── + types.ts                        # interfaz PersistenceAdapter<T> (read/write/subscribe/version)
        │   ├── + local-storage-adapter.ts         # createLocalStorageAdapter<T>() sobre window.localStorage
        │   ├── + local-storage-adapter.test.ts    # cobertura de read/write/subscribe y versión de esquema
        │   ├── + use-has-hydrated.ts              # hook useHasHydrated(): boolean — gate de hidratación SSR/CSR
        │   ├── + use-has-hydrated.test.ts
        │   ├── + request-persistent-storage.ts    # requestPersistentStorage(): Promise<boolean>
        │   ├── + request-persistent-storage.test.ts
        │   └── + storage-bootstrapper.tsx         # client component que invoca requestPersistentStorage() al montar
        ├── store/
        │   ├── + app-store.ts        # useAppStore: estado + CRUD crudo (crear/actualizar) por entidad
        │   └── + app-store.test.ts   # cobertura de crear/actualizar/listar por entidad
        ├── date/
        │   ├── + get-calendar-month.ts        # getCalendarMonth(): clave "YYYY-MM" a partir de TimeEntry.date
        │   └── + get-calendar-month.test.ts
        └── reports/
            ├── + types.ts                     # interfaces TaskTotal, ProjectTotal, MonthTotal (contratos compartidos, ADR-013)
            ├── + calculate-totals.ts          # indexById, isValidTimeEntry, calculateTotalByTask/Project/Month
            └── + calculate-totals.test.ts
```

## Plan de implementación

- [ ] **IT-01** — Definir `Project` (`id: string`, `name: string`, `description?: string`).
      Nombre obligatorio, descripción opcional, según RF-001/RF-002.
- [ ] **IT-02** — Definir `Task` (`id: string`, `projectId: string`, `name: string`).
      Según RF-003/RF-004 y la restricción 2.4 (una Tarea pertenece obligatoriamente a un único Proyecto).
- [ ] **IT-03** — Definir `TimeEntry` (`id: string`, `taskId: string`, `date: string`, `durationMinutes: number`, `source: "timer" | "manual"`).
      `date` en formato ISO 8601 (`YYYY-MM-DD`), consumida por el helper de mes calendario (IT-20). `source` distingue el flujo automatizado (RF-005–RF-009) del manual (RF-011). Según RF-006, RF-009, RF-011 y la restricción 2.4 (un Registro pertenece obligatoriamente a una única Tarea; duración > 0 por RF-010/RF-013).
- [ ] **IT-04** — Definir `ActiveTimer` (`taskId: string`, `start: string`).
      `start` en formato ISO 8601 (datetime). Según RF-005–RF-008 y la restricción 2.4 (un único temporizador activo a la vez en toda la aplicación). Este módulo solo define el tipo; su ausencia (ningún temporizador corriendo) se modela como `null` en quien lo consuma — el almacenamiento del temporizador activo queda fuera de alcance de esta historia (ver Observaciones de US-000).
- [ ] **IT-05** — Documentar cada tipo de dominio y cada campo no evidente por su nombre con TSDoc, según ADR-006.
- [ ] **IT-06** — Definir la interfaz `PersistenceAdapter<T>` en `src/shared/persistence/types.ts` con `version: number`, `read(): T | null`, `write(data: T): void`, `subscribe(listener: (data: T | null) => void): () => void`.
- [ ] **IT-07** — Implementar `createLocalStorageAdapter<T>(key: string, version: number): PersistenceAdapter<T>` sobre `window.localStorage`, serializando un envoltorio `{ version, data }` en JSON; `read()` devuelve `null` si no hay dato guardado o si su `version` no coincide con la esperada.
      Mecanismo formalizado en [ADR-011](../../../adr/ADR-011-persistencia-local-con-web-storage-api.md): `window.localStorage` (Web Storage API nativa del navegador) como mecanismo concreto, con volumen de datos esperado bajo (SRS-001 RP-003: ~1000 registros) y sin dependencia nueva.
- [ ] **IT-08** — Implementar `subscribe(listener)` escuchando el evento `storage` de `window`, filtrado por la `key` del adaptador, para sincronizar datos entre pestañas del navegador; devolver una función de baja (`unsubscribe`) que remueve el listener.
- [ ] **IT-09** — Implementar `useHasHydrated()` en `use-has-hydrated.ts`: estado `useState(false)` que pasa a `true` dentro de un `useEffect` sin dependencias, de modo que el primer render del cliente coincida con el del servidor antes de leer datos persistidos (AC-004).
- [ ] **IT-10** — Implementar `requestPersistentStorage()` en `request-persistent-storage.ts`, invocando `navigator.storage?.persist?.()` de forma best-effort (no lanza si la API no existe o la promesa se rechaza).
- [ ] **IT-11** — Implementar `StorageBootstrapper` (client component, sin salida visual) en `storage-bootstrapper.tsx`, que invoca `requestPersistentStorage()` en un `useEffect` al montar. [TK-002: Layout, navegación, tema de Tailwind y rutas placeholder](TK-002-layout-navegacion-y-rutas-placeholder.md) lo monta en el layout raíz.
- [ ] **IT-12** — Cubrir con pruebas Vitest + Testing Library (ADR-007): lectura/escritura/versión del adaptador (incluyendo dato con versión distinta a la esperada), comportamiento de `useHasHydrated` antes y después del montaje, y que `requestPersistentStorage` no lanza cuando `navigator.storage` no existe.
- [ ] **IT-13** — Crear `useAppStore` con Zustand (`create`) y el middleware `persist`, implementando su opción `storage` (`PersistStorage`) como un adaptador delgado que delega `getItem`/`setItem` en `read()`/`write()` del `PersistenceAdapter` creado con `createLocalStorageAdapter<AppStoreState>("time-tracker/app-store", 1)` (IT-07).
      El campo `version` del adaptador actúa como versión de esquema del store (AC-002).
- [ ] **IT-14** — Definir el estado `{ projects: Project[]; tasks: Task[]; timeEntries: TimeEntry[] }`, con arrays vacíos como valor inicial antes de hidratar.
- [ ] **IT-15** — Exponer `createProject(project: Project): void`, `updateProject(id: string, changes: Partial<Omit<Project, "id">>): void` y el selector `useProjects(): Project[]` (lee `projects` del store) — sin validar campos ni aplicar reglas de negocio propias de una historia funcional (BR-01).
- [ ] **IT-16** — Exponer `createTask(task: Task): void`, `updateTask(id: string, changes: Partial<Omit<Task, "id">>): void` y el selector `useTasks(): Task[]`, con las mismas restricciones que IT-15.
- [ ] **IT-17** — Exponer `createTimeEntry(entry: TimeEntry): void`, `updateTimeEntry(id: string, changes: Partial<Omit<TimeEntry, "id">>): void` y el selector `useTimeEntries(): TimeEntry[]`, con las mismas restricciones que IT-15.
- [ ] **IT-18** — Suscribirse al adaptador de persistencia (`subscribe` de IT-08) para re-sincronizar el estado del store cuando los datos cambian en otra pestaña del navegador.
- [ ] **IT-19** — Cubrir con pruebas Vitest (ADR-007) cada operación cruda (`create*`, `update*`, selectores `use*`) por entidad, verificando que ninguna aplica validación ni transformación adicional sobre los datos recibidos.
- [ ] **IT-20** — Implementar `getCalendarMonth(entry: Pick<TimeEntry, "date">): string`, que devuelve la clave del mes calendario en formato `"YYYY-MM"` a partir de `entry.date` (`"YYYY-MM-DD"`).
- [ ] **IT-21** — Documentar con TSDoc (ADR-006) el formato de entrada y salida, y que la función es pura: interpreta `date` como fecha calendario (no como instante), sin depender de la zona horaria del entorno de ejecución.
- [ ] **IT-22** — Cubrir con pruebas Vitest (ADR-007): primer día del mes, último día del mes y cambio de año (`"2026-12-31"` → `"2026-12"`, `"2027-01-01"` → `"2027-01"`).
- [ ] **IT-23** — Definir en `src/shared/reports/types.ts` las interfaces `TaskTotal { taskId: string; totalMinutes: number }`, `ProjectTotal { projectId: string; totalMinutes: number }` y `MonthTotal { month: string; totalMinutes: number }` (ADR-013: interfaces en vez de alias de tipo), como contratos compartidos que Proyectos, Tareas e Historial de registros consumen para mostrar totales de tiempo sin depender directamente unas de otras (ADR-005).
- [ ] **IT-24** — Implementar `isValidTimeEntry(entry: TimeEntry): boolean` en `src/shared/reports/calculate-totals.ts`: verdadero solo si `durationMinutes` es un número finito mayor a 0 (excluye negativos, `NaN` y valores no numéricos) y `date` cumple el formato `"YYYY-MM-DD"` y es una fecha calendario real (round-trip contra `Date`, excluye valores como `"2026-13-45"`).
- [ ] **IT-25** — Implementar `indexById<T extends { id: string }>(items: T[]): Map<string, T>`, utilidad genérica de indexación por `id` en O(n), reutilizada por las tres funciones de agregación de este módulo y por Historial de registros para el join de cada fila con su Tarea/Proyecto.
- [ ] **IT-26** — Implementar `calculateTotalByTask(entries: TimeEntry[], tasks: Task[]): TaskTotal[]`: para cada Tarea de `tasks` (incluidas las que no tienen ningún Registro asociado), suma las `durationMinutes` de los registros de esa Tarea que cumplen `isValidTimeEntry`; una Tarea sin registros válidos devuelve `0` (nunca `NaN`/`undefined`).
- [ ] **IT-27** — Implementar `calculateTotalByProject(entries: TimeEntry[], tasks: Task[], projects: Project[]): ProjectTotal[]`: reutiliza `calculateTotalByTask` e `indexById(tasks)` para resolver el `projectId` de cada Tarea; suma por Proyecto los totales de sus Tareas; una Tarea cuyo `projectId` no exista en `projects` (huérfana) se excluye del total de cualquier Proyecto sin interrumpir el cálculo de los Proyectos válidos; un Proyecto sin Tareas con registros devuelve `0`.
- [ ] **IT-28** — Implementar `calculateTotalByMonth(entries: TimeEntry[]): MonthTotal[]`: filtra por `isValidTimeEntry`, agrupa por `getCalendarMonth(entry)` (IT-20 — ya aplica la regla de RS-001 al basarse en `entry.date`, que para un Registro del temporizador corresponde a su Hora de Inicio) y suma `durationMinutes` por clave `"YYYY-MM"`.
- [ ] **IT-29** — Documentar con TSDoc (ADR-006) las funciones exportadas de `calculate-totals.ts` y el criterio de exclusión de `isValidTimeEntry`, dejando explícita en el comentario de `calculateTotalByMonth` la referencia a RS-001 (asignación por fecha/Hora de Inicio, sin prorrateo entre meses).
- [ ] **IT-30** — Cubrir con pruebas Vitest (ADR-007) `calculate-totals.test.ts`: total por Tarea (happy, duración inválida, Tarea sin registros), total por Proyecto (happy, Tarea huérfana, Proyecto sin registros) y total por mes (happy, fecha inválida, cruce de medianoche de fin de mes: inicio `2026-07-31`, 120 min íntegros en julio, 0 en agosto).

## Observaciones

Sin pendientes documentados.
