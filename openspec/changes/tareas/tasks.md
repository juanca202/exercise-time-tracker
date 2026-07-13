## 1. Fundamentos

- [ ] 1.1 Scaffoldear `src/features/tasks` según ADR-005 (si no está presente ya desde `fundamentos`; incluye el cronómetro y los submódulos de entrada manual, colocados según el layout de Figma).

## 2. Gestión de Tareas

- [ ] 2.1 Implementar un selector derivado "listar Tareas por Proyecto" en `src/features/tasks`, construido sobre el `listTasks` crudo de `fundamentos`.
- [ ] 2.2 Implementar la validación `isValidTask` (Proyecto seleccionado + Nombre no vacío) compartida por los flujos de creación y edición.
- [ ] 2.3 Construir el modal "Nueva Tarea" / "Editar Tarea" (select de Proyecto, poblado desde el `listProjects` crudo de `fundamentos` + input de Nombre), reutilizando el patrón de modal de creación/edición del change `proyectos`.
- [ ] 2.4 Conectar el modal a las acciones crudas `addTask`/`updateTask` de `fundamentos` y verificar que los datos (incluida la asociación de Proyecto) sobrevivan al reload.
- [ ] 2.5 Aplicar los tokens de DESIGN.md al modal de Tarea.

## 3. Cronómetro

- [ ] 3.1 Implementar el estado `activeTimer` (usando el tipo de `fundamentos`) y su selector "¿el cronómetro de esta Tarea está corriendo?", local a la feature `src/features/tasks`.
- [ ] 3.2 Implementar `isValidDuration(minutes)` (`> 0`) como guard compartido usado tanto por el cronómetro como por la entrada manual.
- [ ] 3.3 Implementar `startTimer(taskId)`: si hay otro cronómetro activo en una Tarea distinta, detenerlo y persistirlo primero (auto-detención, BR-02/BR-03), luego establecer el nuevo `activeTimer`.
- [ ] 3.4 Implementar `stopTimer()`: calcular Duración = ahora − startedAt, validar con `isValidDuration`, y persistir el Registro de Tiempo resultante vía el `addTimeRecord` crudo de `fundamentos`; descartar si no es válido.
- [ ] 3.5 Probar unitariamente la máquina de estados del cronómetro de forma directa (iniciar / auto-detener / detener / rechazo de duración cero) antes de conectar la UI.
- [ ] 3.6 Conectar el ícono ▷ de cada fila de Tarea a `startTimer(taskId)`.
- [ ] 3.7 Construir la tarjeta de cronómetro activo (nombre de la Tarea, etiqueta de proyecto/fase, contador de tiempo transcurrido, botón "Detener Sesión") según Figma.
- [ ] 3.8 Confirmar que iniciar/detener-y-persistir se completa en menos de 1 segundo (AC-012).

## 4. Entrada manual de tiempo

- [ ] 4.1 Implementar `addManualTimeRecord({ taskId, date, durationMinutes })` usando `isValidDuration`, persistiendo vía el `addTimeRecord` crudo de `fundamentos`.
- [ ] 4.2 Construir el formulario "Entrada Manual" (Fecha, combobox Proyecto/Tarea, Duración, "Guardar Registro") según Figma.
- [ ] 4.3 Conectar el envío del formulario a `addManualTimeRecord`, con un estado de error inline cuando la Duración no sea > 0.
- [ ] 4.4 Verificar que los Registros de Tiempo manuales persistan y sobrevivan al reload.

## 5. Meta semanal y total semanal

- [ ] 5.1 Implementar `getWorkweekRange(date: Date)` devolviendo lunes 00:00:00–viernes 23:59:59 de la semana que contiene a `date`, con el lunes fijado como inicio de semana.
- [ ] 5.2 Implementar `WEEKLY_GOAL_MINUTES = 480` (8h × 5 días) como constante fija, no configurable.
- [ ] 5.3 Implementar un selector que sume los Registros de Tiempo (cronómetro + manual) cuya fecha caiga dentro de `getWorkweekRange(now)`, excluyendo sábado/domingo y la semana calendario anterior.
- [ ] 5.4 Implementar el cálculo de porcentaje de la Meta Semanal `(weeklyTotal / WEEKLY_GOAL_MINUTES) * 100`, sin capar por encima del 100%.
- [ ] 5.5 Construir el texto "Has alcanzado el X% de tu meta semanal" y la tarjeta de estadística "TOTAL SEMANAL" en la pantalla de Tareas según Figma.

## 6. Ensamblaje de la pantalla de Tareas

- [ ] 6.1 Construir la tarjeta de estadística "TOTAL MENSUAL" usando el `getRecordMonth` compartido de `fundamentos` sobre el mes calendario actual.
- [ ] 6.2 Construir la lista "Tareas Recientes" (tareas recientes con duración/estado y la affordance ▷ para iniciar el cronómetro) según Figma.
- [ ] 6.3 Ensamblar la pantalla completa de Tareas (tarjeta de cronómetro activo + Entrada Manual + tarjetas de estadísticas + Tareas Recientes) y conectar el botón "Nueva Tarea".
- [ ] 6.4 Aplicar los tokens de DESIGN.md a la pantalla completa de Tareas.
- [ ] 6.5 Realizar un pase de QA visual de la pantalla de Tareas contra el frame "Tareas" de Figma.

## 7. Verificación

- [ ] 7.1 Confirmar que la pantalla de Tareas es completamente utilizable con la red deshabilitada (offline-first).
- [ ] 7.2 Ejecutar los casos de prueba `TC-XXX` existentes bajo `docs/specs/user-stories/US-002-tareas/test-cases/` contra la implementación y registrar los resultados.
- [ ] 7.3 Confirmar que cada `AC-XXX` de US-002 se cumple de extremo a extremo.
