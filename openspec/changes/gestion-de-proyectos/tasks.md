## 1. Modelo de datos y store

- [ ] 1.1 Definir el tipo `Project` (id, nombre, descripción opcional)
- [ ] 1.2 Crear el store de Zustand de Proyectos con el middleware `persist` sobre `localStorage` (ADR-011), bajo una clave propia distinta al store de Tareas/Registros
- [ ] 1.3 Generar el id del Proyecto en el cliente (`crypto.randomUUID()`) al crearlo

## 2. Creación de Proyecto

- [ ] 2.1 Construir el modal "Nuevo Proyecto" / "Crear Nuevo Proyecto" con campos Nombre y Descripción, conforme al prototipo de Figma
- [ ] 2.2 Implementar validación: rechazar creación con Nombre vacío
- [ ] 2.3 Implementar la acción de creación: persistir el Proyecto con Nombre (y Descripción si se ingresó)
- [ ] 2.4 Añadir la acción visible "Nuevo Proyecto" / "Crear Nuevo Proyecto" que inicia el flujo

## 3. Listado y tiempo total

- [ ] 3.1 Construir el listado de Proyectos en tarjetas (Nombre, Descripción, Tiempo Registrado), conforme al prototipo de Figma
- [ ] 3.2 Implementar el estado vacío del listado cuando no existe ningún Proyecto
- [ ] 3.3 Implementar el selector/hook que calcula el Tiempo Registrado por Proyecto combinando el store de Proyectos con el store de Tareas/Registros (sin acoplarlos directamente)
- [ ] 3.4 Manejar el caso de Proyecto sin Tareas o sin Registros de Tiempo, mostrando Tiempo Registrado en cero

## 4. Verificación

- [ ] 4.1 Pruebas unitarias del store: creación de Proyecto (happy/error de Nombre vacío) — TC-001 a TC-003
- [ ] 4.2 Pruebas unitarias del selector de tiempo total: con Tareas/Registros, y sin ellos — TC-008, TC-009
- [ ] 4.3 Pruebas de componente: listado de tarjetas y estado vacío, acción "Nuevo Proyecto" — TC-005 a TC-007
- [ ] 4.4 Ejecutar `npm run lint` y la suite de pruebas unitarias antes de cerrar el change
