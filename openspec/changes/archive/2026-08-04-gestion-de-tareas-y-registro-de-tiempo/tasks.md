## 1. Modelo de datos

- [x] 1.1 Definir el tipo `Tarea` (`id`, `projectId`, `name`) y su persistencia CRUD cruda en `localStorage`
- [x] 1.2 Definir el tipo `RegistroDeTiempo` (`id`, `taskId`, `source`, `date`, `durationSeconds`, `startTime?`, `endTime?`) usando `durationSeconds` (entero) en vez de `durationMinutes`
- [x] 1.3 Envolver las escrituras de Tarea y Registro de Tiempo en `try/catch`, detectando `QuotaExceededError` — delegado a `zustand/middleware`'s `persist` + `createJSONStorage` (ver `gestion-de-proyectos/design.md`)

## 2. Gestión de Tareas

- [x] 2.1 Store de feature de Tareas: crear Tarea validando Proyecto existente y Nombre no vacío — implementado como hook `useTaskActions` (mismo patrón que `useProjectActions`, sin estado propio distinto del de los stores raíz); Nombre obligatorio vía `required` nativo del formulario
- [x] 2.2 Editar Tarea: cambiar Nombre y/o reasignar a otro Proyecto existente (validando su existencia)
- [x] 2.3 Eliminar Tarea: bloquear si tiene Registros de Tiempo asociados, mostrando el aviso correspondiente
- [x] 2.4 UI: modal "Nueva Tarea" (selector de Proyecto + Nombre) fiel a `figma-nueva-tarea.png` — validado además contra el diseño de alta fidelidad en Figma vía MCP (nodo 1:1539)
- [x] 2.5 UI: listado de "Tareas Recientes" con acciones de editar y eliminar

## 3. Temporizador

- [x] 3.1 Store de feature de Temporizador: iniciar temporizador (guardar estado "En Ejecución", `startTime`, `taskId`) — `useTimerStore` (Zustand + `persist`), único store de feature real de esta change (estado transitorio genuino, tal como anticipa ADR-012)
- [x] 3.2 Detención automática del temporizador anterior al iniciar uno nuevo para otra Tarea (calcular, validar y persistir su Registro de Tiempo antes de iniciar el nuevo)
- [x] 3.3 Detener temporizador activo: calcular Duración, validar > 0, persistir de inmediato
- [x] 3.4 Descartar (sin persistir) un Registro de Tiempo con Duración ≤ 0 al auto-detener, sin bloquear el inicio del nuevo temporizador
- [x] 3.5 Asignar la Fecha del Registro de Tiempo del temporizador según `startTime` (incluyendo el caso de cruce de medianoche)
- [x] 3.6 UI: control "Iniciar"/"Detener" que oculta "Iniciar" para la Tarea con temporizador ya activo (evita el reinicio sobre la misma Tarea) — reemplazado por una etiqueta "En ejecución" en `RecentTasksList`
- [x] 3.7 UI: panel de sesión activa con estado, Tarea asociada y tiempo transcurrido en vivo, fiel a `figma-tareas.png` — validado además contra Figma vía MCP (nodo 1:1394)

## 4. Registro Manual

- [x] 4.1 Store de feature de Registro Manual: crear Registro de Tiempo validando Duración > 0 y Fecha no futura — hook `useManualTimeEntryActions`
- [x] 4.2 UI: panel "Entrada Manual" (Fecha, Proyecto/Tarea, Duración, botón "Guardar Registro") fiel a `figma-tareas.png` — Duración en formato `HH:MM` parseado a segundos (`parseDurationInput`)

## 5. Rendimiento

- [x] 5.1 Verificar que iniciar el temporizador refleja el estado "En Ejecución" en menos de 1 segundo — actualización de estado local de Zustand, sin operaciones asíncronas; validado interactivamente en el navegador
- [x] 5.2 Verificar que detener el temporizador persiste el Registro de Tiempo en menos de 1 segundo — ídem, escritura síncrona en `localStorage` vía el adaptador

## 6. Pruebas

- [x] 6.1 Pruebas unitarias del store de Tareas (crear, editar, reasignar, eliminar con bloqueo)
- [x] 6.2 Pruebas unitarias del store de Temporizador (inicio, detención automática, validación de duración, descarte de duración ≤ 0)
- [x] 6.3 Pruebas unitarias del store de Registro Manual (validación de duración y de fecha)
- [x] 6.4 Pruebas de componentes (Testing Library) de los tres paneles de UI
- [x] 6.5 Validar visualmente contra `figma-nueva-tarea.png` y `figma-tareas.png` — validado además contra el diseño de alta fidelidad en Figma vía MCP y probado interactivamente (crear Tarea, iniciar/detener temporizador, registro manual, bloqueo de eliminación, persistencia tras recarga)
