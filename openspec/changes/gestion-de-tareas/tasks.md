## 1. Modelo de datos y stores

- [ ] 1.1 Definir el tipo `Task` (id, nombre, projectId) y el tipo `TimeEntry` (id, taskId, startedAt, endedAt, durationSeconds, source: "timer" | "manual")
- [ ] 1.2 Crear el store de Zustand de Tareas + Registros de Tiempo con el middleware `persist` sobre `localStorage` (ADR-011), bajo claves propias distintas al store de Proyectos
- [ ] 1.3 Modelar el temporizador activo como estado derivado `{ taskId, startedAt } | null` (no como un `TimeEntry` parcial)
- [ ] 1.4 Implementar el cálculo de duración con precisión de segundos (`Math.floor((finMs - inicioMs) / 1000)`)

## 2. Creación de Tarea

- [ ] 2.1 Construir el modal "Nueva Tarea" con campos Proyecto y Nombre, y acciones "Cancelar" / "Crear Tarea", conforme al prototipo de Figma
- [ ] 2.2 Implementar validación: rechazar creación con Nombre vacío
- [ ] 2.3 Implementar validación: rechazar creación sin Proyecto seleccionado
- [ ] 2.4 Implementar la acción "Crear Tarea": persistir la Tarea con su asociación al Proyecto
- [ ] 2.5 Implementar la acción "Cancelar": cerrar el modal sin crear ninguna Tarea

## 3. Temporizador único de la aplicación

- [ ] 3.1 Implementar "Iniciar temporizador" para una Tarea específica desde el panel de Tareas
- [ ] 3.2 Implementar el reemplazo automático de temporizador como operación atómica: calcular duración del anterior → validar > 0 → persistir su `TimeEntry` → limpiar temporizador anterior → setear el nuevo
- [ ] 3.3 Implementar "Detener Sesión" para el temporizador activo
- [ ] 3.4 Implementar validación: rechazar la acción "Detener Sesión" cuando no hay temporizador activo
- [ ] 3.5 Al detener, calcular Duración (Hora Fin − Hora Inicio) y persistir el `TimeEntry` de inmediato
- [ ] 3.6 Implementar validación: rechazar y no persistir un `TimeEntry` de temporizador con Duración ≤ 0
- [ ] 3.7 Persistir `startedAt` del temporizador en cuanto se inicia (no solo al detenerlo), para soportar recuperación tras cierre inesperado

## 4. Registro manual de tiempo

- [ ] 4.1 Construir el formulario "Entrada Manual" con campos Fecha, Proyecto/Tarea y Duración
- [ ] 4.2 Implementar validación: rechazar el registro si falta algún campo obligatorio
- [ ] 4.3 Implementar validación: rechazar Duración negativa o igual a cero
- [ ] 4.4 Implementar la acción "Guardar Registro": persistir el `TimeEntry` manual de inmediato

## 5. Verificación

- [ ] 5.1 Pruebas unitarias del store: creación de Tarea (happy/errores), reemplazo automático de temporizador, cálculo y validación de duración (timer y manual) — TC-001 a TC-004, TC-007 a TC-020
- [ ] 5.2 Pruebas de componente: modal "Nueva Tarea" (presentación y cancelar) y formulario "Entrada Manual" — TC-005, TC-006
- [ ] 5.3 Medir que iniciar el temporizador y persistir el registro al detenerlo tomen cada uno menos de 1 segundo — TC-021, TC-022
- [ ] 5.4 Ejecutar `npm run lint` y la suite de pruebas unitarias antes de cerrar el change
