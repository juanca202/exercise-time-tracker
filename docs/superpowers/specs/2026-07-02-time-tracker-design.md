# Diseño: Time Tracker (registro de tiempo por proyecto/tarea)

- Fecha: 2026-07-02
- Estado: Aprobado por el usuario, pendiente de plan de implementación
- Origen del requerimiento: [LB-001-time-tracker.md](https://github.com/HectorAndradeBayteq/taller-sdd/blob/master/etapa-2/greenfield/LB-001-time-tracker.md)
- Referencias de diseño: `DESIGN.md` (tema *Precision Focus*) y wireframes del laboratorio (Tareas, Nueva Tarea, Proyectos, Nuevo Proyecto, Historial)
- ADRs aplicables: [ADR-001](../../adr/ADR-001-app-router-only.md), [ADR-002](../../adr/ADR-002-tailwind-ui-styling.md), [ADR-003](../../adr/ADR-003-zustand-state-management.md), [ADR-004](../../adr/ADR-004-feature-based-architecture.md), [ADR-005](../../adr/ADR-005-unit-testing-strategy.md), [ADR-006](../../adr/ADR-006-base-ui-component-library.md)

## Objetivo

Implementar una herramienta de uso personal para registrar el tiempo dedicado a tareas dentro de proyectos, en tiempo real (temporizador) o de forma diferida (manual), visualizando totales acumulados por mes.

## Alcance

- Creación de Proyectos y Tareas (sin edición ni borrado — fuera de alcance).
- Registro de tiempo automatizado (Iniciar/Detener temporizador).
- Registro de tiempo manual.
- Visualización de horas acumuladas e historial de registros, con selector de periodo mensual.

## Reglas de negocio

- **Persistencia:** toda la información (Proyectos, Tareas, Registros) se persiste exclusivamente en `localStorage` del dispositivo (offline-first).
- **Estructura:** un Proyecto contiene muchas Tareas; una Tarea pertenece a un único Proyecto. Un Registro de Tiempo pertenece a una única Tarea.
- **Concurrencia (RN-03):** solo puede haber un (1) temporizador activo en toda la app. Si se inicia uno nuevo mientras hay otro activo, el sistema detiene automáticamente el anterior (calculando y persistiendo su registro) antes de iniciar el nuevo.
- **Integridad — temporizador (RN-04):** el registro generado guarda Fecha, Hora Inicio, Hora Fin y Duración (calculada). No se permiten duraciones ≤ 0.
- **Integridad — manual:** el registro guarda Fecha y Duración (ingresada). Hora Inicio/Fin no son obligatorias. No se permiten duraciones ≤ 0.
- **Cálculos:** el total de una Tarea es la suma de sus registros; el total de un Proyecto es la suma de los totales de sus tareas.

## Decisión arquitectónica: store único de dominio

Se evaluaron dos enfoques:

- **A — Store único (elegido):** un solo store de Zustand en `src/features/time-tracker/` con `projects`, `tasks`, `timeEntries` y `activeTimer`, persistido en una única clave de `localStorage`.
- **B — Tres features separadas** (`projects/`, `tasks/`, `time-entries/`) con stores independientes y una feature de `history/` que compone datos de las demás.

Se eligió **A** porque el dominio es un solo agregado: calcular el total de un proyecto requiere unir las tres entidades, y la regla RN-03 (cambio automático de temporizador) es una operación atómica entre tareas y registros. Separar en stores independientes añadiría fricción de coordinación sin beneficio real para este alcance. ADR-004 permite esta cohesión por capacidad de negocio (aquí, "seguimiento de tiempo" es una única capacidad).

## Modelo de datos

```ts
type Project = { id: string; name: string; description?: string; createdAt: string };
type Task = { id: string; projectId: string; name: string; createdAt: string };
type TimeEntry = {
  id: string;
  taskId: string;
  date: string;              // YYYY-MM-DD
  startTime?: string;         // ISO, solo en registros de temporizador
  endTime?: string;           // ISO, solo en registros de temporizador
  durationSeconds: number;    // capturado en creación, nunca recalculado
  source: "timer" | "manual";
};
type ActiveTimer = { taskId: string; startedAt: string } | null; // ISO
```

- Persistencia como un único blob JSON bajo la clave `time-tracker:v1`: `{ projects, tasks, timeEntries, activeTimer }`, cada colección como `Record<id, Entity>` (excepto `activeTimer`).
- `durationSeconds` nunca se deriva en lectura; los totales (tarea, proyecto, periodo) sí se calculan siempre en lectura, no se guardan de forma redundante.
- IDs generados con `crypto.randomUUID()`.

## Estado y persistencia (Zustand)

Store en `src/features/time-tracker/store/time-tracker-store.ts`, usando el middleware `persist` de Zustand con adaptador de `localStorage` (clave `time-tracker:v1`).

**Acciones:**
- `createProject({ name, description? })` — valida `name` no vacío.
- `createTask({ projectId, name })` — valida `name` no vacío y `projectId` existente.
- `startTimer(taskId)` — si hay `activeTimer` en otra tarea, primero lo detiene (calcula duración, crea `TimeEntry` con `source: "timer"`), luego activa el nuevo.
- `stopTimer()` — calcula duración desde `activeTimer.startedAt` hasta `now`; si es `> 0` crea el `TimeEntry` y limpia `activeTimer`; si es `0` se descarta sin crear registro.
- `addManualEntry({ taskId, date, durationSeconds })` — valida `taskId` existente, `date` presente y `durationSeconds > 0`.

**Selectores derivados** (funciones puras en `lib/selectors.ts`, fuera del store): `getTaskTotal(taskId)`, `getProjectTotal(projectId)`, `getEntriesForPeriod(year, month)`, `getProjectTotalsForPeriod(year, month)`. Se mantienen como funciones puras — testeables sin montar el store — y evitan guardar totales redundantes en el estado persistido.

**Multi-pestaña:** fuera de alcance la sincronización en vivo entre pestañas (sin listener de `storage`). Cada pestaña relee `localStorage` al montar; con dos pestañas activas, la última escritura gana al recargar. Aceptable para una herramienta de uso personal.

## Rutas y páginas

```
src/app/
  layout.tsx          # Root layout: fonts, providers, <AppShell> con sidebar
  page.tsx             # "/" → Vista Tareas (dashboard, default)
  projects/page.tsx    # "/projects" → Vista Proyectos
  history/page.tsx     # "/history" → Vista Historial de Registros
```

- `AppShell` (sidebar con los 3 links) vive en `src/components/app-shell/` (agnóstico de dominio), se renderiza en el layout raíz envolviendo `children`, y resalta el link activo con `usePathname()`.
- Cada `page.tsx` es un Server Component mínimo que renderiza el componente de pantalla real desde la feature (Client Component, porque usa el store).
- Sin rutas dinámicas: los wireframes no muestran vista de detalle de proyecto.

## Estructura de features y componentes

```
src/features/time-tracker/
  model/
    types.ts
  store/
    time-tracker-store.ts
  lib/
    id.ts
    duration.ts              # formateo HH:MM:SS / "XXh XXm", parseo de duración manual
    period.ts                # helpers de mes/periodo
    selectors.ts
  components/
    timer-panel/              # Display en vivo + Iniciar/Detener Sesión
    manual-entry-form/
    recent-entries-list/      # "Tareas Recientes"
    new-task-modal/           # Base UI Dialog
    project-list/
    new-project-modal/        # Base UI Dialog
    history-view/
    tasks-view.tsx             # compone timer-panel + manual-entry-form + recent-entries-list
    projects-view.tsx          # compone project-list + new-project-modal
  testing/
    object-mothers.ts          # aProject(), aTask(), aTimeEntry(), aStoreState()

src/components/
  app-shell/                   # Sidebar + navegación
```

- Los `page.tsx` importan `tasks-view.tsx`, `projects-view.tsx`, `history-view.tsx`.
- `new-task-modal` vive en la feature (lógica de dominio), no en `src/components/`.
- Todo lo de `components/` de la feature son Client Components (`"use client"`).

## Comportamiento por pantalla

**Vista Tareas**
- **Timer Panel:** con `activeTimer`, muestra tarea, proyecto, hora de inicio y reloj en vivo (`HH:MM:SS`, tipografía monoespaciada `display-time`) actualizado cada segundo vía `setInterval` en un `useEffect` local — no escribe al store en cada tick, solo recalcula `now - startedAt`. Sin `activeTimer`, muestra estado vacío ("Ningún temporizador activo, inicia uno desde una tarea").
- **Iniciar timer:** cada fila de tarea tiene un botón ▷ que llama `startTimer(taskId)`.
- **Entrada Manual:** select Proyecto/Tarea (agrupado por proyecto), Fecha (default hoy), Duración (`HH:MM`, parseada y validada `> 0`). "Guardar Registro" llama `addManualEntry`.
- **Tareas Recientes:** las 5 `TimeEntry` más recientes (orden descendente por fecha/creación), con tarea, proyecto, duración formateada y tiempo relativo desde que terminó ("hace 2h", "Ayer"). Representan **registros de tiempo recientes**, no un estado de "tarea completada" (el requerimiento no define ese concepto).

**Modal Nueva Tarea** — Base UI `Dialog`; campos Proyecto (select, requerido) y Nombre (requerido). Sin proyectos existentes, el select se deshabilita con CTA para crear uno primero.

**Vista Proyectos** — grid de cards (nombre, descripción, total vía `getProjectTotal`) + card "Crear Nuevo Proyecto" que abre el modal.

**Modal Nuevo Proyecto** — Nombre (requerido) y Descripción (opcional, textarea).

**Vista Historial** — selector de periodo mensual con flechas prev/next (navegación libre), cards de total por proyecto para el mes activo, tabla (Fecha/Proyecto/Tarea/Duración) descendente por fecha, y footer con conteo de registros, conteo de proyectos distintos y total de horas. Todo derivado de `getEntriesForPeriod`/`getProjectTotalsForPeriod`.

## Sistema de diseño (DESIGN.md → Tailwind)

- Se copia `DESIGN.md` (tema *Precision Focus*) a la raíz del repo como referencia versionada.
- El bloque YAML (colores, tipografía, radios, espaciado) se traduce a variables CSS + `@theme inline` en `globals.css`, reemplazando los tokens genéricos actuales (`--background`, `--foreground`) por los de Precision Focus (`--color-primary`, `--color-secondary`, `--color-surface`, etc.), y se agregan las familias `Inter` y `JetBrains Mono` vía `next/font`.
- Duraciones y timestamps siempre usan la fuente monoespaciada (`label-mono`/`font-mono`) para alineación tabular.
- Se elimina el bloque `prefers-color-scheme: dark` actual — DESIGN.md no define modo oscuro, solo la paleta Precision Focus.
- Componentes interactivos (botones, inputs, selects, dialogs) usan Base UI (ADR-006) como primitiva sin estilo + clases Tailwind aplicando los tokens de DESIGN.md.

## Validaciones y casos borde

- Nombre de Proyecto y de Tarea obligatorios (no vacíos tras `trim`); Tarea requiere `projectId` existente. Sin edición ni borrado en el alcance.
- Duración manual requerida, debe parsear a `> 0` segundos, formato `HH:MM`; inválido o `00:00` se rechaza con mensaje visible.
- Fecha manual requerida, default hoy.
- Cambio automático de timer (RN-03): transparente para el usuario, sin confirmación.
- Duración de timer = 0: se descarta sin crear registro.
- Estados vacíos: sin proyectos → CTA para crear el primero; sin tareas recientes → mensaje vacío; historial sin registros en el mes → cards y tabla en estado vacío.

## Plan de pruebas (ADR-005)

- Object Mothers en `testing/object-mothers.ts`: `aProject(overrides)`, `aTask(overrides)`, `aTimeEntry(overrides)`, `aStoreState(overrides)`.
- **Store:** casos AAA para `createProject`/`createTask` (validaciones), `startTimer`/`stopTimer` (incluyendo cambio automático RN-03 y duración ≤0 descartada, con `vi.useFakeTimers()`), `addManualEntry`.
- **Selectores:** `getTaskTotal`, `getProjectTotal`, `getEntriesForPeriod` con datos de distintos meses/proyectos.
- **Componentes:** Testing Library + `user-event` para validación inline de formularios y para el reloj en vivo del timer panel (fake timers).
- Cobertura objetivo ≥80% de ramas, priorizando store/selectores/validaciones sobre UI puramente presentacional.

## Fuera de alcance

- Edición y borrado de Proyectos/Tareas/Registros.
- Sincronización de temporizador entre pestañas del navegador en tiempo real.
- Vista de detalle de proyecto (drill-down).
- Autenticación, backend o sincronización remota (offline-first exclusivo con `localStorage`).
- Modo oscuro.
