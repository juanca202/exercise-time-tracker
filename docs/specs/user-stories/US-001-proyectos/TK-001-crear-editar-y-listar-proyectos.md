# TK-001: Crear, editar y listar Proyectos

**Estado**: Ready
**Historia**: [US-001](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Permitir crear un Proyecto mediante un modal "Nuevo Proyecto" (componente controlado) que solicita un Nombre obligatorio y una Descripción opcional, bloqueando el guardado y mostrando el error junto al campo Nombre cuando este está vacío o contiene solo espacios; reutilizar ese mismo modal en modo edición ("Editar Proyecto") precargado con los datos del Proyecto seleccionado; y mostrar el listado de todos los Proyectos creados con una tarjeta por Proyecto (Nombre, Descripción, Tiempo registrado y acción "Editar") y un estado vacío sin errores cuando no existe ninguno, leyendo el store raíz compartido solo después de hidratar el cliente.

## Dependencias

- [TK-001: Dominio, persistencia local, store raíz y helper de fecha compartidos (US-000)](../US-000-fundamentos/TK-001-dominio-persistencia-store-y-fecha.md) — tipo `Project` (`id`, `name`, `description?`); `useAppStore` expone `createProject(project: Project): void` y `updateProject(id: string, changes: Partial<Omit<Project, "id">>): void` sin validación (la validación de Nombre obligatorio, BR-01, es responsabilidad de esta tarea); `useHasHydrated()` como gate obligatorio antes de leer `useProjects()` para evitar hydration-mismatch; selectores `useProjects(): Project[]`, `useTasks(): Task[]`, `useTimeEntries(): TimeEntry[]`; contrato `ProjectTotal` y función `calculateTotalByProject` (`src/shared/reports/`) para el "Tiempo registrado" de cada tarjeta — consumidos directamente desde el módulo compartido de US-000, sin depender de `features/historial/` (ADR-005).
- `@base-ui/react/dialog` — primitivas `Root`, `Portal`, `Backdrop`, `Popup`, `Title`, `Close` para el modal (sin `Trigger` propio: el modal es controlado por `open`/`onOpenChange` desde quien lo invoca, para reutilizarse tanto desde el disparador "Nuevo Proyecto" como desde la acción "Editar" de cada tarjeta).
- `@base-ui/react/field` — primitivas `Root`, `Label`, `Control`, `Error` para el campo Nombre y su mensaje de error.
- Web Crypto API (`crypto.randomUUID()`) — generación del `id` del Proyecto antes de invocar `createProject`.

## Referencias

- **Arquitectura:** [ADR-002: Uso de Tailwind CSS](../../../adr/ADR-002-uso-de-tailwind-css.md), [ADR-003: Uso de Base UI](../../../adr/ADR-003-uso-de-base-ui.md), [ADR-004: Uso de Zustand](../../../adr/ADR-004-uso-de-zustand.md), [ADR-005: Arquitectura feature-based](../../../adr/ADR-005-arquitectura-feature-based.md) (el "Tiempo registrado" de `ProjectCard` se calcula con `calculateTotalByProject` del módulo compartido de US-000, no importando nada de `features/historial/`), [ADR-006: Documentación con TSDoc](../../../adr/ADR-006-documentacion-con-tsdoc.md), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md).
- **Diseño:** [Figma - Exercise · Time Tracker, diálogo "Nuevo Proyecto"](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L) (`nodeId 1:1642`) — confirma etiquetas de campo "NOMBRE DEL PROYECTO" y "DESCRIPCIÓN", placeholders "ej. Estrategia de Marketing Q4" y "Define los objetivos primarios...", y botones "Cancelar" / "Crear Proyecto"; el prototipo no incluye una pantalla o modal específico de "Editar Proyecto" (ver Observaciones de [US-001](./README.md)), de ahí que la edición reutilice el mismo modal con título/etiqueta condicionados por `mode`. La fidelidad visual concreta (colores, tipografía, espaciado) se resuelve en [TK-003](TK-003-ui-diseno-proyectos.md), que además aplica los tokens de `DESIGN.md`.

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── app/
    │   └── proyectos/
    │       └── ~ page.tsx                       # reemplaza el placeholder "Próximamente" (US-000 TK-002) por el encabezado "Proyectos", el disparador "Nuevo Proyecto" y <ProjectsList />
    └── features/
        └── proyectos/
            ├── components/
            │   ├── + project-modal.tsx          # Dialog controlado (open/onOpenChange), modo create/edit
            │   ├── + project-modal.test.tsx
            │   ├── + project-card.tsx           # tarjeta: Nombre, Descripción, Tiempo registrado y acción "Editar"
            │   ├── + project-card.test.tsx
            │   ├── + projects-list.tsx          # grid de ProjectCard + estado vacío; gatea useProjects() detrás de useHasHydrated()
            │   └── + projects-list.test.tsx
            └── hooks/
                ├── + use-project-form.ts        # estado del formulario (name/description) + validación BR-01 (Nombre obligatorio, trim)
                └── + use-project-form.test.ts
```

## Plan de implementación

- [ ] **IT-01** — Implementar `useProjectForm` (`use-project-form.ts`): estado controlado `{ name, description }`, acepta valores iniciales opcionales (`name`, `description` de un `initialProject?: Project`) para precargar el formulario en modo edición, y una función `validate()` que aplica BR-01 recortando espacios (`trim()`) y considerando inválida una cadena vacía o de solo espacios (TC-003, TC-004, TC-011, TC-012), fijando un `nameError` legible.
- [ ] **IT-02** — Implementar `ProjectModal` (`project-modal.tsx`) como componente controlado (`open: boolean`, `onOpenChange: (open: boolean) => void`, `mode: "create" | "edit"` por defecto `"create"`, `initialProject?: Project`) sobre `Dialog` de Base UI (`Root`, `Portal`, `Backdrop`, `Popup`, `Title`, `Close`): título y etiqueta del botón principal "Nuevo Proyecto"/"Crear Proyecto" en modo creación, o "Editar Proyecto" en modo edición (AC-005, TC-009); campo Nombre con etiqueta "NOMBRE DEL PROYECTO" y placeholder "ej. Estrategia de Marketing Q4" (`Field` de Base UI, obligatorio, muestra `nameError` junto al campo), y campo Descripción con etiqueta "DESCRIPCIÓN" y placeholder "Define los objetivos primarios..." (opcional); acciones del pie: botón "Cancelar" (cierra sin guardar) y el botón principal descrito arriba.
- [ ] **IT-03** — Al confirmar, invocar `validate()`; si es válido: en modo creación, generar `id` con `crypto.randomUUID()` e invocar `createProject({ id, name, description })`; en modo edición, invocar `updateProject(initialProject.id, { name, description })`; en ambos casos cerrar el modal (`onOpenChange(false)`). Si no es válido, mantener el modal abierto con el error visible (TC-003, TC-011, TC-012).
- [ ] **IT-04** — Implementar `ProjectCard` (`project-card.tsx`): recibe un `Project` y muestra su Nombre y, si existe, su Descripción, junto con una acción "Editar" que abre `ProjectModal` en modo edición, precargado con ese Proyecto; recibe además `totalMinutes?: number` y, cuando está definido, lo muestra como "Tiempo registrado" (formato `{h}h {m}m`).
- [ ] **IT-05** — Implementar `ProjectsList` (`projects-list.tsx`): mientras `useHasHydrated()` es `false`, no leer `useProjects()` (evita hydration-mismatch, AC-004 de US-000); una vez hidratado, con Proyectos existentes renderizar un grid de `ProjectCard` (TC-007); sin Proyectos, renderizar un estado vacío sin filas ni tarjetas y sin producir error (TC-008). Calcula `calculateTotalByProject(useTimeEntries(), useTasks(), useProjects())` (`src/shared/reports/`, US-000 TK-001) y pasa a cada `ProjectCard` el `totalMinutes` de su `ProjectTotal` correspondiente (`0` si el Proyecto no aparece en el resultado, p. ej. sin Tareas con Registros).
- [ ] **IT-06** — Integrar en `src/app/proyectos/page.tsx` el encabezado "Proyectos", un botón "Nuevo Proyecto" que abre `ProjectModal` en modo creación, y `<ProjectsList />` debajo, reemplazando el `ComingSoon` de US-000 (TK-002).
- [ ] **IT-07** — Cubrir con pruebas Vitest + Testing Library (ADR-007): `use-project-form.test.ts` (Nombre vacío o solo espacios bloquea en creación y edición; Descripción es opcional; precarga de valores iniciales); `project-modal.test.tsx` (envío válido invoca `createProject` o `updateProject` según el modo, con los datos ingresados, y cierra el modal; envío con Nombre vacío no invoca ninguna de las dos y mantiene el modal abierto con el error; modo edición precarga los valores recibidos y muestra título/etiqueta "Editar Proyecto"); `project-card.test.tsx` (renderiza Nombre y Descripción; muestra "Tiempo registrado" cuando `totalMinutes` está definido y lo omite cuando no; la acción "Editar" abre el modal precargado con los datos de la tarjeta); y `projects-list.test.tsx` (con Proyectos renderiza una tarjeta por cada uno con su `totalMinutes` correcto, incluido un Proyecto en `0`; sin Proyectos renderiza el estado vacío sin error; antes de hidratar no renderiza el listado).

## Observaciones

Sin pendientes documentados.
