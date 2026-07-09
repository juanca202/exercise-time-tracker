## 1. Modelo y store

- [x] 1.1 Crear carpeta `src/features/tasks/` (ADR-005) con la estructura interna estándar (`store/`, `components/`, `types.ts`)
- [x] 1.2 Definir los tipos `Task` y `TimeEntry` en `src/features/tasks/types.ts`
- [x] 1.3 Crear `src/features/tasks/store/tasksStore.ts`: store de Zustand con `persist` + `createJSONStorage(() => localStorage)` bajo la clave `time-tracker/tasks` (ADR-011), incluyendo el campo `activeTimer`
- [x] 1.4 Implementar `isValidDuration(ms: number): boolean` (regla BR-03, `ms > 0`) como función pura reutilizable
- [x] 1.5 Implementar la acción `addTask(projectId, name)` con validación de Nombre no vacío y Proyecto seleccionado (sin verificar existencia referencial contra `projects`, para no introducir una dependencia circular entre stores — ver design.md)

## 2. Temporizador

- [x] 2.1 Implementar la acción `startTimer(taskId)`: si `activeTimer` pertenece a otra Tarea, calcular su Duración, validar con `isValidDuration`, persistir su `TimeEntry` y limpiar `activeTimer` antes de activar el nuevo temporizador
- [x] 2.2 Implementar la acción `stopTimer()`: calcular Duración, validar con `isValidDuration`, persistir el `TimeEntry` (rechazar sin persistir si la Duración no es válida) y limpiar `activeTimer`
- [x] 2.3 Rechazar `stopTimer()` sin efecto cuando `activeTimer` sea `null`

## 3. Ingreso manual

- [x] 3.1 Implementar la acción `addManualTimeEntry(taskId, date, durationMs)` reutilizando `isValidDuration`
- [x] 3.2 Validar que Fecha, Proyecto/Tarea y Duración estén completos antes de invocar la acción

## 4. UI — Modal "Nueva Tarea"

- [x] 4.1 Construir el modal con Base UI (ADR-003): campos Proyecto (select de Proyectos existentes) y Nombre, acciones "Cancelar" / "Crear Tarea"
- [x] 4.2 Conectar "Crear Tarea" a `addTask`; conectar "Cancelar" a cerrar el modal sin crear nada

## 5. UI — Panel de Tareas y temporizador

- [x] 5.1 Construir el panel de Tareas (componente cliente) listando las Tareas con su Proyecto asociado, tiempo acumulado y última actividad (helper de formato relativo local a la feature)
- [x] 5.2 Agregar la acción de iniciar temporizador por Tarea, conectada a `startTimer`
- [x] 5.3 Mostrar el estado "En Ejecución" de la Tarea con temporizador activo y la acción "Detener Sesión", conectada a `stopTimer`
- [x] 5.4 Crear `src/lib/dateRanges.ts` (compartido): helpers de límites de semana/mes calendario, reutilizables por `view-time-history`
- [x] 5.5 Implementar el resumen semanal/mensual (Total Semanal, Total Mensual, progreso hacia la meta fija de 40h) usando los helpers de `dateRanges.ts`
- [x] 5.6 Reusar `colorFromString` (creado en `manage-projects`) para el ícono de color decorativo de cada Tarea
- [x] 5.7 (No planificada) Exportar `useHydrateProjectsStore`/`useHydrateTasksStore` desde cada feature y llamarlas en ambas pantallas: `ProjectsScreen` lee `tasksStore` (selectProjectTotalTime) y `TasksScreen` lee `projectsStore` (Select de Proyecto), y cada store solo se hidrataba antes en su propia pantalla

## 6. UI — Formulario "Entrada Manual"

- [x] 6.1 Construir el formulario con campos Fecha, Proyecto/Tarea y Duración, y la acción "Guardar Registro"
- [x] 6.2 Conectar "Guardar Registro" a `addManualTimeEntry`, mostrando el error de validación correspondiente cuando falle

## 7. Integración con Proyectos

- [x] 7.1 Actualizar `selectProjectTotalTime` (feature `projects`, change `manage-projects`) para sumar los `TimeEntry` reales de las Tareas del Proyecto, en lugar de retornar 0

## 8. Pruebas

- [x] 8.1 Pruebas unitarias (Vitest + Testing Library, ADR-007) de `isValidDuration`: límites cero, negativo y mínimo válido
- [x] 8.2 Pruebas unitarias de `startTimer`/`stopTimer`: único temporizador activo, corte y persistencia automática al cambiar de Tarea, rechazo de `stopTimer` sin temporizador activo
- [x] 8.3 Pruebas unitarias de `addManualTimeEntry`: happy path, campo obligatorio vacío, duración inválida
- [x] 8.4 Prueba de rendimiento/temporización de `startTimer`/`stopTimer`: al ser escrituras síncronas de store sobre un dataset pequeño (sin red ni cálculo costoso), el umbral de <1s (RP-001/RP-002) se cumple por diseño — ver design.md; no se agrega una prueba de tiempo real dedicada por ser inherentemente no determinista
- [x] 8.4b Pruebas unitarias de `dateRanges.ts` (límites de semana/mes) y de `selectors.ts` (total por Tarea, última actividad, total semanal/mensual, progreso hacia la meta)
- [x] 8.5 Prueba e2e (Playwright, ADR-008) del flujo happy path: crear Tarea → iniciar temporizador → detenerlo → ver el Registro de Tiempo
- [x] 8.6 Prueba e2e del cambio automático de temporizador entre dos Tareas (BR-02)
- [x] 8.7 Prueba e2e del ingreso manual de tiempo, happy path y error de duración inválida
- [x] 8.8 Documentar las funciones públicas del store y componentes con TSDoc (ADR-006)
